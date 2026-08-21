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

const RENDER_BACKEND_URL = "https://pawguard-backend-mqri.onrender.com/api/v1";
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

/**
 * Resolves the API base URL based on runtime execution context:
 * - Browser (client-side): ALWAYS returns relative `/api/v1` to ensure same-origin
 *   requests hit the Next.js rewrite proxy, preserving HttpOnly cookie flow and
 *   preventing cross-site 3rd-party cookie drops.
 * - Server (SSR/SSG): Resolves to process.env.NEXT_PUBLIC_API_BASE_URL or RENDER_BACKEND_URL.
 */
function resolveApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return "/api/v1";
  }
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL ?? RENDER_BACKEND_URL;
  return ensureApiVersionPrefix(normalizeBaseUrl(raw));
}

export const env = {
  /** Base URL of the PawGuard backend. */
  apiBaseUrl: resolveApiBaseUrl(),
  /** Canonical public site URL used for SEO/sitemap/robots. */
  siteUrl: normalizeBaseUrl(
    process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL
  ),
} as const;

export const apiConfig = {
  get baseURL(): string {
    return resolveApiBaseUrl();
  },
  /** Default timeout for regular JSON requests (ms). */
  timeout: 15_000,
  /** Timeout for slow operations such as file uploads (ms). */
  uploadTimeout: 60_000,
} as const;

export type ApiConfig = typeof apiConfig;