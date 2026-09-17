import { describe, it, expect, beforeEach } from "vitest";
import {
  getStoredToken,
  setStoredToken,
  removeStoredToken,
  hasStoredToken,
  AUTH_TOKEN_STORAGE_KEYS,
} from "@/lib/api/auth/token-storage";

describe("In-Memory Auth Token Storage", () => {
  beforeEach(() => {
    removeStoredToken(AUTH_TOKEN_STORAGE_KEYS.accessToken);
    removeStoredToken(AUTH_TOKEN_STORAGE_KEYS.refreshToken);
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
  });

  it("stores and retrieves tokens in memory without writing to localStorage", () => {
    const testToken = "test.jwt.token";
    setStoredToken(AUTH_TOKEN_STORAGE_KEYS.accessToken, testToken);

    expect(getStoredToken(AUTH_TOKEN_STORAGE_KEYS.accessToken)).toBe(testToken);
    expect(hasStoredToken(AUTH_TOKEN_STORAGE_KEYS.accessToken)).toBe(true);

    // Verify localStorage has NOT been populated with raw JWTs
    if (typeof localStorage !== "undefined") {
      expect(localStorage.getItem(AUTH_TOKEN_STORAGE_KEYS.accessToken)).toBeNull();
    }
  });

  it("removes stored tokens cleanly", () => {
    setStoredToken(AUTH_TOKEN_STORAGE_KEYS.accessToken, "sample_token");
    removeStoredToken(AUTH_TOKEN_STORAGE_KEYS.accessToken);

    expect(getStoredToken(AUTH_TOKEN_STORAGE_KEYS.accessToken)).toBeNull();
    expect(hasStoredToken(AUTH_TOKEN_STORAGE_KEYS.accessToken)).toBe(false);
  });
});
