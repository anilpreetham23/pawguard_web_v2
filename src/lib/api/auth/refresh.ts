/**
 * Token refresh with single-flight deduplication.
 *
 * When several requests fail with 401 at the same time, only one refresh
 * request is sent and every waiting request resolves once it completes.
 * Uses its own bare axios instance (no interceptors) to avoid recursion.
 */

import axios from "axios";
import { apiConfig } from "../config";
import { API_ROUTES } from "../constants";
import type { ApiResponse, RefreshResponse } from "../types";
import {
  clearAuthTokens,
  getRefreshToken,
  setAuthTokens,
} from "./session";

let inFlightRefresh: Promise<string | null> | null = null;

async function performRefresh(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await axios.post<ApiResponse<RefreshResponse>>(
      API_ROUTES.auth.refresh,
      { refresh_token: refreshToken },
      {
        baseURL: apiConfig.baseURL,
        timeout: apiConfig.timeout,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const nextAccessToken = response.data?.data?.access_token;
    if (!nextAccessToken) return null;

    // The backend rotates the refresh token too; fall back to the old one.
    setAuthTokens({
      accessToken: nextAccessToken,
      refreshToken: response.data?.data?.refresh_token ?? refreshToken,
    });
    return nextAccessToken;
  } catch {
    // Refresh failed — the session is no longer valid.
    clearAuthTokens();
    return null;
  }
}

/**
 * Refresh the access token. Concurrent callers share the same in-flight
 * request. Resolves to the new access token, or `null` when refresh failed.
 */
export function refreshAccessToken(): Promise<string | null> {
  if (inFlightRefresh) return inFlightRefresh;

  inFlightRefresh = performRefresh();
  inFlightRefresh.finally(() => {
    inFlightRefresh = null;
  });
  return inFlightRefresh;
}
