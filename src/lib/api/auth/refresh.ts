/**
 * Token refresh with single-flight deduplication using HttpOnly cookies.
 *
 * When several requests fail with 401 at the same time, only one refresh
 * request is sent and every waiting request resolves once it completes.
 * Uses its own bare axios instance (no interceptors) with withCredentials: true
 * so the browser automatically transmits the pg_refresh_token HttpOnly cookie.
 */

import axios from "axios";
import { apiConfig } from "../config";
import { API_ROUTES } from "../constants";
import { clearAuthTokens } from "./session";

let inFlightRefresh: Promise<string | null> | null = null;

async function performRefresh(): Promise<string | null> {
  try {
    await axios.post(
      API_ROUTES.auth.refresh,
      {},
      {
        baseURL: apiConfig.baseURL,
        timeout: apiConfig.timeout,
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    return "ok";
  } catch {
    // Refresh failed — clear any session state.
    clearAuthTokens();
    return null;
  }
}

/**
 * Refresh the session via HttpOnly cookies. Concurrent callers share the same
 * in-flight request. Resolves to `"ok"` on success, or `null` when refresh failed.
 */
export function refreshAccessToken(): Promise<string | null> {
  if (inFlightRefresh) return inFlightRefresh;

  inFlightRefresh = performRefresh();
  inFlightRefresh.finally(() => {
    inFlightRefresh = null;
  });
  return inFlightRefresh;
}
