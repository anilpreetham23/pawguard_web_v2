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

import { API_ROUTES, apiDelete, apiGetPage, apiPatch, apiPost } from "@/lib/api";
import type {
  CompanionPetCreate,
  CompanionPetsQueryParams,
  CompanionPetResponse,
  CompanionPetUpdate,
  Page,
} from "@/lib/api";

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

  /**
   * `POST /companion-pets` — create a new companion pet owned by the caller.
   * Only `name` is required; species defaults to `dog` and `is_scan_enabled`
   * defaults to `true` on the backend.
   */
  createPet(data: CompanionPetCreate): Promise<CompanionPetResponse> {
    return apiPost<CompanionPetResponse>(API_ROUTES.companionPets.base, data);
  },

  /**
   * `POST /companion-pets/from-adoption/{application_id}` — create/link a pet
   * profile directly from an approved adoption application.
   */
  createPetFromAdoption(applicationId: string): Promise<CompanionPetResponse> {
    return apiPost<CompanionPetResponse>(
      API_ROUTES.companionPets.fromAdoption(applicationId),
      {}
    );
  },

  /**
   * `PATCH /companion-pets/{pet_id}` — update fields of an existing companion pet.
   */
  updatePet(
    petId: string,
    data: CompanionPetUpdate
  ): Promise<CompanionPetResponse> {
    return apiPatch<CompanionPetResponse>(
      API_ROUTES.companionPets.pet(petId),
      data
    );
  },

  /**
   * `DELETE /companion-pets/{pet_id}` — delete/remove a companion pet.
   */
  deletePet(petId: string): Promise<void> {
    return apiDelete(API_ROUTES.companionPets.pet(petId));
  },
};

export type {
  CompanionPetCreate,
  CompanionPetsQueryParams,
  CompanionPetResponse,
  CompanionPetUpdate,
  Page,
};
