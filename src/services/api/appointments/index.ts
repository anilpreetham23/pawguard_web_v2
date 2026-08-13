/**
 * Veterinary appointments feature service.
 *
 * Feature-level API calls for the appointment-booking module. Request/response
 * shapes are derived from the backend OpenAPI contract:
 *   https://pawguard-backend-mqri.onrender.com/redoc
 *
 *   - `GET  /companion-pets/appointments`              — list the caller's appointments (auth)
 *   - `GET  /companion-pets/appointments/{id}`         — single appointment (auth)
 *   - `POST /companion-pets/appointments`              — book an appointment (auth)
 *   - `POST /companion-pets/appointments/{id}/cancel`  — cancel (auth, owner/staff)
 *   - `GET  /companion-pets/clinics`                   — active veterinary clinics (public)
 *
 * Confirmation (`POST .../confirm`) requires `appointment:manage` and is a
 * clinic/staff action — it is intentionally NOT exposed here.
 */

import { API_ROUTES, apiGet, apiGetPage, apiPost } from "@/lib/api";
import type {
  AppointmentCancelRequest,
  AppointmentQueryParams,
  Page,
  PetAppointmentCreate,
  PetAppointmentResponse,
  VetClinicQueryParams,
  VetClinicResponse,
} from "@/lib/api";

export const appointmentsService = {
  /**
   * `GET /companion-pets/appointments` — the caller's authorized appointments
   * (paginated, newest first by default).
   */
  listAppointments(
    params?: AppointmentQueryParams
  ): Promise<Page<PetAppointmentResponse>> {
    return apiGetPage<PetAppointmentResponse>(
      API_ROUTES.companionPets.appointments,
      params
    );
  },

  /**
   * `GET /companion-pets/appointments/{id}` — a single authorized appointment.
   */
  getAppointment(id: string): Promise<PetAppointmentResponse> {
    return apiGet<PetAppointmentResponse>(
      API_ROUTES.companionPets.appointment(id)
    );
  },

  /**
   * `POST /companion-pets/appointments` — book a veterinary appointment.
   */
  bookAppointment(data: PetAppointmentCreate): Promise<PetAppointmentResponse> {
    return apiPost<PetAppointmentResponse>(
      API_ROUTES.companionPets.appointments,
      data
    );
  },

  /**
   * `POST /companion-pets/appointments/{id}/cancel` — cancel an appointment.
   * The owner may cancel their own appointment; staff may cancel any.
   */
  cancelAppointment(
    id: string,
    data?: AppointmentCancelRequest
  ): Promise<PetAppointmentResponse> {
    return apiPost<PetAppointmentResponse>(
      API_ROUTES.companionPets.cancelAppointment(id),
      data ?? {}
    );
  },

  /**
   * `GET /companion-pets/clinics` — active veterinary clinics that accept
   * bookings. Distinct from the public `/portal/veterinary-network` partners.
   */
  listClinics(params?: VetClinicQueryParams): Promise<Page<VetClinicResponse>> {
    return apiGetPage<VetClinicResponse>(
      API_ROUTES.companionPets.clinics,
      params
    );
  },
};

export type {
  AppointmentCancelRequest,
  AppointmentQueryParams,
  Page,
  PetAppointmentCreate,
  PetAppointmentResponse,
  VetClinicQueryParams,
  VetClinicResponse,
};
