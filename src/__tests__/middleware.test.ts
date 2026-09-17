import { describe, it, expect } from "vitest";
import { verifyJwtToken } from "../middleware";
import { createSignedTestJwt, verifyJwtTokenCryptographically } from "../lib/auth/jwt-verify";

describe("F-03 — Cryptographic JWT Verification Security Tests", () => {
  it("1. accepts valid signed JWT", async () => {
    const validToken = await createSignedTestJwt({
      sub: "user-123",
      exp: Math.floor(Date.now() / 1000) + 3600,
    });
    const result = await verifyJwtToken(validToken);
    expect(result).toBe(true);
  });

  it("2. rejects expired signed JWT", async () => {
    const expiredToken = await createSignedTestJwt({
      sub: "user-123",
      exp: Math.floor(Date.now() / 1000) - 3600, // expired 1 hour ago
    });
    const result = await verifyJwtToken(expiredToken);
    expect(result).toBe(false);
  });

  it("3. rejects malformed JWT", async () => {
    expect(await verifyJwtToken("not.a.valid.jwt")).toBe(false);
    expect(await verifyJwtToken("invalid_base64.invalid_base64.signature")).toBe(false);
    expect(await verifyJwtToken("header.payload")).toBe(false);
  });

  it("4. rejects missing/null/empty JWT", async () => {
    expect(await verifyJwtToken(null)).toBe(false);
    expect(await verifyJwtToken(undefined)).toBe(false);
    expect(await verifyJwtToken("")).toBe(false);
  });

  it("5. rejects valid-looking unsigned token", async () => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({ sub: "user-123", exp: Math.floor(Date.now() / 1000) + 3600 }));
    const unsignedToken = `${header}.${payload}.mock_signature_string`;
    expect(await verifyJwtToken(unsignedToken)).toBe(false);
  });

  it("6. rejects valid payload with forged signature", async () => {
    const validToken = await createSignedTestJwt({
      sub: "user-123",
      exp: Math.floor(Date.now() / 1000) + 3600,
    });
    const parts = validToken.split(".");
    const forgedToken = `${parts[0]}.${parts[1]}.forged_signature_bytes_12345`;
    expect(await verifyJwtToken(forgedToken)).toBe(false);
  });

  it("7. rejects modified payload with old signature", async () => {
    const validToken = await createSignedTestJwt({
      sub: "user-123",
      role: "user",
      exp: Math.floor(Date.now() / 1000) + 3600,
    });
    const parts = validToken.split(".");

    // Alter payload to claim admin role without updating signature
    const modifiedPayloadB64 = btoa(JSON.stringify({
      sub: "user-123",
      role: "admin",
      exp: Math.floor(Date.now() / 1000) + 3600,
    }))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    const tamperedToken = `${parts[0]}.${modifiedPayloadB64}.${parts[2]}`;
    expect(await verifyJwtToken(tamperedToken)).toBe(false);
  });

  it("8. rejects disallowed algorithm (e.g. alg=none)", async () => {
    const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    const payload = btoa(JSON.stringify({ sub: "user-123", exp: Math.floor(Date.now() / 1000) + 3600 }))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    const algNoneToken = `${header}.${payload}.`;
    expect(await verifyJwtToken(algNoneToken)).toBe(false);
  });

  it("9. rejects wrong issuer if issuer is configured", async () => {
    const tokenWithWrongIssuer = await createSignedTestJwt({
      sub: "user-123",
      exp: Math.floor(Date.now() / 1000) + 3600,
      iss: "malicious-issuer.com",
    });

    const result = await verifyJwtTokenCryptographically(tokenWithWrongIssuer, {
      issuer: "pawguard-auth-server",
    });
    expect(result).toBe(false);
  });

  it("10. rejects wrong audience if audience is configured", async () => {
    const tokenWithWrongAudience = await createSignedTestJwt({
      sub: "user-123",
      exp: Math.floor(Date.now() / 1000) + 3600,
      aud: "other-app",
    });

    const result = await verifyJwtTokenCryptographically(tokenWithWrongAudience, {
      audience: "pawguard-public-web",
    });
    expect(result).toBe(false);
  });
});
