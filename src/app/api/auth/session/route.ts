import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCESS_TOKEN_COOKIE_NAME = "pawguard.access_token";

/**
 * POST /api/auth/session
 * Accepts { access_token: string; expires_in?: number } in body
 * Sets secure HttpOnly cookie for session access token.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = body?.access_token || body?.accessToken;
    const expiresIn = typeof body?.expires_in === "number" ? body.expires_in : 604800; // default 7 days

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { success: false, message: "Invalid or missing access_token parameter." },
        { status: 400 }
      );
    }

    const response = NextResponse.json({ success: true, message: "Session cookie established." });

    response.cookies.set({
      name: ACCESS_TOKEN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn,
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to parse session request payload." },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/auth/session
 * Clears the secure HttpOnly session cookie on logout.
 */
export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Session cookie cleared." });

  response.cookies.set({
    name: ACCESS_TOKEN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}
