/**
 * Shared API types derived from the backend OpenAPI contract.
 *
 * The backend wraps every response in an `ApiResponse` envelope
 * (`{ success, data, message }`) and paginated lists in a
 * `PaginatedResponse` envelope (`{ data: [...], meta }`). Validation
 * errors follow the FastAPI/Pydantic v2 shape (`detail: [{ loc, msg, type }]`).
 */

/* -------------------------------------------------------------------------- */
/* Response envelopes                                                         */
/* -------------------------------------------------------------------------- */

/** Generic single-resource envelope: `{ success, data, message }`. */
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message?: string | null;
}

/** Envelope for actions that do not return a payload. */
export type SuccessResponse = ApiResponse<null>;

/** Pagination metadata returned alongside paginated collections. */
export interface PaginationMeta {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

/** Paginated collection envelope: `{ data: [...], meta }`. */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
}

/**
 * Normalized page shape returned by `apiGetPage` — combines the paginated
 * envelope's `data` list with its sibling `meta`.
 */
export interface Page<T> {
  items: T[];
  meta: PaginationMeta;
}

/* -------------------------------------------------------------------------- */
/* Errors                                                                     */
/* -------------------------------------------------------------------------- */

/** FastAPI/Pydantic v2 field-level validation error. */
export interface FieldValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
  input?: unknown;
  ctx?: Record<string, unknown>;
}

/**
 * Raw error payload coming from the API. `detail` is either a string
 * (HTTPException), an array of field errors (422 validation), or arbitrary
 * object data.
 */
export type ApiErrorDetail =
  | string
  | FieldValidationError[]
  | Record<string, unknown>
  | null;

/* -------------------------------------------------------------------------- */
/* Query / request helpers                                                    */
/* -------------------------------------------------------------------------- */

/** Standard pagination query parameters (snake_case, per backend). */
export interface PaginationParams {
  page?: number;
  page_size?: number;
}

/** Standard sorting query parameters. */
export interface SortParams {
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

/** Free-form list query params used by `buildQueryString`/request helpers. */
export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined | (string | number | boolean)[]
>;

/** Options accepted by the request helpers in `src/lib/api/client.ts`. */
export interface RequestOptions {
  /** Merge headers into the default JSON headers. */
  headers?: Record<string, string>;
  /** Per-request timeout override (ms). */
  timeout?: number;
  /** Set `false` to skip attaching the bearer token (default: true). */
  auth?: boolean;
  /** Abort signal for request cancellation. */
  signal?: AbortSignal;
  /** Query parameters merged into the request URL. */
  params?: QueryParams;
}

/* -------------------------------------------------------------------------- */
/* Auth DTOs                                                                  */
/* -------------------------------------------------------------------------- */

/** Public user profile returned by login/register/me endpoints. */
export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  is_verified: boolean;
  mfa_enabled: boolean;
  roles: string[];
}

/** `POST /auth/login` success payload (inside `ApiResponse`). */
export interface LoginResponse {
  access_token: string;
  refresh_token: string | null;
  token_type: string;
  expires_in: number;
  user: AuthUser;
}

/** `POST /auth/refresh` success payload (inside `ApiResponse`). */
export interface RefreshResponse {
  access_token: string;
  refresh_token: string | null;
  token_type: string;
  expires_in: number;
}

/** Device category the backend uses for session tracking. */
export type DeviceType = "web" | "ios" | "android" | "unknown";

/** Client device context sent with login/MFA requests. */
export interface DeviceContext {
  device_id?: string | null;
  device_name?: string | null;
  device_type?: DeviceType;
}

/** Request body for `POST /auth/login`. */
export interface LoginRequest {
  email: string;
  password: string;
  /** Optional device context (defaults to `{ device_type: "unknown" }`). */
  device?: DeviceContext;
}

/** `POST /auth/login` response when the account has MFA enabled. */
export interface MFARequiredResponse {
  mfa_required: boolean;
  pre_auth_token: string;
}

/**
 * Discriminated union of the two documented `POST /auth/login` payloads:
 * a full session when no MFA step is required, or an MFA challenge.
 */
export type LoginResult = LoginResponse | MFARequiredResponse;

/** Request body for `POST /auth/mfa/verify` (completes an MFA login). */
export interface MFAVerifyRequest {
  pre_auth_token: string;
  /** 6-character one-time code. */
  code: string;
  device?: DeviceContext;
}

/** Request body for `POST /auth/refresh`. */
export interface RefreshRequest {
  refresh_token: string | null;
}

/** Normalized in-memory session tokens. */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string | null;
  /** Access token lifetime in seconds, when known. */
  expiresIn?: number;
}

/** A single active session returned by `GET /auth/sessions`. */
export interface SessionInfo {
  id: string;
  device_type: "web" | "ios" | "android" | "unknown";
  device_name: string | null;
  ip_address: string | null;
  user_agent: string | null;
  is_current: boolean;
  created_at: string;
  last_used_at: string | null;
  expires_at: string | null;
}

/** Optional fields accepted by `PUT /auth/me` to update the profile. */
export interface UserProfileUpdate {
  full_name?: string;
  phone?: string | null;
  avatar_url?: string | null;
}

/** `POST /auth/password/reset/request` request body (`PasswordResetRequest`). */
export interface PasswordResetRequest {
  email: string;
}

/** `POST /auth/password/reset/confirm` request body (`PasswordResetConfirmRequest`). */
export interface PasswordResetConfirmRequest {
  /** Opaque reset token delivered by email. */
  token: string;
  new_password: string;
}

/** `POST /auth/email/verify/confirm` request body (`EmailVerificationConfirmRequest`). */
export interface EmailVerificationConfirmRequest {
  token: string;
}

/** `POST /auth/mfa/enroll` payload (`MFAEnrollResponse`). */
export interface MFAEnrollResponse {
  /** TOTP shared secret the user must store in an authenticator app. */
  secret: string;
  /** `otpauth://` URI used to add the account to an authenticator app. */
  provisioning_uri: string;
}

/** `POST /auth/mfa/enroll/confirm` request body (a 6-digit TOTP code). */
export interface MFAEnrollConfirmRequest {
  code: string;
}

/** `POST /auth/oauth/login` request body (`OAuthLoginRequest`). */
export interface OAuthLoginRequest {
  /** Provider name, e.g. `google`. */
  provider: string;
  /** OAuth access token minted by the provider (exchanged server-side). */
  provider_token: string;
  device?: DeviceContext;
}

/** `POST /auth/oauth/link` request body (`OAuthLinkRequest`). */
export interface OAuthLinkRequest {
  provider: string;
  provider_token: string;
}

/** A linked OAuth identity returned by the oauth account endpoints. */
export interface OAuthAccountInfo {
  id: string;
  provider: string;
  provider_user_id: string;
  provider_email: string | null;
  display_name: string | null;
  picture_url: string | null;
  created_at: string;
}

/* -------------------------------------------------------------------------- */
/* Adoption / dogs DTOs                                                       */
/* -------------------------------------------------------------------------- */

/** Lifecycle state of a dog profile (`DogStatus` enum). */
export type DogStatus =
  | "rescued"
  | "clinic"
  | "shelter"
  | "fostered"
  | "adopted";

/** `GET /dogs` / `GET /dogs/{id}` payload (`DogProfileResponse`). */
export interface DogProfileResponse {
  id: string;
  registration_number: string;
  rescue_case_id: string | null;
  microchip_id: string | null;
  name: string;
  breed: string;
  gender: string;
  is_spayed_neutered: boolean;
  estimated_age: string | null;
  weight: number | null;
  color: string | null;
  temperament: string | null;
  status: DogStatus;
  shelter_facility_id: string | null;
  kennel_id: string | null;
  is_adoptable: boolean;
  is_quarantine_passed: boolean;
  created_at: string;
  updated_at: string;
}

/** Query params accepted by `GET /dogs`. */
export interface DogQueryParams
  extends PaginationParams,
    SortParams,
    QueryParams {
  /** Free-text search across name, breed, and registration number. */
  search?: string;
  status?: DogStatus;
  is_adoptable?: boolean;
  breed?: string;
  gender?: string;
  temperament?: string;
}

/* -------------------------------------------------------------------------- */
/* Safety tag / QR public scan DTOs                                           */
/* -------------------------------------------------------------------------- */

/** `POST /companion-pets/safety-tag/scan` request body. */
export interface SafetyTagScanRequest {
  /** Safety-tag token (20–256 chars). */
  token: string;
}

/**
 * `POST /companion-pets/safety-tag/scan` response payload — public, privacy-
 * safe pet info returned to anyone scanning a tag.
 */
export interface SafetyTagScanResponse {
  pet_id: string;
  name: string;
  species: string;
  breed: string | null;
  color: string | null;
  /** Care-critical notes shown prominently on a scan — `null` when unused. */
  emergency_notes: string | null;
  photo_url: string | null;
  /** Current status: safe, lost, found, reunited, or inactive. Defaults to "safe". */
  status?: "safe" | "lost" | "found" | "reunited" | "inactive" | string;
  /** Associated lost report ID if pet status is lost. */
  lost_report_id?: string | null;
  /** Reported lost location address if available. */
  lost_location?: string | null;
  /** ISO date-time string when the pet was reported lost. */
  lost_at?: string | null;
  /** Default guidance text when no custom message is set. */
  message?: string;
}

/**
 * `GET /companion-pets/{pet_id}/safety-tag` response payload — metadata
 * about the safety tag without revealing its raw token.
 */
export interface SafetyTagResponse {
  id: string;
  pet_id: string;
  token_prefix: string;
  is_active: boolean;
  last_scanned_at: string | null;
  scan_count: number;
  created_at: string;
  updated_at: string;
}

/** Breed classification enum for public dog scans. */
export type DogBreedClassification = "pure" | "mix" | "unknown";

/** Controlled sex values for public dog scans. */
export type DogGender = "male" | "female" | "unknown";

/** Behavioral-matrix values for public dog scans. */
export type DogTemperament =
  | "friendly"
  | "timid_fearful"
  | "aggressive"
  | "high_energy"
  | "pack_compatible"
  | "cat_child_safe"
  | "unknown";

/**
 * `GET /dogs/{dog_id}/public-scan` response payload — privacy-safe dog status
 * exposed by the public QR scan endpoint.
 */
export interface PublicDogScanResponse {
  name: string;
  breed: string;
  breed_classification: DogBreedClassification;
  estimated_age: string | null;
  gender: DogGender;
  weight_kg: number | null;
  temperament: DogTemperament | null;
  color: string | null;
  photo_gallery_urls: string[];
  current_status: DogStatus;
  is_adoptable: boolean;
  registration_number: string;
}

/** Lifecycle state of an adoption application (`AdoptionStatus` enum). */
export type AdoptionStatus =
  | "submitted"
  | "screening"
  | "vetting"
  | "interview"
  | "home_check"
  | "approved"
  | "rejected"
  | "completed";

/** `POST /adoptions` request body (`AdoptionApplicationCreate`). */
export interface AdoptionApplicationCreate {
  dog_id: string;
  /** e.g. "owned", "rented", "other". 3–32 characters. */
  residential_status: string;
  has_landlord_approval?: boolean;
  has_yard_fence?: boolean;
  household_members_count?: number;
  existing_pets_medical_details?: string | null;
  pet_care_experience?: string | null;
}

/** `POST /adoptions` / `GET /adoptions` payload (`AdoptionApplicationResponse`). */
export interface AdoptionApplicationResponse {
  id: string;
  dog_id: string;
  adopter_id: string;
  status: AdoptionStatus;
  residential_status: string;
  has_landlord_approval: boolean;
  has_yard_fence: boolean;
  household_members_count: number;
  existing_pets_medical_details: string | null;
  pet_care_experience: string | null;
  vetting_officer_notes: string | null;
  home_inspection_scheduled_at: string | null;
  home_inspection_notes: string | null;
  adoption_agreement_url: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  dog?: DogProfileResponse | null;
  adopter?: AuthUser | null;
}

/* -------------------------------------------------------------------------- */
/* Companion pets & appointments DTOs                                          */
/* -------------------------------------------------------------------------- */

/**
 * `GET /companion-pets` payload (`CompanionPetResponse`).
 *
 * A companion pet profile owned by the authenticated user. The list endpoint
 * is paginated (`PaginatedResponse<CompanionPetResponse>`).
 */
export interface CompanionPetResponse {
  id: string;
  owner_id: string;
  name: string;
  species: string;
  breed: string | null;
  sex: string | null;
  birth_date: string | null;
  color: string | null;
  microchip_id: string | null;
  emergency_notes: string | null;
  is_scan_enabled: boolean;
  created_at: string;
  updated_at: string;
}

/** `POST /companion-pets` request body (`CompanionPetCreate`). */
export interface CompanionPetCreate {
  /** Pet display name (required). */
  name: string;
  /** Defaults to `"dog"` on the backend. */
  species?: string;
  breed?: string | null;
  sex?: string | null;
  birth_date?: string | null;
  color?: string | null;
  microchip_id?: string | null;
  emergency_notes?: string | null;
  /** Defaults to `true` on the backend (enables QR safety-tag scanning). */
  is_scan_enabled?: boolean;
}

/** Query params accepted by `GET /companion-pets`. */
export interface CompanionPetsQueryParams
  extends PaginationParams,
    SortParams,
    QueryParams {}

/** Lifecycle state of a veterinary appointment (`AppointmentStatus` enum). */
export type AppointmentStatus =
  | "requested"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show";

/**
 * `POST /companion-pets/appointments` request body (`PetAppointmentCreate`).
 * `vet_id` is optional — the public contract does not expose a vet-selection
 * endpoint, so bookings can be placed clinic-level without a vet.
 */
export interface PetAppointmentCreate {
  pet_id: string;
  clinic_id: string;
  vet_id?: string | null;
  /** ISO-8601 datetime. */
  starts_at: string;
  /** ISO-8601 datetime. */
  ends_at: string;
  /** 1–255 characters. */
  reason: string;
  notes?: string | null;
}

/**
 * `POST /companion-pets/appointments/{id}/cancel` request body
 * (`AppointmentCancelRequest`).
 */
export interface AppointmentCancelRequest {
  /** Optional 1–255 character cancellation reason. */
  reason?: string | null;
}

/**
 * `GET /companion-pets/appointments` / `POST /companion-pets/appointments`
 * payload (`PetAppointmentResponse`). Carries only foreign-key ids — the
 * pet/clinic names must be joined client-side from the matching lists.
 */
export interface PetAppointmentResponse {
  id: string;
  pet_id: string;
  owner_id: string;
  clinic_id: string;
  vet_id: string | null;
  starts_at: string;
  ends_at: string;
  status: AppointmentStatus;
  reason: string;
  notes: string | null;
  cancellation_reason: string | null;
  created_at: string;
  updated_at: string;
}

/** Query params accepted by `GET /companion-pets/appointments`. */
export interface AppointmentQueryParams
  extends PaginationParams,
    SortParams,
    QueryParams {
  clinic_id?: string | null;
  pet_id?: string | null;
}

/**
 * `GET /companion-pets/clinics` payload (`VetClinicResponse`). The clinic
 * records referenced by `PetAppointmentCreate.clinic_id` — a separate table
 * from the public `/portal/veterinary-network` partners.
 */
export interface VetClinicResponse {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string | null;
  services: string | null;
  latitude: number | null;
  longitude: number | null;
  is_emergency: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/** Query params accepted by `GET /companion-pets/clinics`. */
export interface VetClinicQueryParams
  extends PaginationParams,
    SortParams,
    QueryParams {}

/* -------------------------------------------------------------------------- */
/* Smart reminders DTOs                                                        */
/* -------------------------------------------------------------------------- */

/** Reminder category (`ReminderKind` enum). */
export type ReminderKind = "vaccination" | "medication";

/**
 * `POST /companion-pets/{pet_id}/reminders` request body (`PetReminderCreate`).
 * `source_key` is a client-generated dedupe key — posting the same key again
 * returns `409 Conflict` instead of creating a duplicate.
 */
export interface PetReminderCreate {
  kind: ReminderKind;
  /** 1–255 characters. */
  title: string;
  /** Optional 1–4000 character note. */
  details?: string | null;
  /** ISO-8601 datetime when the reminder is due. */
  due_at: string;
  /** 1–255 character dedupe key (idempotency). */
  source_key: string;
}

/**
 * `GET /companion-pets/{pet_id}/reminders` / `POST .../reminders` payload
 * (`PetReminderResponse`). The list endpoint is a plain
 * `ApiResponse<PetReminderResponse[]>` (no pagination meta). `source_key`
 * values prefixed `medical_record:<id>:<kind>` are auto-created from clinic
 * records that set `next_reminder_at`.
 */
export interface PetReminderResponse {
  id: string;
  pet_id: string;
  owner_id: string;
  kind: ReminderKind;
  title: string;
  details: string | null;
  due_at: string;
  source_key: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/* -------------------------------------------------------------------------- */
/* Rescue DTOs                                                                */
/* -------------------------------------------------------------------------- */

/** Lifecycle state of a rescue request (`RescueStatus` enum). */
export type RescueStatus =
  | "reported"
  | "verified"
  | "dispatched"
  | "located"
  | "rescued"
  | "admitted"
  | "rejected";

/** `POST /rescue/report` request body (`RescueRequestCreate`). */
export interface RescueRequestCreate {
  reporter_name: string;
  reporter_phone: string;
  reporter_alternate_phone?: string | null;
  reporter_email?: string | null;
  is_anonymous?: boolean;
  location_address: string;
  location_landmark?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  animal_count?: number;
  physical_condition: RescuePhysicalCondition;
  behavioral_indicators?: string | null;
  /** Operational priority (PRR 3.2); CRITICAL/HIGH feed the urgent-alert banner. */
  severity?: RescueSeverity;
  /** Explicit community-assistance flag, independent of severity. */
  is_urgent?: boolean;
  /** Free-text notes from the reporter. */
  reporter_notes?: string | null;
}

/** `RescueSeverity` — operational priority for a rescue case (PRR 3.2). */
export type RescueSeverity = "critical" | "high" | "medium" | "low";

/** `RescuePhysicalCondition` — controlled intake categories (PRR 3.2). */
export type RescuePhysicalCondition =
  | "critical_life_threatening"
  | "fractured_injured"
  | "contagious_sick"
  | "malnourished"
  | "abandoned_stray"
  | "unknown";

/** Dispatch details attached to a rescue request (`RescueDispatchResponse`). */
export interface RescueDispatchResponse {
  id: string;
  rescue_request_id: string;
  assigned_driver_id: string | null;
  vehicle_id: string | null;
  equipment_details: string | null;
  dispatched_at: string;
  located_at: string | null;
  rescued_at: string | null;
  admitted_at: string | null;
  failed_at: string | null;
  failure_reason: string | null;
  notes: string | null;
}

/** A field update/report attached to a rescue request (`RescueReportResponse`). */
export interface RescueReportResponse {
  id: string;
  rescue_request_id: string;
  agent_id: string;
  notes: string | null;
  photos: string[] | null;
  created_at: string;
}

/**
 * `GET /rescue` / `GET /rescue/{id}` / `POST /rescue/report` payload
 * (`RescueRequestResponse`).
 */
export interface RescueRequestResponse {
  id: string;
  ticket_number: string;
  reporter_name: string;
  reporter_phone: string;
  reporter_alternate_phone: string | null;
  reporter_email: string | null;
  is_anonymous: boolean;
  location_address: string;
  location_landmark: string | null;
  latitude: number | null;
  longitude: number | null;
  animal_count: number;
  physical_condition: string;
  behavioral_indicators: string | null;
  status: RescueStatus;
  rejection_rationale: string | null;
  created_at: string;
  updated_at: string;
  dispatch: RescueDispatchResponse | null;
  reports: RescueReportResponse[];
}

/** Query params accepted by `GET /rescue`. */
export interface RescueQueryParams
  extends PaginationParams,
    SortParams,
    QueryParams {
  /** Search ticket number, reporter name, phone, or location. */
  search?: string;
  /** Filter by lifecycle status. */
  status?: RescueStatus;
}

/**
 * `GET /rescue/status` payload (`PublicRescueStatusResponse`).
 *
 * A deliberately minimal public "my submitted case" lookup — no reporter
 * identity or full address, just the pipeline status.
 */
export interface PublicRescueStatusResponse {
  ticket_number: string;
  status: RescueStatus;
  severity: string;
  animal_count: number;
  created_at: string;
}

/** `GET /portal/success-stories` payload (`SuccessStoryResponse`). */
export interface SuccessStoryResponse {
  id: string;
  title: string;
  summary: string;
  body: string;
  hero_image_url: string | null;
  dog_id: string | null;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

/* -------------------------------------------------------------------------- */
/* Lost & Found DTOs                                                          */
/* -------------------------------------------------------------------------- */

/** User profile embedded in report responses (`UserProfile`). */
export type UserProfile = AuthUser;

/** Animal species enum (`Species`) — matches the display `PetCategory`. */
export type Species = "dog" | "cat" | "bird" | "rabbit" | "other";

/** Lifecycle state of a lost/found report (`ReportStatus` enum). */
export type LostFoundReportStatus = "active" | "resolved" | "expired";

/** `POST /lost-found/lost` request body (`LostReportCreate`). */
export interface LostReportCreate {
  /** Defaults to `dog` when omitted. */
  species?: Species;
  pet_name: string;
  breed: string;
  color: string;
  microchip_id?: string | null;
  location_address: string;
  latitude?: number | null;
  longitude?: number | null;
  /** ISO-8601 datetime when the pet was last seen. */
  lost_at: string;
  photo_url?: string | null;
}

/**
 * `GET /lost-found/lost` / `POST /lost-found/lost` payload
 * (`LostReportResponse`).
 */
export interface LostReportResponse {
  id: string;
  user_id: string;
  species: Species;
  pet_name: string;
  breed: string;
  color: string;
  microchip_id: string | null;
  location_address: string;
  latitude: number | null;
  longitude: number | null;
  lost_at: string;
  status: LostFoundReportStatus;
  photo_url: string | null;
  created_at: string;
  user: UserProfile | null;
}

/** `POST /lost-found/found` request body (`FoundReportCreate`). */
export interface FoundReportCreate {
  /** Defaults to `dog` when omitted. */
  species?: Species;
  breed_observed: string;
  color_observed: string;
  location_address: string;
  latitude?: number | null;
  longitude?: number | null;
  /** ISO-8601 datetime when the animal was found. */
  found_at: string;
  photo_url?: string | null;
}

/**
 * `GET /lost-found/found` / `POST /lost-found/found` payload
 * (`FoundReportResponse`).
 */
export interface FoundReportResponse {
  id: string;
  user_id: string;
  species: Species;
  breed_observed: string;
  color_observed: string;
  location_address: string;
  latitude: number | null;
  longitude: number | null;
  found_at: string;
  status: LostFoundReportStatus;
  photo_url: string | null;
  created_at: string;
  user: UserProfile | null;
}

/**
 * Query params accepted by `GET /lost-found/lost` and `GET /lost-found/found`.
 * Only backend-supported filters are exposed (no gender/size/condition).
 */
export interface LostFoundQueryParams
  extends PaginationParams,
    SortParams,
    QueryParams {
  /** Free-text search across pet name, breed, color, and location. */
  search?: string;
  /** Filter by lifecycle status. */
  status?: LostFoundReportStatus;
  /** Filter by animal species. */
  species?: Species;
}

/** Lifecycle state of a lost/found match (`MatchStatus` enum). */
export type MatchStatus = "pending" | "confirmed" | "rejected";

/**
 * `GET /lost-found/lost/{report_id}/matches` and
 * `POST /lost-found/matches/{match_id}/claim` payload (`ReportMatchResponse`).
 */
export interface ReportMatchResponse {
  id: string;
  lost_report_id: string;
  found_report_id: string;
  confidence_score: number;
  status: MatchStatus;
  microchip_doc_url: string | null;
  vet_bill_url: string | null;
  photo_proof_url: string | null;
  verification_notes: string | null;
  claim_submitted_at: string | null;
  claim_reviewed_at: string | null;
  claim_reviewed_by: string | null;
  created_at: string;
  distance_km: number | null;
  temporal_gap_days: number | null;
  match_reasons: string[];
  lost_report: LostReportResponse | null;
  found_report: FoundReportResponse | null;
}

/**
 * `POST /lost-found/matches/{match_id}/claim` request body
 * (`OwnershipClaimSubmit`).
 */
export interface OwnershipClaimSubmit {
  microchip_doc_url?: string | null;
  vet_bill_url?: string | null;
  photo_proof_url?: string | null;
  verification_notes?: string | null;
}

/** `POST /lost-found/sighting` request body (`PetSightingCreate`). */
export interface PetSightingCreate {
  pet_id?: string | null;
  lost_report_id?: string | null;
  finder_name: string;
  finder_phone: string;
  finder_address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  location_address: string;
  message?: string | null;
}

/** `POST /lost-found/sighting` response payload (`PetSightingResponse`). */
export interface PetSightingResponse {
  id: string;
  pet_id: string | null;
  lost_report_id: string | null;
  finder_name: string;
  finder_phone: string;
  finder_address: string | null;
  latitude: number | null;
  longitude: number | null;
  location_address: string;
  message: string | null;
  created_at: string;
}

/* -------------------------------------------------------------------------- */
/* Community DTOs                                                             */
/* -------------------------------------------------------------------------- */

/** Content lifecycle state (`ContentStatus` enum). */
export type ContentStatus = "draft" | "published";

/**
 * `GET /portal/blog` / `GET /portal/blog/slug/{slug}` payload
 * (`BlogPostResponse`).
 */
export interface BlogPostResponse {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover_image_url: string | null;
  category: string;
  status: ContentStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

/** `GET /portal/stats` payload (`PublicHeroStats`). */
export interface PublicHeroStats {
  total_rescued: number;
  active_care_count: number;
  successful_adoptions: number;
  urgent_rescue_count: number;
}

/** `POST /volunteers/apply` request body (`VolunteerProfileCreate`). */
export interface VolunteerProfileCreate {
  emergency_contact_name: string;
  emergency_contact_phone: string;
  skills?: string | null;
  availability?: string | null;
  notes?: string | null;
  medical_conditions?: string | null;
  animal_handling_experience?: string | null;
}

/** Volunteer profile lifecycle state (`VolunteerStatus` enum). */
export type VolunteerStatus = "applied" | "onboarded" | "active" | "inactive";

/**
 * `POST /volunteers/apply` / `GET /volunteers` payload
 * (`VolunteerProfileResponse`).
 */
export interface VolunteerProfileResponse {
  id: string;
  user_id: string;
  status: VolunteerStatus;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  skills: string | null;
  availability: string | null;
  notes: string | null;
  medical_conditions: string | null;
  animal_handling_experience: string | null;
  background_check_completed: boolean;
  background_check_notes: string | null;
  created_at: string;
  updated_at: string;
  user?: UserProfile | null;
}

/** `GET /volunteers/shifts` payload (`VolunteerShiftResponse`). */
export interface VolunteerShiftResponse {
  id: string;
  shelter_facility_id: string | null;
  role_name: string;
  start_at: string;
  end_at: string;
  capacity: number;
  created_at: string;
}

/** `POST /volunteers/shifts/{id}/join` and attendance payloads. */
export interface ShiftAttendanceResponse {
  id: string;
  shift_id: string;
  volunteer_id: string;
  check_in_at: string | null;
  check_out_at: string | null;
  hours_logged: number | null;
}

/** `GET /volunteers/{id}/service-summary` payload (`VolunteerServiceSummary`). */
export interface VolunteerServiceSummary {
  volunteer_id: string;
  total_hours: number;
  shifts_count: number;
  period_start: string | null;
  period_end: string | null;
  role_summary: string;
}

/** `GET /portal/faq` payload (`FAQEntryResponse`). */
export interface FAQEntryResponse {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

/** `GET /portal/veterinary-network` payload (`VeterinaryPartnerResponse`). */
export interface VeterinaryPartnerResponse {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string | null;
  latitude: number | null;
  longitude: number | null;
  is_emergency: boolean;
  services: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * `GET /portal/contact` payload (`ContactLocationResponse`).
 *
 * A physical PawGuard office/shelter location. The backend does not expose
 * map coordinates for locations — only the veterinary network does.
 */
export interface ContactLocationResponse {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string | null;
  operating_hours: string | null;
  is_emergency_hotline: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/** `POST /portal/contact` request body (`ContactMessageCreate`). */
export interface ContactMessageCreate {
  email: string;
  subject: string;
  message: string;
}

/** `POST /grievance/feedback` request body (`ServiceFeedbackCreate`). */
export interface ServiceFeedbackCreate {
  rescue_case_id?: string | null;
  adoption_application_id?: string | null;
  rating: number;
  comments?: string | null;
}

/** `POST /grievance/feedback` payload (`ServiceFeedbackResponse`). */
export interface ServiceFeedbackResponse {
  id: string;
  rescue_case_id: string | null;
  adoption_application_id: string | null;
  rating: number;
  comments: string | null;
  created_at: string;
}

/* -------------------------------------------------------------------------- */
/* Donation DTOs                                                              */
/* -------------------------------------------------------------------------- */

/** Donation category (`DonationType` enum). */
export type DonationType = "one_time" | "recurring" | "sponsorship";

/** Lifecycle state of a donation (`DonationStatus` enum). */
export type DonationStatus = "pending" | "success" | "failed";

/** Lifecycle state of a sponsorship (`SponsorshipStatus` enum). */
export type SponsorshipStatus = "active" | "paused" | "cancelled";

/** `POST /donations/register` request body (`DonorProfileCreate`). */
export interface DonorProfileCreate {
  /** Tax ID / 80G reference, if any. */
  tax_identifier?: string | null;
  notes?: string | null;
}

/** `PUT /donations/donors/{donor_id}` request body (`DonorProfileUpdate`). */
export interface DonorProfileUpdate {
  tax_identifier?: string | null;
  notes?: string | null;
}

/** `POST /donations/register` / `GET /donations/donors` payload (`DonorProfileResponse`). */
export interface DonorProfileResponse {
  id: string;
  user_id: string;
  tax_identifier: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  user?: UserProfile | null;
}

/**
 * `POST /donations/checkout` and `POST /donations` request body
 * (`DonationCreate`).
 */
export interface DonationCreate {
  /** Optional target dog profile (used for dog-specific donations/sponsorships). */
  dog_id?: string | null;
  /** Must be >= 1. */
  amount: number;
  /** Defaults to the provider's settlement currency (INR for Razorpay). */
  currency?: string;
  /** Defaults to `one_time`. */
  donation_type?: DonationType;
  notes?: string | null;
}

/**
 * `POST /donations/checkout` payload (`DonationOrderResponse`). Returned after
 * initiating a donation — the client uses it to open the provider's checkout
 * (e.g. Razorpay Checkout.js) and complete payment.
 */
export interface DonationOrderResponse {
  donation_id: string;
  provider: string;
  order_id: string;
  amount: number;
  currency: string;
  checkout_key: string;
}

/** `POST /donations/verify` request body (`DonationVerifyRequest`). */
export interface DonationVerifyRequest {
  donation_id: string;
  gateway_order_id: string;
  gateway_payment_id: string;
  gateway_signature: string;
}

/**
 * `POST /donations/verify`, `GET /donations/history`, and
 * `GET /donations` payload (`DonationResponse`).
 */
export interface DonationResponse {
  id: string;
  donor_id: string;
  dog_id: string | null;
  amount: number;
  currency: string;
  donation_type: DonationType;
  status: DonationStatus;
  transaction_id: string | null;
  notes: string | null;
  payment_provider: string | null;
  receipt_file_key: string | null;
  created_at: string;
  dog?: DogProfileResponse | null;
}

/** `PATCH /donations/{donation_id}/status` request body (`DonationStatusUpdate`). */
export interface DonationStatusUpdate {
  status: DonationStatus;
}

/** Query params accepted by `GET /donations` (admin). */
export interface DonationQueryParams
  extends PaginationParams,
    SortParams,
    QueryParams {
  /** Search by transaction id or notes. */
  search?: string;
  /** Filter by donation type. */
  donation_type?: DonationType;
  /** Filter by status. */
  status?: DonationStatus;
  /** Filter from date (ISO format). */
  date_from?: string;
  /** Filter to date (ISO format). */
  date_to?: string;
}

/** `GET /donations/{donation_id}/receipt` payload (`DownloadUrlResponse`). */
export interface DownloadUrlResponse {
  download_url: string;
  object_key: string;
  file_id: string;
}

/** `POST /donations/sponsorships` request body (`SponsorshipCreate`). */
export interface SponsorshipCreate {
  dog_id: string;
  /** Must be >= 1. */
  monthly_amount: number;
  currency?: string;
}

/** `PATCH /donations/sponsorships/{sponsorship_id}/status` request body. */
export interface SponsorshipStatusUpdate {
  status: SponsorshipStatus;
}

/**
 * `POST /donations/sponsorships`, `GET /donations/sponsorships`,
 * `GET /donations/sponsorships/my` payload (`SponsorshipResponse`).
 */
export interface SponsorshipResponse {
  id: string;
  donor_id: string;
  dog_id: string;
  monthly_amount: number;
  currency: string;
  status: SponsorshipStatus;
  next_charge_date: string;
  started_at: string;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
  dog?: DogProfileResponse | null;
}

/* -------------------------------------------------------------------------- */
/* Donation campaigns                                                          */
/* -------------------------------------------------------------------------- */

export type CampaignStatus = "draft" | "active" | "paused" | "completed" | "cancelled";
export type CampaignType = "general" | "sponsorship" | "medical" | "rescue" | "emergency";

/** `GET /donations/campaigns` payload (`DonationCampaignResponse`). */
export interface DonationCampaignResponse {
  id: string;
  name: string;
  description: string | null;
  target_amount: number;
  currency: string;
  campaign_type: CampaignType;
  status: CampaignStatus;
  start_date: string;
  end_date: string | null;
  raised_amount: number;
  donor_count: number;
  progress_percentage: number;
  goal_reached_at: string | null;
  created_at: string;
}

/* -------------------------------------------------------------------------- */
/* Notifications                                                              */
/* -------------------------------------------------------------------------- */

/** A single notification returned by the notifications endpoints. */
export interface NotificationResponse {
  id: string;
  user_id: string;
  title: string;
  body: string;
  notification_type: string | null;
  is_broadcast: boolean;
  is_read: boolean;
  action_url: string | null;
  created_at: string;
  sent_at: string;
}

/** `GET /notifications/unread-count` payload (`UnreadCountResponse`). */
export interface UnreadCountResponse {
  count: number;
}

/** `GET /notifications/preferences` payload (`NotificationPreferenceResponse`). */
export interface NotificationPreferenceResponse {
  id: string;
  user_id: string;
  enable_push: boolean;
  enable_email: boolean;
  enable_sms: boolean;
  quiet_hours_start: string | null;
  quiet_hours_end: string | null;
}

/** `PUT /notifications/preferences` request body (`NotificationPreferenceUpdate`). */
export interface NotificationPreferenceUpdate {
  enable_push?: boolean;
  enable_email?: boolean;
  enable_sms?: boolean;
  quiet_hours_start?: string | null;
  quiet_hours_end?: string | null;
}

/* -------------------------------------------------------------------------- */
/* Foster DTOs                                                                */
/* -------------------------------------------------------------------------- */

/** Lifecycle state of a foster profile (`FosterStatus` enum). */
export type FosterStatus = "applied" | "approved" | "rejected" | "inactive";

/** `POST /fosters/apply` request body (`FosterProfileCreate`). */
export interface FosterProfileCreate {
  preferences?: string | null;
  /** Defaults to 1 on the backend. */
  max_capacity?: number;
  notes?: string | null;
}

/** `POST /fosters/apply` / `GET /fosters` payload (`FosterProfileResponse`). */
export interface FosterProfileResponse {
  id: string;
  user_id: string;
  status: FosterStatus;
  preferences: string | null;
  max_capacity: number;
  active_count: number;
  is_available: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  user?: UserProfile | null;
}

/** Item category in a foster supply dispatch (`SupplyItemType` enum). */
export type SupplyItemType =
  | "food"
  | "crate"
  | "medication"
  | "bedding"
  | "toys"
  | "other";

/** `GET /fosters/placements/{id}/progress` payload (`FosterProgressLogResponse`). */
export interface FosterProgressLogResponse {
  id: string;
  placement_id: string;
  tracked_by_id: string;
  weight_kg: number | null;
  behavior_notes: string | null;
  feeding_notes: string | null;
  medication_notes: string | null;
  exercise_minutes: number | null;
  photo_urls: string[] | null;
  mood_rating: number | null;
  notes: string | null;
  logged_at: string;
  created_at: string;
  updated_at: string;
}

/** `GET /fosters/placements/{id}/supplies` payload (`FosterSupplyDispatchResponse`). */
export interface FosterSupplyDispatchResponse {
  id: string;
  placement_id: string;
  dispatched_by_id: string;
  item_type: SupplyItemType;
  description: string | null;
  quantity: number;
  dispatched_at: string;
  created_at: string;
  updated_at: string;
}

/* -------------------------------------------------------------------------- */
/* Grievance DTOs                                                             */
/* -------------------------------------------------------------------------- */

/** Lifecycle state of a grievance ticket (`GrievanceStatus` enum). */
export type GrievanceStatus =
  | "open"
  | "investigating"
  | "awaiting_response"
  | "resolved"
  | "closed";

/** `POST /grievance` request body (`GrievanceCreate`). */
export interface GrievanceCreate {
  reporter_name: string;
  reporter_phone: string;
  reporter_email?: string | null;
  complaint_type: string;
  details: string;
}

/** `POST /grievance` payload (`GrievanceResponse`). */
export interface GrievanceResponse {
  id: string;
  reporter_name: string;
  reporter_phone: string;
  reporter_email: string | null;
  complaint_type: string;
  details: string;
  status: GrievanceStatus;
  assigned_to_admin_id: string | null;
  resolution_notes: string | null;
  sla_due_at: string | null;
  first_responded_at: string | null;
  escalation_level: number;
  escalated_at: string | null;
  escalated_to_admin_id: string | null;
  created_at: string;
  updated_at: string;
}

/* -------------------------------------------------------------------------- */
/* Portal legal / alerts / transparency                                       */
/* -------------------------------------------------------------------------- */

/** Legal document category (`LegalDocumentType` enum). */
export type LegalDocumentType =
  | "terms"
  | "privacy"
  | "adoption"
  | "foster"
  | "volunteer"
  | "donation"
  | "other";

/** `GET /portal/legal` / `GET /portal/legal/{slug}` payload. */
export interface LegalDocumentResponse {
  id: string;
  slug: string;
  title: string;
  document_type: LegalDocumentType;
  body: string;
  version: string;
  status: ContentStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Severity of an urgent alert (`AlertSeverity` enum). */
export type AlertSeverity = "info" | "warning" | "critical";

/** `GET /portal/urgent-alerts` payload (`UrgentAlertResponse`). */
export interface UrgentAlertResponse {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/** `GET /portal/transparency` payload (`TransparencyStats`). */
export interface TransparencyStats {
  total_funds_raised: number;
  total_donations: number;
  total_rescues_completed: number;
  successful_adoptions: number;
  active_volunteers: number;
  active_foster_homes: number;
  veterinary_partners: number;
  dogs_in_care: number;
}

/** `GET /portal/me/dashboard` payload (`UserDashboardSummary`). */
export interface UserDashboardSummary {
  rescue_cases: Record<string, unknown>[];
  adoption_applications: Record<string, unknown>[];
  volunteer_profile: Record<string, unknown> | null;
  foster_profile: Record<string, unknown> | null;
  donations: Record<string, unknown>[];
  lost_found_reports: Record<string, unknown>[];
}

/* -------------------------------------------------------------------------- */
/* Settings & dashboards                                                      */
/* -------------------------------------------------------------------------- */

/** `GET /settings/public-content` payload (`PublicContentResponse`). */
export interface PublicContentResponse {
  about_us: string;
  mission: string;
  updated_at: string | null;
}
