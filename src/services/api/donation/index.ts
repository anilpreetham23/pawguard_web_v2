/**
 * Donation feature service.
 *
 * Feature-level API calls for the donation module. Request/response shapes
 * are derived from the backend OpenAPI contract:
 *   https://pawguard-backend-mqri.onrender.com/redoc
 *
 * Donation endpoints are authenticated. The Razorpay order/verify flow is
 * deliberately thin here — checkout creates the order, the client completes
 * payment in Razorpay Checkout.js, then `verifyDonation` confirms it. The
 * per-user `GET /donations/history` and `GET /donations/{id}/receipt`
 * endpoints power the "My Donations" experience.
 *
 * `GET /donations/campaigns` is a public listing of currently accepting
 * donation campaigns exposed by the backend donation module.
 */

import { API_ROUTES, apiGet, apiPatch, apiPost } from "@/lib/api";
import type {
  DonationCampaignResponse,
  DonationCreate,
  DonationOrderResponse,
  DonationResponse,
  DonationVerifyRequest,
  DonorProfileCreate,
  DonorProfileResponse,
  DownloadUrlResponse,
  SponsorshipCreate,
  SponsorshipResponse,
  SponsorshipStatusUpdate,
} from "@/lib/api";

export const donationService = {
  /** `POST /donations/register` — create (or ensure) the caller's donor profile. */
  registerDonor(data: DonorProfileCreate): Promise<DonorProfileResponse> {
    return apiPost<DonorProfileResponse>(API_ROUTES.donation.register, data);
  },

  /** `POST /donations/checkout` — create a payment-provider order for a donation. */
  initiateCheckout(data: DonationCreate): Promise<DonationOrderResponse> {
    return apiPost<DonationOrderResponse>(API_ROUTES.donation.checkout, data);
  },

  /** `POST /donations/verify` — verify a completed payment against the gateway. */
  verifyDonation(data: DonationVerifyRequest): Promise<DonationResponse> {
    return apiPost<DonationResponse>(API_ROUTES.donation.verify, data);
  },

  /** `GET /donations/history` — the current user's donations. */
  getDonationHistory(): Promise<DonationResponse[]> {
    return apiGet<DonationResponse[]>(API_ROUTES.donation.history);
  },

  /** `GET /donations/{id}/receipt` — signed download URL for a donation receipt. */
  getReceiptUrl(donationId: string): Promise<DownloadUrlResponse> {
    return apiGet<DownloadUrlResponse>(
      API_ROUTES.donation.receipt(donationId)
    );
  },

  /** `POST /donations/sponsorships` — sponsor a specific dog. */
  createSponsorship(data: SponsorshipCreate): Promise<SponsorshipResponse> {
    return apiPost<SponsorshipResponse>(
      API_ROUTES.donation.sponsorships,
      data
    );
  },

  /** `GET /donations/sponsorships/my` — the current user's sponsorships. */
  getMySponsorships(): Promise<SponsorshipResponse[]> {
    return apiGet<SponsorshipResponse[]>(API_ROUTES.donation.mySponsorships);
  },

  /** `GET /donations/sponsorships/{id}` — a single sponsorship (owner or staff). */
  getSponsorship(id: string): Promise<SponsorshipResponse> {
    return apiGet<SponsorshipResponse>(API_ROUTES.donation.sponsorship(id));
  },

  /**
   * `PATCH /donations/sponsorships/{id}/status` — pause or cancel a
   * sponsorship (owner or staff; only `paused`/`cancelled` are accepted).
   */
  updateSponsorshipStatus(
    id: string,
    data: SponsorshipStatusUpdate
  ): Promise<SponsorshipResponse> {
    return apiPatch<SponsorshipResponse>(
      API_ROUTES.donation.sponsorshipStatus(id),
      data
    );
  },

  /** `GET /donations/campaigns` — public listing of currently active campaigns. */
  getCampaigns(): Promise<DonationCampaignResponse[]> {
    return apiGet<DonationCampaignResponse[]>(API_ROUTES.donation.campaigns);
  },

  /** `GET /donations/campaigns/{id}` — public detail for a single campaign. */
  getCampaign(id: string): Promise<DonationCampaignResponse> {
    return apiGet<DonationCampaignResponse>(API_ROUTES.donation.campaign(id));
  },
};

export type {
  DonationCampaignResponse,
  DonationCreate,
  DonationOrderResponse,
  DonationResponse,
  DonationVerifyRequest,
  DonorProfileCreate,
  DonorProfileResponse,
  DownloadUrlResponse,
  SponsorshipCreate,
  SponsorshipResponse,
  SponsorshipStatusUpdate,
};
