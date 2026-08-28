/**
 * URL and query-string helpers.
 *
 * Axios serializes `params` automatically inside the request helpers, but
 * these utilities are available for manual URL construction, testability,
 * and cases where a raw URL is needed (e.g. building share links).
 */

import { apiConfig } from "./config";
import type { AuthUser, QueryParams } from "./types";

/** Build a query string from a params object. Arrays become repeated keys. */
export function buildQueryString(params: QueryParams = {}): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      for (const item of value) search.append(key, String(item));
    } else {
      search.set(key, String(value));
    }
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

/** Join a route path with an optional query string. */
export function buildUrl(path: string, params?: QueryParams): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${normalized}${buildQueryString(params)}`;
}

/** Resolve a route path to an absolute URL including the API base URL. */
export function getApiUrl(path: string, params?: QueryParams): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${apiConfig.baseURL}${normalized}${buildQueryString(params)}`;
}

/** Resolve an avatar image path/URL to a browser-loadable image src. */
export function resolveAvatarUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== "string" || !url.trim()) return null;
  const trimmed = url.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }
  if (trimmed.startsWith("/")) {
    return trimmed;
  }
  return `${apiConfig.baseURL}/storage/${trimmed}`;
}

/** Get the resolved avatar image URL from an AuthUser profile object using the standard fallback hierarchy. */
export function getAvatarUrl(user: AuthUser | null | undefined): string | null {
  if (!user) return null;
  const raw = user.profile_picture_url || user.avatar_url;
  return resolveAvatarUrl(raw);
}
