/**
 * Foster feature service.
 *
 * Feature-level API calls for the foster module. Request/response shapes are
 * derived from the backend OpenAPI contract.
 */

import { API_ROUTES, apiGet, apiPost } from "@/lib/api";
import type {
  AdoptionApplicationResponse,
  FosterPlacementResponse,
  FosterProfileCreate,
  FosterProfileResponse,
  FosterProgressLogCreate,
  FosterProgressLogResponse,
  FosterSupplyDispatchResponse,
  SupplyRequestCreate,
} from "@/lib/api";

export const fosterService = {
  /** `POST /fosters/apply` — submit an auth-gated foster application. */
  apply(data: FosterProfileCreate): Promise<FosterProfileResponse> {
    return apiPost<FosterProfileResponse>(API_ROUTES.foster.apply, data);
  },

  /** `GET /fosters/me` — authenticated user's foster profile. */
  getMyProfile(): Promise<FosterProfileResponse> {
    return apiGet<FosterProfileResponse>(API_ROUTES.foster.me);
  },

  /** `GET /fosters/me/placements` — authenticated user's foster placements. */
  getMyPlacements(): Promise<FosterPlacementResponse[]> {
    return apiGet<FosterPlacementResponse[]>(API_ROUTES.foster.myPlacements);
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

  /** `POST /fosters/placements/{id}/progress` — submit a daily progress log. */
  createPlacementProgress(
    placementId: string,
    data: FosterProgressLogCreate
  ): Promise<FosterProgressLogResponse> {
    return apiPost<FosterProgressLogResponse>(
      API_ROUTES.foster.placementProgress(placementId),
      data
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

  /** `POST /fosters/placements/{id}/supplies/request` — request supply dispatches. */
  requestSupplies(
    placementId: string,
    data: SupplyRequestCreate
  ): Promise<FosterSupplyDispatchResponse> {
    return apiPost<FosterSupplyDispatchResponse>(
      API_ROUTES.foster.requestSupplies(placementId),
      data
    );
  },

  /** `POST /fosters/placements/{id}/convert-to-adopt` — convert active placement to adoption application. */
  convertToAdopt(
    placementId: string
  ): Promise<AdoptionApplicationResponse> {
    return apiPost<AdoptionApplicationResponse>(
      API_ROUTES.foster.convertToAdopt(placementId),
      {}
    );
  },
};

export type {
  FosterPlacementResponse,
  FosterProfileCreate,
  FosterProfileResponse,
  FosterProgressLogCreate,
  FosterProgressLogResponse,
  FosterSupplyDispatchResponse,
  SupplyRequestCreate,
};
