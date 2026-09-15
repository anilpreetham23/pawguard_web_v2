# Module 11 — Testing, QA & Production Validation

Status: **IMPLEMENTED / PRODUCTION-READY**

## Subsystem Overview

The Testing, QA & Production Validation module details the verification strategy, quality assurance standards, test suites, and production release validation procedures implemented for PawGuard Public Web. It covers TypeScript static verification, ESLint code audits, Jest unit/integration testing, Playwright End-to-End (E2E) browser automation, and post-deployment production verification checklists.

---

## Test Execution Commands

| Test Type | Command Line Execution | Scope & Purpose |
|---|---|---|
| **Static Type Check** | `npx tsc --noEmit` | Validates TypeScript type safety across all components, services, and types |
| **Code Linting** | `npm run lint` | Enforces Next.js ESLint rules and code formatting |
| **Production Build** | `npm run build` | Validates App Router page generation, SSR exports, and asset bundling |
| **Unit / Integration** | `npx jest` | Runs Jest test suites for service layers, utilities, and component rendering |
| **E2E Browser Automation** | `npx playwright test` | Executes cross-browser E2E automation for QR scanning, auth, and checkout |
| **Clean Build Test** | `npm run dev:clean` | Clears `.next` build cache and validates fresh environment startup |

---

## E2E Playwright Automation Coverage

1. **Authentication Suite:** Tests email/password login modal (`AuthDialog.tsx`), Google OAuth redirect flow, state validation, and invalid credential error state handling.
2. **QR Tag Scanner Suite:** Tests token resolution (`POST /companion-pets/safety-tag/scan`), `sanitizeScanToken()` extraction, privacy-safe pet profile rendering, and invalid tag 404 alert handling.
3. **Lost & Found Suite:** Tests lost pet directory browsing, sighting submission form validation (`validatePhone()`), HTML5 Geolocation coordinate capture, and `POST /lost-found/sighting`.
4. **Donation Checkout Suite:** Tests `/donate` tier selection, order creation (`POST /donations/checkout`), Razorpay modal opening, and payment verification (`POST /donations/verify`).
5. **Emergency Banner Suite:** Tests urgent alert retrieval (`GET /portal/urgent-alerts`), site-wide banner rendering (`UrgentAlertBanner.tsx`), and visitor session dismissal via `sessionStorage`.

---

## QA Boundaries & Responsibility Allocation

* **Frontend Responsibility (Public Web Repository):**
  * App Router component rendering and layout responsiveness
  * Client-side form input validation and error feedback
  * Token persistence in `localStorage` and `Authorization: Bearer` header attachment
  * Google OAuth state parameter generation and callback validation
  * Next.js rewrite proxy configuration (`next.config.ts`)
  * Local session banner dismissal (`sessionStorage`)
* **Backend Responsibility (Render API Service):**
  * FastAPI REST API business logic, database queries, and data validation
  * Database transaction ACID integrity (PostgreSQL)
  * Razorpay payment signature verification on backend server
  * SMS, email, and push notification dispatch engines
  * S3 presigned URL generation and asset bucket permissions

---

## Production Release Checklist

Before approving a production deployment to Vercel ([`https://pawguard-web-v2.vercel.app`](https://pawguard-web-v2.vercel.app)):

- [x] **TypeScript Validation:** `npx tsc --noEmit` completes with 0 errors.
- [x] **Linting Audit:** `npm run lint` passes without blocking warnings.
- [x] **Production Compilation:** `npm run build` generates `.next` without page export errors.
- [x] **Git Status:** Working tree clean, only intended files modified, no committed secrets or `.env.local`.
- [x] **Secret Audit:** Confirmed no API secret keys or Google Client Secrets are embedded in client code.
- [x] **Live API Connectivity:** Verify `/api/v1` rewrite proxy connects cleanly to Render backend.
- [x] **CORS & Cookies:** Confirmed same-origin proxy rewrites prevent browser CORS blocks.
