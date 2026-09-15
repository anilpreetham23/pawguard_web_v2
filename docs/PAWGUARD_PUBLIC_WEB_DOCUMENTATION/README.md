# PawGuard Public Web Complete Documentation Package

Welcome to the master technical documentation repository for **PawGuard Public Web**.

PawGuard Public Web (`pawguard-nextjs`) is the primary public-facing desktop and mobile-responsive web application for the PawGuard pet welfare ecosystem. Built with **Next.js 15.5+ (App Router)**, **React 18.3+**, **TypeScript 5.9.3**, and **Tailwind CSS 4.1**, the application provides public citizens, pet owners, animal finders, veterinarians, and shelter partners with access to PawGuard services.

---

## System Overview

* **Application Scope:** PawGuard Public Web frontend repository (`anilpreetham23/pawguard_web_v2`).
* **Frontend Hosting Target:** **Vercel** ([`https://pawguard-web-v2.vercel.app`](https://pawguard-web-v2.vercel.app)).
* **Backend Platform Target:** PawGuard RESTful FastAPI Backend hosted independently on **Render** (`https://pawguard-backend-mqri.onrender.com/api/v1`).
* **Client API Strategy:** Relative `/api/v1` client browser requests proxied server-side via Next.js rewrite rules in `next.config.ts` to ensure same-origin CORS compliance and secure session state handling.

---

## Technology Stack

| Layer | Technologies & Versions |
|---|---|
| **Core Framework & Runtime** | Next.js 15.5.23 (App Router), React 18.3.1, TypeScript 5.9.3 |
| **Styling & UI Primitives** | Tailwind CSS 4.1.12, PostCSS, Radix UI Primitives, MUI Material 7.3+, Lucide Icons 0.487+ |
| **Animations & Motion** | Framer Motion (`motion` 12.23+), GSAP 3.15+, `@react-spring/web`, `lottie-react`, `lenis` smooth scrolling |
| **Data Fetching & State** | TanStack React Query v5.101.4, Axios 1.19.0, Zustand v5.0.14, React Hook Form 7.55+ |
| **Authentication System** | Dual-mode JWT (`pawguard.access_token`, `pawguard.refresh_token` in `localStorage`) + Google OAuth 2.0 Token Flow (`response_type=token`, `/auth/callback`, `sessionStorage` CSRF `oauth_state` token validation) |
| **Payment Gateway** | Razorpay Web Checkout SDK (`checkout.js`), dynamic order key (`order.checkout_key`), verification payload (`POST /api/v1/donations/verify`) |
| **Utilities & Scanner** | `html5-qrcode` 2.3.8, `jsqr` 1.4.0, `qrcode` 1.5.4, `date-fns` 3.6+, Vaul 1.1+, Sonner 2.0+ |

---

## Documentation Modules Index

This complete documentation package consists of the following 11 detailed subsystem README modules:

1. [**01. System Architecture & API**](01-system-architecture-and-api/README.md) — Architectural overview, Next.js App Router layout, `next.config.ts` rewrite proxy, state management, and API client interceptors.
2. [**02. QR Safety Tag**](02-qr-safety-tag/README.md) — Digital safety tag scanning (`/scan`), token resolution (`POST /companion-pets/safety-tag/scan`), tag provisioning/rotation/deactivation, privacy shielding, and `robots.ts` crawler disallow rules.
3. [**03. Lost & Found**](03-lost-and-found/README.md) — Lost pet directory, interactive sighting report form (`POST /lost-found/sighting`), GPS coordinate capture, owner notification integration, and finder privacy protections.
4. [**04. Veterinarian Directory & Appointments**](04-vet-directory-and-appointments/README.md) — Searchable vet clinic directory (`/veterinary`), slot booking picker (`POST /companion-pets/appointments`), appointment confirmation, and cancellation workflows.
5. [**05. Pet Health & Reminders**](05-pet-health-and-reminders/README.md) — Automated pet vaccination and care reminder schedules (`GET /medical/dogs/{dog_id}/reminders`), owner care management, and strict medical privacy boundaries.
6. [**06. Adoption & Rescue**](06-adoption-and-rescue/README.md) — Adoptable pet catalog (`/adopt`), multi-trait search filtering, rescue dog public profile scans (`GET /dogs/{dog_id}/public-scan`), and online foster-to-adopt applications.
7. [**07. Emergency & Urgent Rescue**](07-emergency-and-urgent-rescue/README.md) — Active rescue alert banner (`GET /portal/urgent-alerts`, `UrgentAlertBanner.tsx`), session-scoped visitor dismissal (`sessionStorage`), and SOS rescue dispatch tool (`/emergency`).
8. [**08. Donations & Payments**](08-donations-and-payments/README.md) — One-time & recurring donations (`/donate`), Razorpay Web SDK integration (`POST /donations/checkout`, `order.checkout_key`), payment verification (`POST /donations/verify`), and 80G tax receipt issuance.
9. [**09. User Account & Dashboard**](09-user-account-and-dashboard/README.md) — Protected user dashboard (`/account/*`), profile management, pet manager, active lost alert tracker, donation receipts, and ticket history.
10. [**10. Contact & Grievance**](10-contact-and-grievance/README.md) — Public contact form (`/contact`), formal grievance submission (`POST /grievance`), tracking numbers, and user ticket inquiry dashboard.
11. [**11. Testing, QA & Production Validation**](11-testing-qa-and-production-validation/README.md) — Unit, integration, and Playwright E2E testing strategies, build verification, deployment validation, and frontend vs backend QA boundaries.

---

## Public Web Boundaries & Scope

This documentation package strictly details the implemented features of **PawGuard Public Web**.

* **Included:** All public citizen tools, finder QR scanning, lost/found sighting forms, adoptable listings, vet appointment booking, Razorpay donations, emergency dispatching, grievance ticketing, and pet owner dashboard features.
* **Explicitly Excluded:** Internal shelter administration dashboards (Admin Portal), Flutter/React Native mobile applications, mobile push engines (APNs/FCM), backend database ORMs/migrations, and physical QR tag manufacturing/printing logistics.
