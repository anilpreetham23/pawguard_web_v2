/**
 * Centralized environment + API configuration.
 *
 * All runtime values are derived from environment variables with safe
 * fallbacks, so the app works in development without an .env file while
 * still honoring deployment overrides.
 *
 * NOTE: Adapted for the designer project — deliberately has no dependency on
 * `src/app/config/site.ts` (the designer site config has a different shape
 * and must not be overwritten).
 */

const DEFAULT_API_BASE_URL = "https://pawguard-backend-mqri.onrender.com/api/v1";
const DEFAULT_SITE_URL = "https://pawguard.example.com";

/** Trim trailing slashes so `baseURL + path` concatenation is predictable. */
const normalizeBaseUrl = (url: string): string => url.replace(/\/+$/, "");

/**
 * Guarantee the API base URL targets the backend's v1 router (`/api/v1`)
 * exactly once.
 */
const ensureApiVersionPrefix = (url: string): string => {
  if (url.includes("/api/v1")) return url;
  return `${url}/api/v1`;
};

export const env = {
  /** Base URL of the PawGuard backend, always ending in `/api/v1`. */
  apiBaseUrl: ensureApiVersionPrefix(
    normalizeBaseUrl(
      process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL
    )
  ),
  /** Canonical public site URL used for SEO/sitemap/robots. */
  siteUrl: normalizeBaseUrl(
    process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL
  ),
} as const;

export const apiConfig = {
  baseURL: env.apiBaseUrl,
  /** Default timeout for regular JSON requests (ms). */
  timeout: 15_000,
  /** Timeout for slow operations such as file uploads (ms). */
  uploadTimeout: 60_000,
} as const;

export type ApiConfig = typeof apiConfig;