import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwtTokenCryptographically } from "./lib/auth/jwt-verify";

// Protected route paths requiring authentication
const PROTECTED_PREFIXES = [
  "/account",
  "/applications",
  "/appointments",
  "/foster/dashboard",
  "/volunteer/dashboard",
  "/notifications",
  "/reminders",
  "/scan",
];

/**
 * Verifies cryptographic signature, structural validity, algorithm allow-list,
 * and expiration of a JWT access token using Edge Web Crypto API.
 */
export async function verifyJwtToken(token: string | null | undefined): Promise<boolean> {
  return verifyJwtTokenCryptographically(token);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if current route is protected
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Extract candidate tokens from cookies or Authorization header
  const accessTokenCookie =
    request.cookies.get("pawguard.access_token")?.value ||
    request.cookies.get("access_token")?.value ||
    request.cookies.get("session_token")?.value;

  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  const candidateToken = accessTokenCookie || bearerToken;

  // Cryptographically verify candidate token
  const isValidSession = await verifyJwtToken(candidateToken);

  if (!isValidSession) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*",
    "/applications/:path*",
    "/appointments/:path*",
    "/foster/dashboard/:path*",
    "/volunteer/dashboard/:path*",
    "/notifications/:path*",
    "/reminders/:path*",
    "/scan/:path*",
  ],
};
