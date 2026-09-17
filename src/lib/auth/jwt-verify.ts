/**
 * Cryptographic JWT Signature Verification Service (Edge & Node compatible)
 * F-03: Real Web Crypto signature verification for Next.js Edge Middleware
 */

export interface JwtVerifyOptions {
  secret?: string;
  publicKeyPem?: string;
  allowedAlgorithms?: string[];
  issuer?: string;
  audience?: string;
}

export interface JwtHeader {
  alg: string;
  typ?: string;
  [key: string]: unknown;
}

export interface JwtPayload {
  sub?: string;
  exp?: number;
  nbf?: number;
  iat?: number;
  iss?: string;
  aud?: string | string[];
  [key: string]: unknown;
}

const DEFAULT_SECRET = process.env.JWT_SECRET || process.env.NEXT_SERVER_JWT_SECRET || "pawguard_jwt_secret_key_2026_production";
const DEFAULT_ALLOWED_ALGS = ["HS256", "RS256"];

function base64UrlToUint8Array(base64Url: string): Uint8Array {
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const binaryStr = atob(padded);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return bytes;
}

function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

/**
 * Helper to generate a validly signed HS256 JWT for tests and server signing.
 */
export async function createSignedTestJwt(
  payloadObj: Record<string, unknown>,
  secret: string = DEFAULT_SECRET,
  headerOverride?: Record<string, unknown>
): Promise<string> {
  const header = { alg: "HS256", typ: "JWT", ...headerOverride };
  const encodedHeader = btoa(JSON.stringify(header))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const encodedPayload = btoa(JSON.stringify(payloadObj))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const unsignedToken = `${encodedHeader}.${encodedPayload}`;

  const keyData = stringToUint8Array(secret);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData.buffer as BufferSource,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const unsignedBytes = stringToUint8Array(unsignedToken);
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    unsignedBytes.buffer as BufferSource
  );

  const signatureArray = new Uint8Array(signatureBuffer);
  let binaryStr = "";
  for (let i = 0; i < signatureArray.length; i++) {
    binaryStr += String.fromCharCode(signatureArray[i]);
  }
  const encodedSignature = btoa(binaryStr)
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${unsignedToken}.${encodedSignature}`;
}

/**
 * Cryptographically verifies a JWT signature and claim constraints.
 */
export async function verifyJwtTokenCryptographically(
  token: string | null | undefined,
  options?: JwtVerifyOptions
): Promise<boolean> {
  if (!token || typeof token !== "string") return false;

  const parts = token.trim().split(".");
  if (parts.length !== 3) return false;

  const [headerB64, payloadB64, signatureB64] = parts;
  if (!headerB64 || !payloadB64 || !signatureB64) return false;

  let header: JwtHeader;
  let payload: JwtPayload;

  // 1. Validate Header JSON
  try {
    const headerStr = new TextDecoder().decode(base64UrlToUint8Array(headerB64));
    header = JSON.parse(headerStr);
  } catch {
    return false;
  }

  // 2. Validate Payload JSON
  try {
    const payloadStr = new TextDecoder().decode(base64UrlToUint8Array(payloadB64));
    payload = JSON.parse(payloadStr);
  } catch {
    return false;
  }

  // 3. Validate Algorithm Allow-List (reject alg: "none" or unapproved algs)
  const allowedAlgs = options?.allowedAlgorithms || DEFAULT_ALLOWED_ALGS;
  if (!header.alg || typeof header.alg !== "string") return false;
  if (!allowedAlgs.includes(header.alg.toUpperCase())) return false;
  if (header.alg.toLowerCase() === "none") return false;

  // 4. Validate Expiration (exp)
  if (typeof payload.exp === "number") {
    const nowSeconds = Math.floor(Date.now() / 1000);
    if (payload.exp <= nowSeconds) {
      return false;
    }
  }

  // 5. Validate Issuer (iss) if configured
  const expectedIssuer = options?.issuer || process.env.JWT_ISSUER;
  if (expectedIssuer) {
    if (payload.iss !== expectedIssuer) {
      return false;
    }
  }

  // 6. Validate Audience (aud) if configured
  const expectedAudience = options?.audience || process.env.JWT_AUDIENCE;
  if (expectedAudience) {
    if (Array.isArray(payload.aud)) {
      if (!payload.aud.includes(expectedAudience)) return false;
    } else if (payload.aud !== expectedAudience) {
      return false;
    }
  }

  // 7. Cryptographic Signature Verification via Web Crypto API
  try {
    const dataToVerify = stringToUint8Array(`${headerB64}.${payloadB64}`);
    const signatureBytes = base64UrlToUint8Array(signatureB64);

    if (header.alg === "HS256") {
      const secret = options?.secret || DEFAULT_SECRET;
      const keyBytes = stringToUint8Array(secret);

      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyBytes.buffer as BufferSource,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["verify"]
      );

      const isValid = await crypto.subtle.verify(
        "HMAC",
        cryptoKey,
        signatureBytes.buffer as BufferSource,
        dataToVerify.buffer as BufferSource
      );

      return isValid;
    }

    if (header.alg === "RS256") {
      const pem = options?.publicKeyPem || process.env.JWT_PUBLIC_KEY;
      if (!pem) return false;

      const cleanPem = pem
        .replace(/-----BEGIN PUBLIC KEY-----/, "")
        .replace(/-----END PUBLIC KEY-----/, "")
        .replace(/\s+/g, "");

      const keyBytes = base64UrlToUint8Array(cleanPem);

      const cryptoKey = await crypto.subtle.importKey(
        "spki",
        keyBytes.buffer as BufferSource,
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["verify"]
      );

      const isValid = await crypto.subtle.verify(
        "RSASSA-PKCS1-v1_5",
        cryptoKey,
        signatureBytes.buffer as BufferSource,
        dataToVerify.buffer as BufferSource
      );

      return isValid;
    }

    return false;
  } catch {
    return false;
  }
}
