/**
 * Companion pets feature service.
 *
 * Feature-level API calls for the authenticated owner's companion-pet
 * profiles. Request/response shapes are derived from the backend OpenAPI
 * contract: https://pawguard-backend-mqri.onrender.com/redoc
 *
 *   - `GET /companion-pets` — paginated list of the caller's pets (auth)
 *
 * Pet creation/provisioning is intentionally out of scope for the booking
 * checkpoint — only the list method required by appointment booking is added.
 */

import { API_ROUTES, apiGetPage } from "@/lib/api";
import type { CompanionPetsQueryParams, CompanionPetResponse, Page } from "@/lib/api";

export const companionPetsService = {
  /**
   * `GET /companion-pets` — the authenticated user's companion pets
   * (paginated).
   */
  listPets(
    params?: CompanionPetsQueryParams
  ): Promise<Page<CompanionPetResponse>> {
    return apiGetPage<CompanionPetResponse>(
      API_ROUTES.companionPets.base,
      params
    );
  },
};

export type {
  CompanionPetsQueryParams,
  CompanionPetResponse,
  Page,
};
