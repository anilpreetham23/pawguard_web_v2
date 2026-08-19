/**
 * Session helpers: token access, persistence, and auth-state checks.
 * No UI here — this is pure infrastructure the request client and future
 * auth features build on.
 */

import { AUTH_TOKEN_STORAGE_KEYS } from "../constants";
import type { AuthTokens } from "../types";
import {
  getStoredToken,
  removeStoredToken,
  setStoredToken,
} from "./token-storage";

const { accessToken: ACCESS_KEY, refreshToken: REFRESH_KEY } =
  AUTH_TOKEN_STORAGE_KEYS;

/** Persist access/refresh tokens returned by login/refresh. */
export function setAuthTokens(tokens: AuthTokens): void {
  if (tokens.accessToken) setStoredToken(ACCESS_KEY, tokens.accessToken);
  if (tokens.refreshToken) setStoredToken(REFRESH_KEY, tokens.refreshToken);
}

/** Persist just the access token (used after a refresh). */
export function setAccessToken(token: string): void {
  setStoredToken(ACCESS_KEY, token);
}

/** Persist just the refresh token. */
export function setRefreshToken(token: string): void {
  setStoredToken(REFRESH_KEY, token);
}

/** Current access token, or `null` when signed out. */
export function getAccessToken(): string | null {
  return getStoredToken(ACCESS_KEY);
}

/** Current refresh token, or `null` when signed out / token not issued. */
export function getRefreshToken(): string | null {
  return getStoredToken(REFRESH_KEY);
}

/** Remove all stored auth tokens. */
export function clearAuthTokens(): void {
  removeStoredToken(ACCESS_KEY);
  removeStoredToken(REFRESH_KEY);
}

/* -------------------------------------------------------------------------- */
/* Token validity                                                             */
/* -------------------------------------------------------------------------- */

/** Decode the unverified JWT payload of an access token. */
export function decodeAccessTokenPayload(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const decoded = decodeURIComponent(
      atob(padded)
        .split("")
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join("")
    );
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Expiration timestamp (ms) of the access token, or `null` if unknown. */
export function getAccessTokenExpiry(): number | null {
  const token = getAccessToken();
  if (!token) return null;
  const payload = decodeAccessTokenPayload(token);
  const exp = payload?.exp;
  return typeof exp === "number" ? exp * 1000 : null;
}

/** True when a non-expired access token is present. */
export function isAccessTokenValid(): boolean {
  const token = getAccessToken();
  if (!token) return false;
  const expiry = getAccessTokenExpiry();
  // Without an `exp` claim we optimistically treat the token as valid.
  return expiry === null || expiry > Date.now();
}

/** True when the user has a usable session. */
export function isAuthenticated(): boolean {
  return isAccessTokenValid();
}
