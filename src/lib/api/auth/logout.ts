/**
 * Logout helper — clears the local session and, by default, best-effort
 * notifies the backend so the refresh token is revoked.
 */

import axios from "axios";
import { apiConfig } from "../config";
import { API_ROUTES } from "../constants";
import { clearAuthTokens, getAccessToken } from "./session";

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
  const token = getAccessToken();

  // Always clear local state first so the UI signs out even if the API call fails.
  clearAuthTokens();

  if (notifyServer && token) {
    try {
      await axios.post(
        API_ROUTES.auth.logout,
        {},
        {
          baseURL: apiConfig.baseURL,
          timeout: apiConfig.timeout,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch {
      // Best effort — the local session is already cleared.
    }
  }
}
