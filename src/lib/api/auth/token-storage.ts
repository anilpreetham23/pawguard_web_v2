/**
 * Client-safe in-memory token and session storage.
 *
 * Prevents raw JWT access and refresh tokens from being persisted in `localStorage`
 * or `sessionStorage` to eliminate XSS token theft risks. Transient tokens are stored
 * in memory during the runtime session, while canonical session persistence is handled
 * via HttpOnly cookies issued by server endpoints (/api/auth/session) and `withCredentials` API requests.
 */

import { AUTH_TOKEN_STORAGE_KEYS } from "../constants";

const memoryStorage = new Map<string, string>();

export function getStoredToken(key: string): string | null {
  return memoryStorage.get(key) ?? null;
}

export function setStoredToken(key: string, value: string): void {
  memoryStorage.set(key, value);
  if (typeof window !== "undefined" && key === AUTH_TOKEN_STORAGE_KEYS.accessToken) {
    // Notify server boundary route handler to set HttpOnly session cookie
    fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: value }),
    }).catch(() => {
      // Ignore network errors on background session sync
    });
  }
}

export function removeStoredToken(key: string): void {
  memoryStorage.delete(key);
  if (typeof window !== "undefined" && key === AUTH_TOKEN_STORAGE_KEYS.accessToken) {
    // Notify server boundary route handler to clear HttpOnly session cookie
    fetch("/api/auth/session", {
      method: "DELETE",
    }).catch(() => {
      // Ignore network errors on background session sync
    });
  }
}

/** True when a token key is currently populated in memory storage. */
export function hasStoredToken(key: string): boolean {
  return getStoredToken(key) !== null;
}

export { AUTH_TOKEN_STORAGE_KEYS };
