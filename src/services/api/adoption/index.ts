/**
 * Adoption feature service.
 *
 * Feature-level API calls for the adoption module. Request/response shapes
 * are derived from the backend OpenAPI contract:
 *   https://pawguard-backend-mqri.onrender.com/redoc
 *
 * All dog/adoption endpoints are auth- and permission-gated on the live
 * backend (`public:read` for dog profiles, `adoption:read` for applications),
 * so the HTTP client attaches the bearer token automatically. Callers must
 * handle `401` (sign-in required) and `403` (missing permission) gracefully.
 */

import { API_ROUTES, apiGet, apiGetPage, apiPost } from "@/lib/api";
import type {
  AdoptionApplicationCreate,
  AdoptionApplicationResponse,
  DogProfileResponse,
  DogQueryParams,
  Page,
} from "@/lib/api";
export const adoptionService = {
  /** `GET /dogs` — paginated, searchable, filterable list of dog profiles. */
  listDogs(params?: DogQueryParams): Promise<Page<DogProfileResponse>> {
    return apiGetPage<DogProfileResponse>(API_ROUTES.adoption.dogs, params);
  },

  /** `GET /dogs/{id}` — a single dog profile. */
  getDog(id: string): Promise<DogProfileResponse> {
    return apiGet<DogProfileResponse>(API_ROUTES.adoption.dog(id));
  },

  /** `GET /dogs` filtered to a breed — related pets for a detail page. */
  getRelatedDogs(
    breed: string,
    id: string,
    limit = 4
  ): Promise<DogProfileResponse[]> {
    return apiGetPage<DogProfileResponse>(API_ROUTES.adoption.dogs, {
      breed,
      page_size: limit + 1,
      sort_by: "created_at",
      sort_order: "desc",
    }).then((page) => page.items.filter((dog) => dog.id !== id).slice(0, limit));
  },

  /** `POST /adoptions` — submit an adoption application. */
  submitApplication(
    data: AdoptionApplicationCreate
  ): Promise<AdoptionApplicationResponse> {
    return apiPost<AdoptionApplicationResponse>(
      API_ROUTES.adoption.applications,
      data
    );
  },

  /** `GET /adoptions/my` — the signed-in user's adoption applications. */
  listMyApplications(
    params?: { search?: string; status?: string; page?: number; page_size?: number }
  ): Promise<Page<AdoptionApplicationResponse>> {
    return apiGetPage<AdoptionApplicationResponse>(
      API_ROUTES.adoption.myApplications,
      params
    );
  },

  /** `GET /adoptions/{id}` — a single adoption application. */
  getApplication(id: string): Promise<AdoptionApplicationResponse> {
    return apiGet<AdoptionApplicationResponse>(
      API_ROUTES.adoption.application(id)
    );
  },
};

export type {
  AdoptionApplicationCreate,
  AdoptionApplicationResponse,
  DogProfileResponse,
  DogQueryParams,
};
