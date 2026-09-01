/**
 * Shared API constants: timeouts, headers, route map, and query keys.
 *
 * Route paths are relative to `apiConfig.baseURL` (they do NOT include the
 * `/api/v1` prefix). Values are derived from the backend OpenAPI contract at
 * https://pawguard-backend-mqri.onrender.com/redoc
 */

/* -------------------------------------------------------------------------- */
/* Timeouts                                                                   */
/* -------------------------------------------------------------------------- */

export const API_TIMEOUT_MS = 15_000;
export const API_UPLOAD_TIMEOUT_MS = 60_000;
/** Base delay for the exponential retry backoff (transient failures only). */
export const API_RETRY_BASE_DELAY_MS = 1_500;
/** Maximum single delay between retries. */
export const API_RETRY_MAX_DELAY_MS = 20_000;
/** How many retries are attempted for transient (network/5xx/timeout/429) errors. */
export const API_DEFAULT_RETRY = 3;
export const API_STALE_TIME_MS = 5 * 60 * 1000;

/* -------------------------------------------------------------------------- */
/* Token storage keys                                                         */
/* -------------------------------------------------------------------------- */

export const AUTH_TOKEN_STORAGE_KEYS = {
  accessToken: "pawguard.access_token",
  refreshToken: "pawguard.refresh_token",
} as const;

/* -------------------------------------------------------------------------- */
/* Public Site URL                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Authoritative Canonical Production Public Web Base URL.
 * All scannable physical QR tags, printed QR tags, and downloadable QR PNGs MUST ALWAYS
 * encode this canonical production origin so physical tags resolve on mobile devices.
 */
export const PUBLIC_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_PUBLIC_WEB_URL ||
  process.env.VITE_PUBLIC_FRONTEND_URL ||
  "https://pawguard-public-web.vercel.app";

/* -------------------------------------------------------------------------- */
/* Headers                                                                    */
/* -------------------------------------------------------------------------- */

export const API_HEADERS = {
  json: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  multipart: {
    "Content-Type": "multipart/form-data",
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Routes                                                                     */
/* -------------------------------------------------------------------------- */

export const API_ROUTES = {
  health: "/health",

  auth: {
    login: "/auth/login",
    register: "/auth/register",
    refresh: "/auth/refresh",
    mfaVerify: "/auth/mfa/verify",
    logout: "/auth/logout",
    logoutAll: "/auth/logout-all",
    me: "/auth/me",
    sessions: "/auth/sessions",
    session: (id: string) => `/auth/sessions/${id}`,
    changePassword: "/auth/password/change",
    passwordResetRequest: "/auth/password/reset/request",
    passwordResetConfirm: "/auth/password/reset/confirm",
    emailVerifyRequest: "/auth/email/verify/request",
    emailVerifyConfirm: "/auth/email/verify/confirm",
    mfaEnroll: "/auth/mfa/enroll",
    mfaEnrollConfirm: "/auth/mfa/enroll/confirm",
    mfaDisable: "/auth/mfa/disable",
    oauthLogin: "/auth/oauth/login",
    oauthAccounts: "/auth/oauth/accounts",
    oauthLink: "/auth/oauth/link",
    oauthAccount: (id: string) => `/auth/oauth/accounts/${id}`,
  },

  adoption: {
    dogs: "/dogs",
    dog: (id: string) => `/dogs/${id}`,
    dogPublicScan: (id: string) => `/dogs/${id}/public-scan`,
    dogQrImage: (id: string) => `/dogs/${id}/qr-image`,
    applications: "/adoptions",
    application: (id: string) => `/adoptions/${id}`,
    myApplications: "/adoptions/my",
  },

  safetyTag: {
    scan: "/companion-pets/safety-tag/scan",
    petTag: (petId: string) => `/companion-pets/${petId}/safety-tag`,
  },

  companionPets: {
    base: "/companion-pets",
    pet: (id: string) => `/companion-pets/${id}`,
    fromAdoption: (applicationId: string) =>
      `/companion-pets/from-adoption/${applicationId}`,
    appointments: "/companion-pets/appointments",
    appointment: (id: string) => `/companion-pets/appointments/${id}`,
    confirmAppointment: (id: string) =>
      `/companion-pets/appointments/${id}/confirm`,
    cancelAppointment: (id: string) =>
      `/companion-pets/appointments/${id}/cancel`,
    clinics: "/companion-pets/clinics",
    clinic: (id: string) => `/companion-pets/clinics/${id}`,
    reminders: (petId: string) => `/companion-pets/${petId}/reminders`,
    reminder: (petId: string, reminderId: string) =>
      `/companion-pets/${petId}/reminders/${reminderId}`,
    photoUploadUrl: (petId: string) => `/companion-pets/${petId}/photo-upload-url`,
    confirmPhoto: (petId: string) => `/companion-pets/${petId}/photo/confirm`,
  },

  rescue: {
    base: "/rescue",
    report: "/rescue/report",
    publicReport: "/public/rescue/report",
    mediaUploadUrl: "/rescue/media-upload-url",
    case: (id: string) => `/rescue/${id}`,
    status: "/rescue/status",
  },

  lostFound: {
    lost: "/lost-found/lost",
    found: "/lost-found/found",
    photoUploadUrl: "/lost-found/photo-upload-url",
    sighting: "/lost-found/sighting",
    lostById: (id: string) => `/lost-found/lost/${id}`,
    foundById: (id: string) => `/lost-found/found/${id}`,
    reportById: (id: string) => `/lost-found/reports/${id}`,
    broadcast: (reportId: string) => `/lost-found/lost/${reportId}/broadcast`,
    matches: (reportId: string) => `/lost-found/lost/${reportId}/matches`,
    foundMatches: (reportId: string) => `/lost-found/found/${reportId}/matches`,
    claimMatch: (matchId: string) => `/lost-found/matches/${matchId}/claim`,
  },

  donation: {
    base: "/donations",
    register: "/donations/register",
    checkout: "/donations/checkout",
    verify: "/donations/verify",
    history: "/donations/history",
    receipt: (id: string) => `/donations/${id}/receipt`,
    sponsorships: "/donations/sponsorships",
    mySponsorships: "/donations/sponsorships/my",
    sponsorship: (id: string) => `/donations/sponsorships/${id}`,
    sponsorshipStatus: (id: string) =>
      `/donations/sponsorships/${id}/status`,
    donors: "/donations/donors",
    campaigns: "/donations/campaigns",
    campaign: (id: string) => `/donations/campaigns/${id}`,
  },

  community: {
    blog: "/portal/blog",
    blogPost: (slug: string) => `/portal/blog/slug/${slug}`,
    stats: "/portal/stats",
    successStories: "/portal/success-stories",
    successStory: (id: string) => `/portal/success-stories/${id}`,
    volunteers: "/volunteers",
    volunteerApply: "/volunteers/apply",
    volunteerShifts: "/volunteers/shifts",
    joinVolunteerShift: (shiftId: string) =>
      `/volunteers/shifts/${shiftId}/join`,
    attendanceCheckIn: (attendanceId: string) =>
      `/volunteers/attendance/${attendanceId}/check-in`,
    attendanceCheckOut: (attendanceId: string) =>
      `/volunteers/attendance/${attendanceId}/check-out`,
    volunteerCertificate: (profileId: string) =>
      `/volunteers/${profileId}/certificate`,
    volunteerServiceSummary: (profileId: string) =>
      `/volunteers/${profileId}/service-summary`,
    volunteerStatus: "/volunteers/me/status",
    myAttendance: "/volunteers/me/attendance",
    legal: "/portal/legal",
    legalDoc: (slug: string) => `/portal/legal/${slug}`,
    urgentAlerts: "/portal/urgent-alerts",
    transparency: "/portal/transparency",
    meDashboard: "/portal/me/dashboard",
  },

  contact: {
    faq: "/portal/faq",
    locations: "/portal/contact",
    veterinaryNetwork: "/portal/veterinary-network",
    feedback: "/grievance/feedback",
    grievance: "/grievance",
  },

  foster: {
    apply: "/fosters/apply",
    me: "/fosters/me",
    myPlacements: "/fosters/me/placements",
    placementProgress: (placementId: string) =>
      `/fosters/placements/${placementId}/progress`,
    placementSupplies: (placementId: string) =>
      `/fosters/placements/${placementId}/supplies`,
    requestSupplies: (placementId: string) =>
      `/fosters/placements/${placementId}/supplies/request`,
    convertToAdopt: (placementId: string) =>
      `/fosters/placements/${placementId}/convert-to-adopt`,
  },

  settings: {
    publicContent: "/settings/public-content",
  },

  dashboards: {
    public: "/dashboards/public",
  },

  notifications: {
    list: "/notifications",
    unreadCount: "/notifications/unread-count",
    markRead: (id: string) => `/notifications/${id}/read`,
    markAllRead: "/notifications/read-all",
    notification: (id: string) => `/notifications/${id}`,
    preferences: "/notifications/preferences",
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Query keys (react-query)                                                   */
/* -------------------------------------------------------------------------- */

export const QUERY_KEYS = {
  auth: {
    me: ["auth", "me"] as const,
    sessions: ["auth", "sessions"] as const,
    oauthAccounts: ["auth", "oauth", "accounts"] as const,
  },

  adoption: {
    pets: ["adoption", "pets"] as const,
    pet: (id: string) => ["adoption", "pets", id] as const,
    applications: ["adoption", "applications"] as const,
  },

  rescue: {
    cases: ["rescue", "cases"] as const,
    case: (id: string) => ["rescue", "cases", id] as const,
    status: ["rescue", "status"] as const,
  },

  lostFound: {
    reports: ["lost-found", "reports"] as const,
    report: (id: string) => ["lost-found", "reports", id] as const,
    matches: (reportId: string) =>
      ["lost-found", "matches", reportId] as const,
    sighting: ["lost-found", "sighting"] as const,
  },

  safetyTag: {
    scan: ["safety-tag", "scan"] as const,
    petTag: (petId: string) => ["safety-tag", "pets", petId] as const,
    dogPublicScan: (dogId: string) => ["safety-tag", "dogs", dogId] as const,
  },

  companionPets: {
    pets: ["companion-pets", "pets"] as const,
    pet: (id: string) => ["companion-pets", "pets", id] as const,
    appointments: ["companion-pets", "appointments"] as const,
    appointment: (id: string) =>
      ["companion-pets", "appointments", id] as const,
    clinics: ["companion-pets", "clinics"] as const,
    reminders: (petId: string) => ["companion-pets", "reminders", petId] as const,
  },

  donation: {
    campaigns: ["donation", "campaigns"] as const,
    campaign: (id: string) => ["donation", "campaigns", id] as const,
    history: ["donation", "history"] as const,
    receipts: ["donation", "receipts"] as const,
    sponsorships: ["donation", "sponsorships"] as const,
    sponsorship: (id: string) => ["donation", "sponsorships", id] as const,
    order: (id: string) => ["donation", "orders", id] as const,
  },

  community: {
    blog: ["community", "blog"] as const,
    blogPost: (slug: string) => ["community", "blog", slug] as const,
    stats: ["community", "stats"] as const,
    volunteers: ["community", "volunteers"] as const,
    volunteerShifts: ["community", "volunteers", "shifts"] as const,
    successStory: (id: string) => ["community", "success-stories", id] as const,
    legal: ["community", "legal"] as const,
    legalDoc: (slug: string) => ["community", "legal", slug] as const,
    volunteerServiceSummary: (id: string) => ["community", "volunteers", id, "service-summary"] as const,
    volunteerCertificate: (id: string) => ["community", "volunteers", id, "certificate"] as const,
    urgentAlerts: ["community", "urgent-alerts"] as const,
    transparency: ["community", "transparency"] as const,
    meDashboard: ["community", "me-dashboard"] as const,
    volunteerStatus: ["community", "volunteers", "me-status"] as const,
    myAttendance: ["community", "volunteers", "me-attendance"] as const,
  },

  contact: {
    faq: ["contact", "faq"] as const,
    locations: ["contact", "locations"] as const,
    veterinaryNetwork: ["contact", "veterinary-network"] as const,
    feedback: ["contact", "feedback"] as const,
  },

  foster: {
    profiles: ["foster", "profiles"] as const,
    me: ["foster", "me"] as const,
    myPlacements: ["foster", "me", "placements"] as const,
    placementProgress: (placementId: string) =>
      ["foster", "placements", placementId, "progress"] as const,
    placementSupplies: (placementId: string) =>
      ["foster", "placements", placementId, "supplies"] as const,
  },

  settings: {
    publicContent: ["settings", "public-content"] as const,
  },

  dashboards: {
    public: ["dashboards", "public"] as const,
  },

  notifications: {
    list: ["notifications", "list"] as const,
    unreadCount: ["notifications", "unread-count"] as const,
    preferences: ["notifications", "preferences"] as const,
  },
} as const;
