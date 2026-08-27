/**
 * Rescue feature service.
 *
 * Feature-level API calls for the rescue module. Request/response shapes
 * are derived from the backend OpenAPI contract:
 *   https://pawguard-backend-mqri.onrender.com/redoc
 *
 * Rescue requests are auth- and permission-gated on the live backend
 * (`rescue:read` to view, any authenticated user may report), so the HTTP
 * client attaches the bearer token automatically. Callers must handle `401`
 * (sign-in required) and `403` (missing permission) gracefully.
 */

import { API_ROUTES, apiGet, apiGetPage, apiPost } from "@/lib/api";
import type {
  Page,
  PublicRescueStatusResponse,
  RescueMediaUploadRequest,
  RescueMediaUploadResponse,
  RescueQueryParams,
  RescueRequestCreate,
  RescueRequestResponse,
  SuccessStoryResponse,
} from "@/lib/api";

export const rescueService = {
  /** `GET /rescue` — paginated, searchable, filterable list of rescue requests. */
  listCases(params?: RescueQueryParams): Promise<Page<RescueRequestResponse>> {
    return apiGetPage<RescueRequestResponse>(API_ROUTES.rescue.base, params);
  },

  /** `GET /rescue/{id}` — a single rescue request. */
  getCase(id: string): Promise<RescueRequestResponse> {
    return apiGet<RescueRequestResponse>(API_ROUTES.rescue.case(id));
  },

  /** `GET /rescue` — latest requests, used as related cases for a detail page. */
  getRelatedCases(
    id: string,
    limit = 4
  ): Promise<RescueRequestResponse[]> {
    return apiGetPage<RescueRequestResponse>(API_ROUTES.rescue.base, {
      page_size: limit + 1,
      sort_by: "created_at",
      sort_order: "desc",
    }).then((page) =>
      page.items.filter((item) => item.id !== id).slice(0, limit)
    );
  },

  /** `POST /rescue/report` — report an animal in need of rescue. */
  reportCase(data: RescueRequestCreate): Promise<RescueRequestResponse> {
    return apiPost<RescueRequestResponse>(API_ROUTES.rescue.report, data);
  },

  /**
   * `POST /public/rescue/report` — anonymous public incident report used by
   * the public Emergency page. No session required.
   */
  reportPublicCase(data: RescueRequestCreate): Promise<RescueRequestResponse> {
    return apiPost<RescueRequestResponse>(
      API_ROUTES.rescue.publicReport,
      data,
      { auth: false }
    );
  },

  /** `POST /rescue/media-upload-url` — request presigned upload URL and object_key for rescue photos/video. */
  async getMediaUploadUrl(
    data: RescueMediaUploadRequest
  ): Promise<RescueMediaUploadResponse> {
    const res = await apiPost<any>(API_ROUTES.rescue.mediaUploadUrl, data, { auth: false });
    if (res && res.data && typeof res.data.upload_url === "string") {
      return res.data as RescueMediaUploadResponse;
    }
    return res as RescueMediaUploadResponse;
  },

  /** Upload actual image/video File bytes directly to presigned storage upload_url using HTTP PUT. */
  async uploadMediaFile(uploadUrl: string, file: File): Promise<void> {
    const res = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type || "application/octet-stream",
      },
      body: file,
    });
    if (!res.ok) {
      throw new Error(`Media upload failed with status ${res.status}`);
    }
  },

  /**
   * `GET /rescue/status` — public, rate-limited "where is my case" lookup by
   * ticket number + reporter phone (no auth).
   */
  getPublicStatus(
    ticketNumber: string,
    phone: string
  ): Promise<PublicRescueStatusResponse> {
    return apiGet<PublicRescueStatusResponse>(API_ROUTES.rescue.status, {
      params: { ticket_number: ticketNumber, phone },
    });
  },

  /** `GET /portal/success-stories` — published rescue success stories. */
  getSuccessStories(): Promise<SuccessStoryResponse[]> {
    return apiGet<SuccessStoryResponse[]>(API_ROUTES.community.successStories);
  },

  /** `GET /portal/success-stories/{id}` — a single published success story. */
  getSuccessStory(id: string): Promise<SuccessStoryResponse> {
    return apiGet<SuccessStoryResponse>(API_ROUTES.community.successStory(id));
  },
};

export type {
  Page,
  RescueQueryParams,
  RescueRequestCreate,
  RescueRequestResponse,
  SuccessStoryResponse,
};
