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

import { API_ROUTES, apiDelete, apiGet, apiGetPage, apiPatch, apiPost } from "@/lib/api";
import type {
  CompanionPetCreate,
  CompanionPetPhotoUploadRequest,
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
   * `GET /companion-pets/{pet_id}` — fetch single companion pet by ID.
   */
  getPet(petId: string): Promise<CompanionPetResponse> {
    return apiGet<CompanionPetResponse>(API_ROUTES.companionPets.pet(petId));
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

  /**
   * Upload a pet photo to presigned S3 storage and confirm backend record:
   * 1. POST /companion-pets/{pet_id}/photo-upload-url -> get file_id & upload_url
   * 2. PUT upload_url -> upload File bytes to S3
   * 3. POST /companion-pets/{pet_id}/photo/confirm?file_id={file_id} -> confirm file
   */
  async uploadPetPhoto(petId: string, file: File): Promise<CompanionPetResponse> {
    const uploadReq: CompanionPetPhotoUploadRequest = {
      original_filename: file.name,
      mime_type: file.type || "image/jpeg",
      file_size: file.size,
      folder: "companion_pets",
    };

    // 1. Get presigned upload URL
    const res = await apiPost<any>(
      API_ROUTES.companionPets.photoUploadUrl(petId),
      uploadReq
    );
    const data = res?.data || res;
    const uploadUrl = data?.upload_url;
    const fileId = data?.file_id;

    if (!uploadUrl || !fileId) {
      throw new Error("Failed to obtain photo upload URL from backend.");
    }

    // 2. Upload image file directly to presigned S3 URL
    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type || "image/jpeg",
      },
      body: file,
    });

    if (!uploadRes.ok) {
      throw new Error(`Photo S3 upload failed with status ${uploadRes.status}`);
    }

    // 3. Confirm uploaded file with backend
    const confirmUrl = `${API_ROUTES.companionPets.confirmPhoto(petId)}?file_id=${encodeURIComponent(fileId)}`;
    await apiPost(confirmUrl, { file_id: fileId });

    // 4. Fetch updated pet profile with authoritative photo_url
    return this.getPet(petId);
  },
};

export type {
  CompanionPetCreate,
  CompanionPetsQueryParams,
  CompanionPetResponse,
  CompanionPetUpdate,
  Page,
};
