/**
 * Community feature service.
 *
 * Feature-level API calls for the community module. Request/response shapes
 * are derived from the backend OpenAPI contract:
 *   https://pawguard-backend-mqri.onrender.com/redoc
 *
 * Blog listing/detail and hero stats are public. Volunteer applications
 * (`POST /volunteers/apply`) are auth-gated — the HTTP client attaches the
 * bearer token automatically, so callers must handle `401` (sign-in required)
 * and `409` (already applied) gracefully.
 *
 * Community events, volunteer opportunities, and partner NGOs have NO backend
 * endpoints, so they remain static editorial content sourced from
 * `@/data/community` (documented in the community implementation report).
 */

import { API_ROUTES, QUERY_KEYS, apiGet, apiGetPage, apiPost } from "@/lib/api";
import { queryClient } from "@/lib/react-query";
import type {
  BlogPostResponse,
  DownloadUrlResponse,
  LegalDocumentResponse,
  Page,
  PublicHeroStats,
  QueryParams,
  ShiftAttendanceResponse,
  TransparencyStats,
  UrgentAlertResponse,
  UserDashboardSummary,
  VolunteerProfileCreate,
  VolunteerProfileResponse,
  VolunteerServiceSummary,
  VolunteerShiftResponse,
  VolunteerMeStatusResponse,
} from "@/lib/api";
import type { BlogPost } from "@/types";
import { blogPostResponseToBlogPost } from "./mapper";

/** Query params accepted by `GET /volunteers/shifts`. */
export interface VolunteerShiftQueryParams extends QueryParams {
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  role_name?: string;
}

export const communityService = {
  /** `GET /portal/blog` — published blog posts. */
  getBlogPosts(): Promise<BlogPost[]> {
    return apiGet<BlogPostResponse[]>(API_ROUTES.community.blog).then((list) =>
      (list ?? []).map((post, index) => blogPostResponseToBlogPost(post, index))
    );
  },

  /** `GET /portal/blog/slug/{slug}` — a single published blog post. */
  getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    return apiGet<BlogPostResponse>(API_ROUTES.community.blogPost(slug)).then(
      (post) => (post ? blogPostResponseToBlogPost(post) : null)
    );
  },

  /** Related posts derived from the published list (same category first). */
  getRelatedBlogPosts(post: BlogPost, limit = 3): Promise<BlogPost[]> {
    const cached = queryClient.getQueryData<BlogPost[]>(QUERY_KEYS.community.blog);
    const postsPromise = cached ? Promise.resolve(cached) : this.getBlogPosts();
    return postsPromise.then((posts) => {
      const sameCategory = posts.filter(
        (item) => item.slug !== post.slug && item.category === post.category
      );
      if (sameCategory.length >= limit) return sameCategory.slice(0, limit);
      const others = posts.filter(
        (item) => item.slug !== post.slug && item.category !== post.category
      );
      return [...sameCategory, ...others].slice(0, limit);
    });
  },

  /** `GET /portal/stats` — hero impact statistics. */
  getStats(): Promise<PublicHeroStats> {
    return apiGet<PublicHeroStats>(API_ROUTES.community.stats);
  },

  /** `GET /volunteers/me/status` — authoritative volunteer lifecycle status. */
  getVolunteerStatus(): Promise<VolunteerMeStatusResponse> {
    return apiGet<VolunteerMeStatusResponse>(
      API_ROUTES.community.volunteerStatus
    );
  },

  /** `POST /volunteers/apply` — submit an auth-gated volunteer application. */
  applyVolunteer(
    data: VolunteerProfileCreate
  ): Promise<VolunteerProfileResponse> {
    return apiPost<VolunteerProfileResponse>(
      API_ROUTES.community.volunteerApply,
      data
    );
  },

  /** `GET /volunteers/shifts` — upcoming volunteer shifts (any signed-in user). */
  listVolunteerShifts(
    params?: VolunteerShiftQueryParams
  ): Promise<Page<VolunteerShiftResponse>> {
    return apiGetPage<VolunteerShiftResponse>(
      API_ROUTES.community.volunteerShifts,
      params
    );
  },

  /** `POST /volunteers/shifts/{shift_id}/join` — sign up for a shift. */
  joinVolunteerShift(shiftId: string): Promise<ShiftAttendanceResponse> {
    return apiPost<ShiftAttendanceResponse>(
      API_ROUTES.community.joinVolunteerShift(shiftId)
    );
  },

  /** `POST /volunteers/attendance/{id}/check-in` — check in for a joined shift. */
  checkInShift(attendanceId: string): Promise<ShiftAttendanceResponse> {
    return apiPost<ShiftAttendanceResponse>(
      API_ROUTES.community.attendanceCheckIn(attendanceId)
    );
  },

  /** `POST /volunteers/attendance/{id}/check-out` — check out of a joined shift. */
  checkOutShift(attendanceId: string): Promise<ShiftAttendanceResponse> {
    return apiPost<ShiftAttendanceResponse>(
      API_ROUTES.community.attendanceCheckOut(attendanceId)
    );
  },

  /** `GET /volunteers/me/attendance` — current volunteer's attendance/joined shift records. */
  getMyAttendance(): Promise<ShiftAttendanceResponse[] | Page<ShiftAttendanceResponse>> {
    return apiGet<ShiftAttendanceResponse[] | Page<ShiftAttendanceResponse>>(
      API_ROUTES.community.myAttendance
    );
  },

  /** `GET /volunteers/{profile_id}/certificate` — verified service-certificate URL. */
  getVolunteerCertificate(
    profileId: string
  ): Promise<DownloadUrlResponse> {
    return apiGet<DownloadUrlResponse>(
      API_ROUTES.community.volunteerCertificate(profileId)
    );
  },

  /** `GET /volunteers/{profile_id}/service-summary` — verified service totals. */
  getVolunteerServiceSummary(
    profileId: string
  ): Promise<VolunteerServiceSummary> {
    return apiGet<VolunteerServiceSummary>(
      API_ROUTES.community.volunteerServiceSummary(profileId)
    );
  },

  /** `GET /portal/legal` — published legal documents (terms, privacy, etc.). */
  getLegalDocuments(): Promise<LegalDocumentResponse[]> {
    return apiGet<LegalDocumentResponse[]>(API_ROUTES.community.legal);
  },

  /** `GET /portal/legal/{slug}` — a single published legal document. */
  getLegalDocumentBySlug(slug: string): Promise<LegalDocumentResponse> {
    return apiGet<LegalDocumentResponse>(API_ROUTES.community.legalDoc(slug));
  },

  /** `GET /portal/urgent-alerts` — currently active urgent alerts. */
  getUrgentAlerts(): Promise<UrgentAlertResponse[]> {
    return apiGet<UrgentAlertResponse[]>(API_ROUTES.community.urgentAlerts);
  },

  /** `GET /portal/transparency` — annual transparency statistics. */
  getTransparencyStats(): Promise<TransparencyStats> {
    return apiGet<TransparencyStats>(API_ROUTES.community.transparency);
  },

  /** `GET /portal/me/dashboard` — the current user's activity summary. */
  getMyDashboard(): Promise<UserDashboardSummary> {
    return apiGet<UserDashboardSummary>(API_ROUTES.community.meDashboard);
  },

  /** `GET /dashboards/public` — public impact dashboard (arbitrary JSON). */
  getPublicDashboard(): Promise<Record<string, unknown>> {
    return apiGet<Record<string, unknown>>(API_ROUTES.dashboards.public);
  },
};

export type {
  BlogPost,
  DownloadUrlResponse,
  LegalDocumentResponse,
  PublicHeroStats,
  ShiftAttendanceResponse,
  TransparencyStats,
  UrgentAlertResponse,
  UserDashboardSummary,
  VolunteerProfileCreate,
  VolunteerProfileResponse,
  VolunteerServiceSummary,
  VolunteerShiftResponse,
};
