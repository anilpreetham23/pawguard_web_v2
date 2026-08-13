/**
 * Foster feature service.
 *
 * Feature-level API calls for the foster module. Request/response shapes are
 * derived from the backend OpenAPI contract:
 *   https://pawguard-backend-mqri.onrender.com/redoc
 *
 * Only the user-facing foster surface is exposed here — applying to foster
 * and viewing the progress logs / supply dispatches on your own placements.
 * All profile- and placement-management routes (create/update/delete, placing
 * and returning dogs, logging progress/supplies) are staff/admin-only and are
 * deliberately not integrated by the Public Web.
 */

import { API_ROUTES, apiGet, apiPost } from "@/lib/api";
import type {
  FosterProfileCreate,
  FosterProfileResponse,
  FosterProgressLogResponse,
  FosterSupplyDispatchResponse,
} from "@/lib/api";

export const fosterService = {
  /** `POST /fosters/apply` — submit an auth-gated foster application. */
  apply(data: FosterProfileCreate): Promise<FosterProfileResponse> {
    return apiPost<FosterProfileResponse>(API_ROUTES.foster.apply, data);
  },

  /**
   * `GET /fosters/placements/{id}/progress` — care-progress logs on one of the
   * caller's foster placements (foster owner or staff).
   */
  getPlacementProgress(
    placementId: string
  ): Promise<FosterProgressLogResponse[]> {
    return apiGet<FosterProgressLogResponse[]>(
      API_ROUTES.foster.placementProgress(placementId)
    );
  },

  /**
   * `GET /fosters/placements/{id}/supplies` — supply dispatches on one of the
   * caller's foster placements (foster owner or staff).
   */
  getPlacementSupplies(
    placementId: string
  ): Promise<FosterSupplyDispatchResponse[]> {
    return apiGet<FosterSupplyDispatchResponse[]>(
      API_ROUTES.foster.placementSupplies(placementId)
    );
  },
};

export type {
  FosterProfileCreate,
  FosterProfileResponse,
  FosterProgressLogResponse,
  FosterSupplyDispatchResponse,
};
