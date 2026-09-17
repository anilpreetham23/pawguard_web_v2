import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if current route is protected
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Check for session marker or auth cookie
  const hasSessionCookie =
    request.cookies.has("pg_session_active") ||
    request.cookies.has("pawguard.access_token") ||
    request.cookies.has("pawguard.refresh_token") ||
    request.cookies.has("access_token");

  if (!hasSessionCookie) {
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
