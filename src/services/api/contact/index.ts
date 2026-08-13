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

import { API_ROUTES, apiGet, apiPost } from "@/lib/api";
import type {
  ContactLocationResponse,
  ContactMessageCreate,
  FAQEntryResponse,
  GrievanceCreate,
  GrievanceResponse,
  ServiceFeedbackCreate,
  ServiceFeedbackResponse,
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
  ): Promise<null> {
    return apiPost<null>(API_ROUTES.contact.locations, data, {
      auth: false,
    });
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
   * `POST /grievance` — create a public grievance/support ticket (no auth,
   * rate-limited). A ticket number / tracking reference is returned on the
   * response for the reporter to follow up.
   */
  submitComplaint(data: GrievanceCreate): Promise<GrievanceResponse> {
    return apiPost<GrievanceResponse>(API_ROUTES.contact.grievance, data);
  },
};

export type {
  ContactLocationResponse,
  ContactMessageCreate,
  FAQEntryResponse,
  GrievanceCreate,
  GrievanceResponse,
  ServiceFeedbackCreate,
  ServiceFeedbackResponse,
  VeterinaryPartnerResponse,
};
