/**
 * Lost & Found feature service.
 *
 * Feature-level API calls for the lost-found module. Request/response shapes
 * are derived from the backend OpenAPI contract:
 *   https://pawguard-backend-mqri.onrender.com/redoc
 *
 * Public browsing is available without authentication (`GET /lost-found/lost`,
 * `GET /lost-found/found`, and the per-report detail endpoints). Report
 * creation (`POST`) and matching/claim flows are gated on the live backend,
 * so those callers must handle `401`/`403` gracefully.
 *
 * NOTE: single-resource detail endpoints are now live (`/lost-found/lost/{id}`
 * and `/lost-found/found/{id}`), so `getReportById` resolves a report through
 * the direct detail route for the matching kind instead of scanning the lists.
 */

import { API_ROUTES, apiGet, apiGetPage, apiPost, isApiError } from "@/lib/api";
import type {
  FoundReportCreate,
  FoundReportResponse,
  LostFoundQueryParams,
  LostReportCreate,
  LostReportResponse,
  OwnershipClaimSubmit,
  Page,
  ReportMatchResponse,
} from "@/lib/api";
import type { LostFoundCase, LostFoundKind } from "@/types";
import { foundReportToCase, lostReportToCase } from "./mapper";

/** One list page of display-ready cases for the given kind. */
async function listCases(
  kind: LostFoundKind,
  params?: LostFoundQueryParams
): Promise<Page<LostFoundCase>> {
  if (kind === "lost") {
    const page = await apiGetPage<LostReportResponse>(
      API_ROUTES.lostFound.lost,
      params
    );
    return { ...page, items: page.items.map(lostReportToCase) };
  }
  const page = await apiGetPage<FoundReportResponse>(
    API_ROUTES.lostFound.found,
    params
  );
  return { ...page, items: page.items.map(foundReportToCase) };
}

export const lostFoundService = {
  /** `GET /lost-found/lost` — paginated, searchable list of lost-pet reports. */
  listLost(params?: LostFoundQueryParams): Promise<Page<LostReportResponse>> {
    return apiGetPage<LostReportResponse>(API_ROUTES.lostFound.lost, params);
  },

  /** `GET /lost-found/found` — paginated, searchable list of found reports. */
  listFound(params?: LostFoundQueryParams): Promise<Page<FoundReportResponse>> {
    return apiGetPage<FoundReportResponse>(API_ROUTES.lostFound.found, params);
  },

  /**
   * `GET /lost-found/lost|found` — display-ready page for the given kind.
   * Maps every report through the DTO→display adapter.
   */
  getReports(
    kind: LostFoundKind,
    params?: LostFoundQueryParams
  ): Promise<Page<LostFoundCase>> {
    return listCases(kind, params);
  },

  /**
   * `GET /lost-found/lost/{id}` / `GET /lost-found/found/{id}` — resolve a
   * single report through the direct detail endpoint of the matching kind.
   * The id alone does not encode its kind, so the lost detail is tried first
   * and the found detail on a 404; a 404 from both resolves to `null`. Any
   * other error (network, 5xx) propagates.
   */
  async getReportById(id: string): Promise<LostFoundCase | null> {
    try {
      const lost = await apiGet<LostReportResponse>(
        API_ROUTES.lostFound.lostById(id)
      );
      return lostReportToCase(lost);
    } catch (error) {
      if (!(isApiError(error) && error.isNotFound)) throw error;
    }

    try {
      const found = await apiGet<FoundReportResponse>(
        API_ROUTES.lostFound.foundById(id)
      );
      return foundReportToCase(found);
    } catch (error) {
      if (isApiError(error) && error.isNotFound) return null;
      throw error;
    }
  },

  /** Latest reports of the same kind, used as related cases for a detail page. */
  async getRelatedCases(
    id: string,
    kind: LostFoundKind,
    limit = 4
  ): Promise<LostFoundCase[]> {
    const page = await listCases(kind, {
      page_size: limit + 1,
      sort_by: "created_at",
      sort_order: "desc",
    });
    return page.items.filter((item) => item.id !== id).slice(0, limit);
  },

  /** `POST /lost-found/lost` — report a lost pet. */
  reportLostPet(data: LostReportCreate): Promise<LostReportResponse> {
    return apiPost<LostReportResponse>(API_ROUTES.lostFound.lost, data);
  },

  /** `POST /lost-found/found` — report a found roaming animal. */
  reportFoundPet(data: FoundReportCreate): Promise<FoundReportResponse> {
    return apiPost<FoundReportResponse>(API_ROUTES.lostFound.found, data);
  },

  /**
   * `POST /lost-found/lost/{report_id}/broadcast` — broadcast a lost-pet
   * alert to nearby PawGuard members. Auth-gated on the live backend; any
   * caller without a real session receives a normalized `ApiError` (401).
   */
  broadcastLostPetAlert(reportId: string): Promise<Record<string, unknown>> {
    return apiPost<Record<string, unknown>>(
      API_ROUTES.lostFound.broadcast(reportId)
    );
  },

  /**
   * `GET /lost-found/lost/{report_id}/matches` — potential matches for a lost
   * report (the owner, or any user with `public:read`).
   */
  getMatches(
    reportId: string,
    params?: LostFoundQueryParams
  ): Promise<Page<ReportMatchResponse>> {
    return apiGetPage<ReportMatchResponse>(
      API_ROUTES.lostFound.matches(reportId),
      params
    );
  },

  /**
   * `GET /lost-found/found/{report_id}/matches` — potential matches for a
   * found report (the reporter, or any user with `public:read`).
   */
  getFoundMatches(
    reportId: string,
    params?: LostFoundQueryParams
  ): Promise<Page<ReportMatchResponse>> {
    return apiGetPage<ReportMatchResponse>(
      API_ROUTES.lostFound.foundMatches(reportId),
      params
    );
  },

  /**
   * `POST /lost-found/matches/{match_id}/claim` — submit ownership-proof
   * documents against a match (only the reporters of either side may claim).
   */
  claimMatch(
    matchId: string,
    data: OwnershipClaimSubmit
  ): Promise<ReportMatchResponse> {
    return apiPost<ReportMatchResponse>(
      API_ROUTES.lostFound.claimMatch(matchId),
      data
    );
  },
};

export type {
  FoundReportCreate,
  FoundReportResponse,
  LostFoundCase,
  LostFoundQueryParams,
  LostFoundKind,
  LostReportCreate,
  LostReportResponse,
  OwnershipClaimSubmit,
  Page,
  ReportMatchResponse,
};
