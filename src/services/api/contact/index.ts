/**
 * Contact feature service.
 *
 * Feature-level API calls for the contact & support module. Request/response
 * shapes are derived from the backend OpenAPI contract:
 *   https://pawguard-backend-mqri.onrender.com/redoc
 *
 * All five endpoints are public (no bearer token required):
 *   - `GET /portal/contact`             — office/shelter locations
 *   - `GET /portal/faq`                 — published FAQ entries
 *   - `GET /portal/veterinary-network`  — partner veterinary clinics
 *   - `POST /portal/contact`            — submit a general inquiry message
 *   - `POST /grievance/feedback`        — rating-based service feedback
 *
 * The general-inquiry contact form submits to `POST /portal/contact`. The
 * support "articles" and emergency hotlines are derived from the FAQ and
 * location endpoints respectively.
 */

import { API_ROUTES, apiGet, apiGetPage, apiPost } from "@/lib/api";
import type {
  ContactInquiryResponse,
  ContactLocationResponse,
  ContactMessageCreate,
  FAQEntryResponse,
  GrievanceCommentResponse,
  GrievanceCreate,
  GrievanceResponse,
  Page,
  QueryParams,
  ServiceFeedbackCreate,
  ServiceFeedbackResponse,
  UserContactInquiryResponse,
  UserGrievanceResponse,
  VeterinaryPartnerResponse,
} from "@/lib/api";

export const contactService = {
  /** `GET /portal/contact` — PawGuard office/shelter locations. */
  getContactLocations(): Promise<ContactLocationResponse[]> {
    return apiGet<ContactLocationResponse[]>(API_ROUTES.contact.locations);
  },

  /** `POST /portal/contact` — submit a general inquiry message. */
  submitContactMessage(
    data: ContactMessageCreate
  ): Promise<ContactInquiryResponse> {
    return apiPost<ContactInquiryResponse>(API_ROUTES.contact.locations, data);
  },

  /** `GET /portal/faq` — published FAQ entries (all categories). */
  getFaqEntries(): Promise<FAQEntryResponse[]> {
    return apiGet<FAQEntryResponse[]>(API_ROUTES.contact.faq);
  },

  /** `GET /portal/veterinary-network` — partner veterinary clinics. */
  getVeterinaryPartners(): Promise<VeterinaryPartnerResponse[]> {
    return apiGet<VeterinaryPartnerResponse[]>(
      API_ROUTES.contact.veterinaryNetwork
    );
  },

  /** `POST /grievance/feedback` — submit rating-based service feedback. */
  submitFeedback(
    data: ServiceFeedbackCreate
  ): Promise<ServiceFeedbackResponse> {
    return apiPost<ServiceFeedbackResponse>(API_ROUTES.contact.feedback, data);
  },

  /**
   * `POST /grievance` — create a public grievance/support ticket (no auth required,
   * rate-limited). A ticket number / tracking reference is returned on the
   * response for the reporter to follow up.
   */
  submitComplaint(data: GrievanceCreate): Promise<GrievanceResponse> {
    return apiPost<GrievanceResponse>(API_ROUTES.contact.grievance, data);
  },

  /** `GET /portal/me/contact-inquiries` — list contact inquiries submitted by authenticated user. */
  getMyContactInquiries(params?: QueryParams): Promise<Page<UserContactInquiryResponse>> {
    return apiGetPage<UserContactInquiryResponse>(
      API_ROUTES.contact.meContactInquiries,
      params
    );
  },

  /** `GET /portal/me/contact-inquiries/{inquiry_id}` — get single contact inquiry for authenticated user. */
  getMyContactInquiry(inquiryId: string): Promise<UserContactInquiryResponse> {
    return apiGet<UserContactInquiryResponse>(
      API_ROUTES.contact.meContactInquiry(inquiryId)
    );
  },

  /** `GET /api/v1/grievance/me` — list grievance tickets submitted by authenticated user. */
  getMyGrievances(params?: QueryParams): Promise<Page<UserGrievanceResponse>> {
    return apiGetPage<UserGrievanceResponse>(
      API_ROUTES.contact.meGrievances,
      params
    );
  },

  /** `GET /api/v1/grievance/me/{ticket_id}` — get details of single grievance ticket for authenticated user. */
  getMyGrievance(ticketId: string): Promise<UserGrievanceResponse> {
    return apiGet<UserGrievanceResponse>(
      API_ROUTES.contact.meGrievance(ticketId)
    );
  },

  /** `GET /api/v1/grievance/me/{ticket_id}/comments` — list public comments on a grievance ticket for authenticated user. */
  getMyGrievanceComments(ticketId: string): Promise<GrievanceCommentResponse[]> {
    return apiGet<GrievanceCommentResponse[]>(
      API_ROUTES.contact.meGrievanceComments(ticketId)
    );
  },
};

export type {
  ContactInquiryResponse,
  ContactLocationResponse,
  ContactMessageCreate,
  FAQEntryResponse,
  GrievanceCommentResponse,
  GrievanceCreate,
  GrievanceResponse,
  ServiceFeedbackCreate,
  ServiceFeedbackResponse,
  UserContactInquiryResponse,
  UserGrievanceResponse,
  VeterinaryPartnerResponse,
};
