/**
 * Settings feature service.
 *
 * Feature-level API calls for the settings module. Request/response shapes
 * are derived from the backend OpenAPI contract:
 *   https://pawguard-backend-mqri.onrender.com/redoc
 *
 * The Public Web only consumes the public-facing content (`about_us` /
 * `mission`), which the backend gates behind the `public:read` permission
 * (assigned to every seeded role). All other settings routes are
 * `system:admin`-only and are deliberately not integrated.
 */

import { API_ROUTES, apiGet } from "@/lib/api";
import type { PublicContentResponse } from "@/lib/api";

export const settingsService = {
  /** `GET /settings/public-content` — the site's public about-us/mission copy. */
  getPublicContent(): Promise<PublicContentResponse> {
    return apiGet<PublicContentResponse>(API_ROUTES.settings.publicContent);
  },
};

export type { PublicContentResponse };
