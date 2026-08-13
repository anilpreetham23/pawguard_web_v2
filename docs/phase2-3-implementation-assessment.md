# PawGuard Public Web — Phase 2/3 Implementation Assessment

## Scope
Phase 2 (critical fixes / parity) and Phase 3 (feature implementation) of the
PawGuard public web app. Every frontend feature is backed by a live endpoint on
the Render-hosted backend (`pawguard-backend-mqri.onrender.com/api/v1`); nothing
is fabricated. This report records what was built, verified live, and deferred.

---

## 1. Delivered features (all verified against live API)

### Notification Center
- `GET /notifications` + `GET /notifications/unread-count` surfaced in a
  `NotificationBell` (header) and a full `/notifications` page (View → Hook →
  Service → Mapper pattern, auth-gated, paginated, mark-read / mark-all-read /
  delete).
- Unread badge auto-refreshes every 60 s.

### Adoption application status
- Backend `AdoptionStatus` enum was missing `screening` and `interview` in the
  client type; both values added (matches the 8-value backend enum).
- `/applications` page tracks each application through the screening →
  interview → home-check → approval pipeline, shows rejection rationale, and
  paginates via the real `GET /adoptions/my` envelope `{ success, data, meta }`.

### Admin → public dog visibility (Task 3 root cause)
- **CONFIRMED BACKEND/ADMIN issue, not a frontend bug.** Evidence:
  - OpenAPI `DogProfileCreate.is_adoptable` defaults `false`.
  - Admin SPA bundle: the "add dog" form initialises `is_adoptable: false`
    (`Eu = { ..., is_adoptable: !1, status: 'shelter' }`) and `createPet` posts
    that checkbox state verbatim.
  - Dogs only become adoptable via a separate `markDogAdoptable` action
    (`PUT /dogs/{id}` `{ is_adoptable: true }`) which is **blocked unless the
    dog has vet clearance** (`vet_clearance === false`,
    `vet_clearance_status` pending/rejected, or `medical_status ===
    'quarantine'` → "Veterinary clearance is required").
- Public side is correct: `GET /dogs?is_adoptable=true&page_size=100` with no
  client-side filtering.

### Lost & Found matching UI
- `GET /lost-found/{kind}/{id}/matches` surfaced in a `MatchesPanel` on
  `/lost-found/[id]` — confidence meter, `match_reasons` chips, distance/
  temporal gap, status badges, and an ownership-claim form with proof URLs.
- Live check: endpoint is correct; the database currently has **zero matches**
  (all 22 lost + 9 found reports scanned), so the panel renders its empty state
  until the backend generates matches.

### Profile / Account
- `/account` page: `/auth/me` profile → dashboard summary
  (`GET /portal/me/dashboard` activity), quick links to applications and
  notifications.
- Saved dogs: the backend has **no favorites endpoint**, so saved-dog hearts are
  a client-side `localStorage` snapshot (name/breed/age/gender + placeholder art)
  with a per-dog saved view on `/account`. This is a documented intentional
  client feature, not fabricated backend data.

### Emergency + GPS
- Public Emergency form now submits **real** reports to `POST
  /public/rescue/report` (reporter name + phone + physical condition +
  coordinates + severity + urgency), returns the real `RES-…` ticket number, and
  calls `POST /rescue/status` to power a "Track a report" widget on the page.
- GPS coordinates are optional `latitude`/`longitude` fields captured via
  `useGeolocation`.

### Regression fixes (contact / volunteer / adopt apply)
- ContactPage form → real `POST /portal/contact` (`ContactMessageCreate`).
- VolunteerPage → real `POST /volunteers/apply` (auth-gated; sign-in dialog
  opens first). Contact and volunteer forms previously simulated submission with
  `setTimeout`/`Math.random()` — all simulation removed.
- AnimalDetailPage live view → real `POST /adoptions` (auth-gated; previously
  simulated). All fake 15% failure simulations removed repo-wide.
- No hardcoded `localhost`/`127.0.0.1` references in `src/` (API base is
  env-configurable with a production default). 404 page is a standalone themed
  page (`/unknown-path` renders it).

### Responsive + accessibility pass
- Unread-count badges (header bell + mobile menu) now announce via a visually
  hidden `aria-live` region instead of `aria-hidden`.
- Focus-visible rings on account dashboard cards, saved-dog remove buttons,
  emergency physical-condition toggles, and donation frequency/amount toggles.
- `aria-pressed` added to all toggle-style buttons (emergency condition,
  donation frequency/amount, reminder kind).
- Volunteer/reminder `<select>`s given explicit `aria-label`; contact
  Input/Textarea labels verified associated via `htmlFor`/`useId`.

### Donate (real Razorpay flow)
- `useDonationState` no longer fakes payment with `setTimeout`/`Math.random()`.
  Submit now: (1) sign-in gate, (2) `POST /donations/register`, (3) `POST
  /donations/checkout` (returns a Razorpay order + `checkout_key`), (4) opens
  Razorpay Checkout.js, (5) `POST /donations/verify` on the payment handler.
- Success screen shows the real donation reference and a "Download receipt"
  button when `receipt_file_key` is present (`GET /donations/{id}/receipt`).
- Live-verified on the QA account: register → 201 donor profile; checkout for
  both `one_time` and `recurring` → 201 with a Razorpay `order_…` + key
  (`rzp_test_…`). The provider-hosted payment + verify require a human to
  complete the card dialog, so that last step is code-reviewed, not executed.

### Volunteer status
- VolunteerPage now shows the applicant's live status when they already have a
  profile (from `GET /portal/me/dashboard` → `volunteer_profile.status`):
  applied / onboarded / active / inactive badge + availability, skills, and
  applied date, replacing the duplicate application form.

### Appointments / reminders / QR
- Appointment list + booking are live (`POST /companion-pets/appointments` → 201
  on the QA pet `205d34a3…`).
- **Appointment cancel is wired correctly but blocked by a BACKEND bug**:
  `POST /companion-pets/appointments/{id}/cancel` returns
  `422 VALIDATION_FAILED — "database entity relations failed to load during
  serialization"` and the appointment stays `requested`. Client error path
  surfaces the message; needs a backend fix.
- Reminders live-verified: create (`POST /companion-pets/{pet_id}/reminders` →
  201), list (200), delete wire to real endpoints.
- QR safety-tag scan verified end-to-end: provisioned a tag for the QA pet
  (`POST /{pet_id}/safety-tag` → 201 with `raw_token`), then public
  `POST /companion-pets/safety-tag/scan` (no auth) → 200 with the pet name,
  species, breed, message — exactly the `SafetyTagScanResponse` the ScanPage
  renders.

---

## 2. Architecture health

- Page → Hook → Service → Mapper → API client layering is consistent across all
  new pages; services never call `fetch`/`axios` directly (single client in
  `src/lib/api/client.ts`).
- `auth: false` preserved on public endpoints (login, public rescue report,
  contact submission, safety-tag scan).
- `tsc --noEmit` and `next build` are both green after every task.

---

## 3. Open items / deferred

| Item | Status | Notes |
|---|---|---|
| Backend favorites endpoint | Missing | No `/favorites` route exists; saved dogs are client-local. Reported as a BACKEND ISSUE; a server-side sync can be added later. |
| Admin dog visibility | Backend | Vet-clearance gate keeps admin-created dogs off the public list until cleared. Needs a backend/ops decision. |
| Lost & Found matches | Backend data | Endpoint verified; no matches exist in the DB yet. |
| Appointment cancel serialization | Backend | `POST /appointments/{id}/cancel` → 422 "database entity relations failed to load during serialization"; appointment never flips to cancelled. Client wiring is correct and surfaces the error. |
| Donation verification | Needs human | Register + checkout verified live; the Razorpay card dialog → verify → receipt step requires a human test payment. |

---

## 4. Verification summary

- **`tsc --noEmit`**: clean after every task this session.
- **`next build`**: green (last run) — all routes statically/dynamically prerender.
- **Architecture audit (Task 17)**: all `axios`/`fetch` usage is confined to
  `src/lib/api/` (client, auth refresh/logout, errors, url). Feature services,
  hooks, and pages use the `apiGet/apiPost/apiGetPage/apiPatch` helpers only;
  no direct HTTP calls outside the API layer.
- **Live test data created on the QA account**
  (`pgqatest.500361@mailinator.com`): donor profile `6a655b88…`; two checkout
  orders (`513cb14e…` one_time, `c1de45c0…` recurring); volunteer profile
  `9c845f50-fd40-46f6-90d6-f75c782e11d9`; rescue report `RES-20260813-2073`;
  companion pet `205d34a3-d313-42cf-88b9-0d2aa56f4d9f`; appointment
  `c155bea0-c504-4d14-9cdd-da4c0b78b63b` (cancel attempted, still `requested`);
  reminder `9734ac87-21a6-4101-8394-f48acb4a33e8`; safety tag
  `8e8cd7a7-7988-48ab-8d42-2ed7da0a8c96` + successful scan.

---

## 5. Remaining task list (Phase 2/3 tail)

1. Responsive + accessibility pass on all new pages. — **DONE** (aria controls,
   focus rings, sr-only badge announcements).
2. Verify donate/volunteer flows, appointment cancellation, reminders, QR
   public-scan against live endpoints. — **DONE** (see §1; appointment cancel
   documented as backend-blocked).
3. Architecture audit (direct HTTP calls outside the API client). — **DONE**.
4. Final `tsc` + `next build` + `git diff` review and consolidated report.