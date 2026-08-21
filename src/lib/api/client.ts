/**
 * The single HTTP client for the entire app.
 *
 * Built on axios with:
 * - a shared `baseURL` from environment config
 * - JSON headers + per-request overrides
 * - a request interceptor that attaches the JWT bearer token
 * - a response interceptor that transparently refreshes the access token on
 *   401 (single-flight) and retries the original request
 * - typed request helpers that unwrap the `ApiResponse`/`PaginatedResponse`
 *   envelopes and normalize every failure to an `ApiError`
 *
 * Feature modules import `apiGet`/`apiPost`/`apiGetPage` (never raw axios).
 */

import axios, {
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { getAccessToken } from "./auth/session";
import { refreshAccessToken } from "./auth/refresh";
import { apiConfig } from "./config";
import { ApiError, normalizeError } from "./errors";
import type {
  ApiResponse,
  Page,
  PaginatedResponse,
  PaginationMeta,
  QueryParams,
} from "./types";

/** Per-request options layered on top of axios config. */
export interface ApiRequestConfig
  extends Omit<AxiosRequestConfig, "data" | "params" | "auth"> {
  /** Request body for POST/PUT/PATCH/DELETE. */
  data?: unknown;
  /** Query parameters serialized by axios. */
  params?: QueryParams;
  /** Set `false` to skip attaching the bearer token (default: true). */
  auth?: boolean;
}

type RetryableConfig = InternalAxiosRequestConfig & {
  auth?: boolean;
  _retry?: boolean;
};

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)")
  );
  return match ? decodeURIComponent(match[1]) : null;
}

const httpClient = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Client-Type": "web",
  },
});

/**
 * Convert our `ApiRequestConfig` to an axios config.
 *
 * The custom `auth` boolean must be preserved on the object so the response
 * interceptor can read `original.auth !== false` when deciding whether to
 * attempt a token refresh on 401. Axios ignores unknown properties on the
 * config object, so keeping it there is safe.
 */
function toAxiosConfig(config: ApiRequestConfig): AxiosRequestConfig {
  return config as unknown as AxiosRequestConfig;
}

/* -------------------------------------------------------------------------- */
/* Request interceptor — credentials, client-type, CSRF token                 */
/* -------------------------------------------------------------------------- */

httpClient.interceptors.request.use((config) => {
  config.withCredentials = true;
  config.headers.set("X-Client-Type", "web");

  const method = config.method?.toUpperCase();
  if (method && ["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const csrfToken = getCookie("pg_csrf_token");
    if (csrfToken) {
      config.headers.set("X-CSRF-Token", csrfToken);
    }
  }

  const retryable = config as RetryableConfig;
  if (retryable.auth !== false) {
    const token = getAccessToken();
    if (token && token.trim() !== "") {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
  }
  return config;
});

/* -------------------------------------------------------------------------- */
/* Response interceptor — envelope errors, refresh on 401                     */
/* -------------------------------------------------------------------------- */

let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

function flushQueue(token: string | null): void {
  pendingQueue.forEach((resolve) => resolve(token));
  pendingQueue = [];
}

httpClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    const axiosError = error as {
      config?: RetryableConfig;
      response?: { status?: number };
      message?: string;
    };
    const original = axiosError.config;
    const status = axiosError.response?.status;
    const isRefreshRequest =
      typeof original?.url === "string" &&
      original.url.includes("/auth/refresh");

    if (
      status === 401 &&
      original &&
      !original._retry &&
      original.auth !== false &&
      !isRefreshRequest
    ) {
      original._retry = true;

      if (isRefreshing) {
        // Another request is already refreshing — wait for it.
        return new Promise((resolve, reject) => {
          pendingQueue.push((token) => {
            if (token === null) {
              reject(normalizeError(error));
              return;
            }
            if (token && token !== "cookie-refreshed") {
              original.headers.set("Authorization", `Bearer ${token}`);
            }
            resolve(httpClient(original));
          });
        });
      }

      isRefreshing = true;
      try {
        const token = await refreshAccessToken();
        flushQueue(token);
        if (!token) {
          throw error;
        }
        if (token && token !== "cookie-refreshed") {
          original.headers.set("Authorization", `Bearer ${token}`);
        }
        return await httpClient(original);
      } catch (refreshError) {
        flushQueue(null);
        return Promise.reject(normalizeError(refreshError ?? error));
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(normalizeError(error));
  }
);

/* -------------------------------------------------------------------------- */
/* Envelope unwrapping                                                        */
/* -------------------------------------------------------------------------- */

function unwrapEnvelope<T>(body: unknown): T {
  if (body !== null && typeof body === "object" && "success" in body) {
    const envelope = body as ApiResponse<T> & { error?: { code?: string; message?: string } };
    if (envelope.success === false) {
      // Backend error shape: { success: false, error: { code, message, details } }
      const backendMessage =
        envelope.error?.message ||
        (typeof envelope.message === "string" ? envelope.message : null) ||
        "The request could not be completed.";
      throw new ApiError({
        kind: "http",
        status: 200,
        code: envelope.error?.code ?? "API_ERROR",
        message: backendMessage,
        detail: backendMessage,
      });
    }
    if ("data" in body) {
      return envelope.data as T;
    }
  }
  return body as T;
}

/* -------------------------------------------------------------------------- */
/* Request helpers                                                            */
/* -------------------------------------------------------------------------- */

/** Core request used by all helpers. Unwraps the response envelope. */
export async function apiRequest<T>(
  config: ApiRequestConfig
): Promise<T> {
  const response = await httpClient.request<T>(toAxiosConfig(config));
  return unwrapEnvelope<T>(response.data);
}

/** GET request that returns the unwrapped `ApiResponse.data`. */
export function apiGet<T>(url: string, config?: ApiRequestConfig): Promise<T> {
  return apiRequest<T>({ method: "GET", url, ...config });
}

/** POST request with an optional JSON body. */
export function apiPost<T>(
  url: string,
  body?: unknown,
  config?: ApiRequestConfig
): Promise<T> {
  return apiRequest<T>({ method: "POST", url, data: body, ...config });
}

/** PUT request with an optional JSON body. */
export function apiPut<T>(
  url: string,
  body?: unknown,
  config?: ApiRequestConfig
): Promise<T> {
  return apiRequest<T>({ method: "PUT", url, data: body, ...config });
}

/** PATCH request with an optional JSON body. */
export function apiPatch<T>(
  url: string,
  body?: unknown,
  config?: ApiRequestConfig
): Promise<T> {
  return apiRequest<T>({ method: "PATCH", url, data: body, ...config });
}

/** DELETE request. */
export function apiDelete<T>(url: string, config?: ApiRequestConfig): Promise<T> {
  return apiRequest<T>({ method: "DELETE", url, ...config });
}

/**
 * GET a paginated collection. Combines the paginated envelope's `data` list
 * with its sibling `meta` into a single `Page<T>`.
 */
export async function apiGetPage<T>(
  url: string,
  params?: QueryParams,
  config?: ApiRequestConfig
): Promise<Page<T>> {
  const response = await httpClient.request<PaginatedResponse<T>>(
    toAxiosConfig({ method: "GET", url, params, ...config })
  );
  const body = response.data;
  const meta: PaginationMeta = body?.meta ?? {
    total: 0,
    page: 1,
    page_size: 0,
    total_pages: 0,
  };
  const data = body?.data;
  const items = Array.isArray(data) ? data : (data as { items?: T[] } | undefined)?.items ?? [];
  return { items, meta };
}

export { httpClient };
