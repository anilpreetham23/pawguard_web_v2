/**
 * Safety-tag / QR feature service.
 *
 * Public scanning of companion-pet safety tags and privacy-safe dog public
 * profiles. Request/response shapes are derived from the backend OpenAPI
 * contract:
 *   https://pawguard-backend-mqri.onrender.com/redoc
 *
 * All endpoints here are PUBLIC (no auth token required). The HTTP client
 * attaches the bearer token automatically when a session exists, which is
 * harmless for public routes.
 */

import { API_ROUTES, apiGet, apiPost } from "@/lib/api";
import type {
  PublicDogScanResponse,
  SafetyTagScanRequest,
  SafetyTagScanResponse,
} from "@/lib/api";

export const safetyTagService = {
  /**
   * `POST /companion-pets/safety-tag/scan` — resolve a safety-tag token to
   * public pet info. Throws a normalized `ApiError` (e.g. 404 `NOT_FOUND`
   * "Safety tag not found." for invalid/expired tokens, 422 for short tokens).
   */
  scanToken(token: string): Promise<SafetyTagScanResponse> {
    const body: SafetyTagScanRequest = { token };
    return apiPost<SafetyTagScanResponse>(API_ROUTES.safetyTag.scan, body);
  },

  /**
   * `GET /dogs/{dog_id}/public-scan` — fetch the privacy-safe public profile
   * of a rescue dog (used when a scan resolves to a dog in care).
   */
  getDogPublicScan(dogId: string): Promise<PublicDogScanResponse> {
    return apiGet<PublicDogScanResponse>(
      API_ROUTES.adoption.dogPublicScan(dogId)
    );
  },
};

export type {
  PublicDogScanResponse,
  SafetyTagScanResponse,
} from "@/lib/api";