/**
 * Client-safe in-memory token and session storage.
 *
 * Prevents raw JWT access and refresh tokens from being persisted in `localStorage`
 * or `sessionStorage` to eliminate XSS token theft risks. Transient tokens are stored
 * in memory during the runtime session, while canonical session persistence is handled
 * via HttpOnly cookies and `withCredentials` API requests.
 */

import { AUTH_TOKEN_STORAGE_KEYS } from "../constants";

const memoryStorage = new Map<string, string>();

export function getStoredToken(key: string): string | null {
  return memoryStorage.get(key) ?? null;
}

export function setStoredToken(key: string, value: string): void {
  memoryStorage.set(key, value);
  // Set a lightweight, non-sensitive session indicator cookie for middleware route gating
  if (typeof document !== "undefined") {
    document.cookie = `pg_session_active=1; path=/; max-age=604800; SameSite=Lax`;
  }
}

export function removeStoredToken(key: string): void {
  memoryStorage.delete(key);
  if (typeof document !== "undefined") {
    document.cookie = `pg_session_active=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}

/** True when a token key is currently populated in memory storage. */
export function hasStoredToken(key: string): boolean {
  return getStoredToken(key) !== null;
}

export { AUTH_TOKEN_STORAGE_KEYS };
