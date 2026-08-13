/**
 * Client-safe token storage.
 *
 * Uses `localStorage` in the browser and falls back to an in-memory map
 * during server-side rendering so the app never crashes on the server.
 * Keys are centralized in `AUTH_TOKEN_STORAGE_KEYS`.
 */

import { AUTH_TOKEN_STORAGE_KEYS } from "../constants";

const memoryStorage = new Map<string, string>();

function isClient(): boolean {
  return typeof window !== "undefined";
}

function canUseLocalStorage(): boolean {
  if (!isClient()) return false;
  try {
    const probe = "__pawguard_storage_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

export function getStoredToken(key: string): string | null {
  if (canUseLocalStorage()) {
    return window.localStorage.getItem(key);
  }
  return memoryStorage.get(key) ?? null;
}

export function setStoredToken(key: string, value: string): void {
  if (canUseLocalStorage()) {
    window.localStorage.setItem(key, value);
  } else {
    memoryStorage.set(key, value);
  }
}

export function removeStoredToken(key: string): void {
  if (canUseLocalStorage()) {
    window.localStorage.removeItem(key);
  } else {
    memoryStorage.delete(key);
  }
}

/** True when a token key is currently populated. */
export function hasStoredToken(key: string): boolean {
  return getStoredToken(key) !== null;
}

export { AUTH_TOKEN_STORAGE_KEYS };
