/**
 * Logout helper — clears the local session and, by default, best-effort
 * notifies the backend so the refresh token is revoked.
 */

import { API_ROUTES } from "../constants";
import { clearAuthTokens } from "./session";
import { httpClient } from "../client";

export interface LogoutOptions {
  /**
   * Whether to call `POST /auth/logout` to revoke the session server-side.
   * Defaults to `true`. Set to `false` for a purely local sign-out.
   */
  notifyServer?: boolean;
}

/** Sign out locally (and optionally revoke the server session). */
export async function logout(options: LogoutOptions = {}): Promise<void> {
  const notifyServer = options.notifyServer !== false;

  // Always clear local state first so the UI signs out even if the API call fails.
  clearAuthTokens();

  if (notifyServer) {
    try {
      await httpClient.post(API_ROUTES.auth.logout, {});
    } catch {
      // Best effort — local session cleared, backend cookie revocation attempted.
    }
  }
}
