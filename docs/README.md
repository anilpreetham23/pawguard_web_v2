# PawGuard Public Web

PawGuard Public Web is the primary public-facing frontend web application for the PawGuard platform. Built with **Next.js 15.5+ (App Router)**, **React 18**, **TypeScript 5.9+**, and **Tailwind CSS**, it provides pet owners, animal welfare volunteers, public finders, and shelter partners with access to PawGuard's pet safety ecosystem.

The application integrates with the PawGuard RESTful backend platform to deliver privacy-safe QR tag scanning, real-time lost and found pet alerts, emergency rescue dispatching, veterinarian directory lookup and appointment scheduling, adoption catalogs, automated pet medical reminders, Razorpay donation processing, and formal grievance submission.

---

## Overview

PawGuard Public Web connects public citizens and pet owners to essential companion animal safety services:

* **QR Safety Tag Ecosystem:** Enables public finders to scan pet tags and safely notify owners without exposing private personal identifiable information (PII).
* **Lost & Found Alert Network:** Allows pet owners to broadcast lost pet alerts and community members to submit sighting reports with geolocation markers.
* **Emergency & Urgent Rescue:** Provides real-time urgent alert banners across the site and SOS rescue dispatch request tools.
* **Veterinarian Directory & Appointments:** Offers searchable directory listings for verified veterinarians and online appointment slot booking.
* **Adoption & Foster-to-Adopt:** Features adoptable shelter animals with multi-trait filtering and online adoption application forms.
* **Pet Health & Medical Reminders:** Manages automated vaccination, deworming, and medical reminder schedules for registered pets.
* **Donations & Payment Processing:** Facilitates one-time and recurring donations via Razorpay with automated tax receipt workflows.
* **Grievance & Contact System:** Enables public inquiry submission and formal grievance ticket tracking.

---

## Technology Stack

### Core Framework & Runtime
* **Framework:** Next.js 15.5+ (App Router, React Server Components & Client Components)
* **Library:** React 18.3+ / React DOM 18.3+
* **Language:** TypeScript 5.9+
* **Styling:** Tailwind CSS 4.1+, PostCSS, `tw-animate-css`

### UI Components & Motion
* **Component Primitives:** Radix UI (`@radix-ui/react-*`), MUI Material 7.3+, Emotion (`@emotion/react`, `@emotion/styled`)
* **Icons:** Lucide React 0.487+
* **Animations & Transitions:** Framer Motion (`motion` 12.23+), GSAP 3.15+, `lottie-react`, `lenis` smooth scrolling
* **Toast Notifications:** Sonner 2.0+
* **Modals & Drawers:** Vaul 1.1+

### Data Fetching & State Management
* **Data Fetching & Caching:** TanStack React Query (`@tanstack/react-query` 5.101+)
* **HTTP Client:** Axios 1.19+
* **State Management:** Zustand 5.0+
* **Form Handling:** React Hook Form 7.55+

### Utility Libraries
* **Date Utilities:** `date-fns` 3.6+
* **QR Code Processing:** `html5-qrcode` 2.3+, `qrcode` 1.5+, `jsqr` 1.4+
* **Charts & Analytics:** Recharts 2.15+, Web Vitals 6.0+
* **Carousels:** Embla Carousel React 8.6+, React Slick 0.31+

---

## Application Architecture

PawGuard Public Web utilizes Next.js App Router architecture (`src/app/`) combined with a centralized service layer (`src/services/api/`) and HTTP client (`src/lib/api/`).

```mermaid
graph TD
    Client[Browser / User Agent] -->|Requests / Next Router| AppRouter[Next.js 15.5 App Router - src/app]
    AppRouter -->|Renders UI Components| UI[Components & Views - src/app/components]
    UI -->|Hooks & Mutations| ReactQuery[TanStack React Query Cache]
    ReactQuery -->|Calls Service Methods| ServiceLayer[API Service Layer - src/services/api]
    ServiceLayer -->|Uses Centralized Axios Client| HttpClient[Axios Client - src/lib/api/client.ts]
    HttpClient -->|Dev / SSR Proxy Rewrite| Proxy[/api/v1 Relative Proxy / Next.js Rewrite]
    Proxy -->|REST HTTP / JSON| Backend[PawGuard Backend - Render Deployment]
```

### Architectural Principles
1. **Client Proxy Rewrites:** On the client side, API requests target relative `/api/v1` endpoints to route through Next.js proxy rewrites (`next.config.ts`). This guarantees same-origin cookies and avoids cross-site CORS and third-party cookie restrictions.
2. **Server-Side Base Resolution:** Server-Side Rendering (SSR) and Server Component requests resolve directly to `NEXT_PUBLIC_API_BASE_URL` (defaulting to `https://pawguard-backend-mqri.onrender.com/api/v1`).
3. **Layered Service Abstraction:** UI components execute domain operations via strongly typed service modules (`auth.ts`, `tag.ts`, `lost-found.ts`, `vet.ts`, `emergency.ts`, `donation.ts`, `grievance.ts`).
4. **Token Interception:** Axios interceptors automatically inject Bearer JWT tokens into request headers and handle `401 Unauthorized` session expiration events cleanly.

---

## Project Structure

```
PawGuard Homepage Design/
├── src/
│   ├── app/                      # Next.js App Router pages, layouts, and providers
│   │   ├── about/                # About PawGuard mission and team
│   │   ├── account/              # User account dashboard, pet profiles, and settings
│   │   ├── adopt/                # Adoptable pet catalog and details
│   │   ├── adoption-agreement/   # Adoption terms and legal agreement pages
│   │   ├── applications/         # Adoption and foster application tracking
│   │   ├── appointments/         # Vet appointment scheduling and management
│   │   ├── auth/                 # OAuth authentication callback (/auth/callback)
│   │   ├── components/           # Page-level and layout components (UrgentAlertBanner, AuthDialog)
│   │   ├── config/               # Frontend site configuration
│   │   ├── contact/              # Contact form and inquiry submission
│   │   ├── donate/               # Razorpay donation portal
│   │   ├── education/            # Pet care guide articles and resources
│   │   ├── emergency/            # SOS emergency rescue dispatch tool
│   │   ├── foster/               # Foster program information and application
│   │   ├── lost-found/           # Lost & found pet alert directory and sighting reports
│   │   ├── notifications/        # User notification center
│   │   ├── privacy/              # Privacy policy
│   │   ├── providers.tsx         # TanStack Query, Theme, and Toast providers
│   │   ├── reminders/            # Pet medical and vaccination reminder schedule
│   │   ├── reset-password/       # Password reset flow
│   │   ├── scan/                 # Web-based QR scanner tool
│   │   ├── stories/              # Rescue success stories
│   │   ├── tag/                  # Public QR safety tag scanner page (/tag/[tagId])
│   │   ├── terms/                # Terms of service
│   │   ├── veterinary/           # Verified vet directory search
│   │   └── volunteer/            # Volunteer sign-up
│   ├── components/               # Shared reusable UI components
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Centralized API client, utilities, and constants
│   │   └── api/                  # Axios setup, config resolution, error handling, types
│   ├── services/                 # Business logic and backend API service modules
│   │   └── api/                  # Auth, Tag, LostFound, Vet, Emergency, Donation services
│   ├── styles/                   # Tailwind and custom CSS files
│   └── types/                    # Shared TypeScript interfaces and DTOs
├── docs/                         # Architecture, API contract, deployment, and subsystem docs
│   └── DEPLOYMENT.md             # Production deployment & environment guide
├── public/                       # Static public assets
├── next.config.ts                # Next.js configuration and API rewrite rules
├── package.json                  # Dependencies and build scripts
├── tailwind.config.js            # Tailwind CSS styling design system configuration
└── tsconfig.json                 # TypeScript compiler configuration
```

---

## Core Modules

* **Authentication & User Session:** Supports email/password authentication, Google OAuth 2.0 Token / Implicit Flow with CSRF State Validation (`/auth/callback`), JWT token management, and protected account routes (`/account/*`).
* **QR Safety Tag Subsystem:** Displays privacy-safe pet profiles (`/tag/[tagId]`), allows finders to send location reports to owners without viewing owner phone/email, and enables pet owners to link new tags.
* **Lost & Found Alert Subsystem:** Public directory of active lost pets, interactive sighting report forms with location markers, and owner lost alert management.
* **Emergency & Urgent Rescue:** Renders high-severity urgent alert banners (`UrgentAlertBanner.tsx`) using `GET /portal/urgent-alerts` with client-side session dismissal (`sessionStorage`), and SOS emergency rescue dispatch forms (`/emergency`).
* **Vet Directory & Appointments:** Searchable database of verified veterinarians (`/veterinary`), slot booking pickers (`/vets/[id]/book`), and appointment history tracking.
* **Adoption & Rescue Catalog:** Multi-trait filtering for shelter animals (`/adopt`), detailed pet health histories, and online foster-to-adopt application forms.
* **Pet Health & Reminders:** Automated vaccination, deworming, and medical checkup reminder schedules (`/reminders`).
* **Donations & Payment Processing:** Razorpay payment portal (`/donate`), signature verification (`POST /api/v1/donations/verify`), and 80G tax receipt issuance.
* **Contact & Grievances:** Public inquiry submission (`/contact`) and formal grievance ticket tracking (`POST /api/v1/grievance`).

---

## Authentication

Authentication is handled via JWT tokens and integrated Google OAuth 2.0:

1. **Email/Password Authentication:** Managed through `AuthDialog.tsx` modal, obtaining access and refresh tokens from `POST /api/v1/auth/login`.
2. **Google OAuth 2.0 Token / Implicit Flow with CSRF State Validation:** Redirects to Google OAuth authorization URL with `response_type=token` and a random state token stored in `sessionStorage`, returning to the dedicated frontend callback route:
   ```
   /auth/callback
   ```
   The callback page validates the returned state token against `sessionStorage`, extracts the token payload from the URL hash/query, and completes sign-in via `POST /api/v1/auth/oauth/login`.
3. **Protected Routes:** User dashboard pages (`/account/*`) enforce client-side session checks and automatically prompt authentication dialogs when unauthenticated.

---

## API Integration

The frontend communicates with the PawGuard RESTful API v1 backend.

* **Production Backend Target:** `https://pawguard-backend-mqri.onrender.com/api/v1`
* **Local Proxy Endpoint:** `/api/v1` (rewritten via Next.js proxy configuration in `next.config.ts`)

Centralized API client configuration is defined in [`src/lib/api/config.ts`](file:///c:/Users/Dell/Desktop/PawGuard%20Homepage%20Design%20%282%29/PawGuard%20Homepage%20Design/src/lib/api/config.ts), ensuring seamless switching between development proxying and production environments.

---

## Payments

Donations and payments are processed using the **Razorpay Web SDK**:

1. User selects or enters a custom donation amount on `/donate`.
2. Frontend requests order creation from the backend API (`POST /api/v1/donations/order`).
3. Razorpay checkout modal opens via client SDK.
4. Upon successful transaction, payment signature and payload are sent to `POST /api/v1/donations/verify`.
5. Upon backend verification, a tax-exempt receipt is issued to the user's dashboard.

---

## Environment Configuration

Configure runtime environment variables in a `.env.local` file based on `.env.example`:

| Environment Variable | Description | Required | Default Value / Example |
|---|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of the PawGuard REST API (v1). | Optional | `https://pawguard-backend-mqri.onrender.com/api/v1` |
| `NEXT_PUBLIC_SITE_URL` | Canonical public site URL configuration. Falls back to `https://pawguard-public-web.vercel.app` in runtime constants or placeholder `https://pawguard.example.com`. | Optional | `https://pawguard-web-v2.vercel.app` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Client ID for Google OAuth 2.0 authentication. | Required for OAuth | `485887290260-6vshlthcact0390hlr13af80vhv93i5n.apps.googleusercontent.com` |
| `NEXT_PUBLIC_GOOGLE_REDIRECT_URI` | Explicit override for Google OAuth callback URI. | Optional | `${window.location.origin}/auth/callback` |

*Note: All client-exposed environment variables in Next.js MUST begin with the `NEXT_PUBLIC_` prefix.*

---

## Local Development

### Prerequisites
* **Node.js:** v18.17.0 or higher
* **Package Manager:** npm (v9.0.0+) or yarn / pnpm

### Setup Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/anilpreetham23/pawguard_web_v2.git
   cd "PawGuard Homepage Design"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

In the project directory, you can run:

* `npm run dev`: Starts the Next.js development server.
* `npm run dev:clean`: Clears the `.next` build cache directory and starts dev server.
* `npm run build`: Compiles the production build into the `.next` output directory.
* `npm run start`: Starts the production Next.js server locally.
* `npm run lint`: Runs ESLint check across all codebase files.
* `npm run clean`: Deletes the `.next` build output folder.
* `npm run storybook`: Launches Storybook component explorer on port 6006.
* `npm run build-storybook`: Compiles static Storybook documentation.

---

## Production Build

To test production compilation locally:

```bash
npm run build
npm run start
```

Compilation ensures TypeScript type safety, optimizes assets, generates SSR pages, and validates App Router page exports.

---

## Deployment

PawGuard Public Web is configured for continuous deployment on **Vercel**.

* **Production Site URL:** [https://pawguard-web-v2.vercel.app](https://pawguard-web-v2.vercel.app)
* **Deployment Documentation:** Detailed Vercel setup, environment variable binding, and deployment guidelines are available in [`docs/DEPLOYMENT.md`](file:///c:/Users/Dell/Desktop/PawGuard%20Homepage%20Design%20%282%29/PawGuard%20Homepage%20Design/docs/DEPLOYMENT.md).

---

## Existing Documentation

Subsystem documentation and technical specifications located in `docs/`:

* [`docs/DEPLOYMENT.md`](file:///c:/Users/Dell/Desktop/PawGuard%20Homepage%20Design%20%282%29/PawGuard%20Homepage%20Design/docs/DEPLOYMENT.md) — Production Deployment & Environment Guide
* [`docs/01-system-architecture-and-api/README.md`](file:///c:/Users/Dell/Desktop/PawGuard%20Homepage%20Design%20%282%29/PawGuard%20Homepage%20Design/docs/01-system-architecture-and-api/README.md) — Architecture & API Baseline
* [`docs/02-qr-safety-tag/README.md`](file:///c:/Users/Dell/Desktop/PawGuard%20Homepage%20Design%20%282%29/PawGuard%20Homepage%20Design/docs/02-qr-safety-tag/README.md) — QR Safety Tag Specification
* [`docs/03-repository-and-qa/README.md`](file:///c:/Users/Dell/Desktop/PawGuard%20Homepage%20Design%20%282%29/PawGuard%20Homepage%20Design/docs/03-repository-and-qa/README.md) — Repository & QA Test Guidelines
* [`docs/04-lost-found-alert-system/README.md`](file:///c:/Users/Dell/Desktop/PawGuard%20Homepage%20Design%20%282%29/PawGuard%20Homepage%20Design/docs/04-lost-found-alert-system/README.md) — Lost & Found System Documentation
* [`docs/05-vet-directory-and-appointments/README.md`](file:///c:/Users/Dell/Desktop/PawGuard%20Homepage%20Design%20%282%29/PawGuard%20Homepage%20Design/docs/05-vet-directory-and-appointments/README.md) — Vet Directory & Appointment Booking
* [`docs/06-pet-reminders/README.md`](file:///c:/Users/Dell/Desktop/PawGuard%20Homepage%20Design%20%282%29/PawGuard%20Homepage%20Design/docs/06-pet-reminders/README.md) — Pet Reminders & Health Schedule
* [`docs/28_API_Backend_Contract.md`](file:///c:/Users/Dell/Desktop/PawGuard%20Homepage%20Design%20%282%29/PawGuard%20Homepage%20Design/docs/28_API_Backend_Contract.md) — Full REST API Backend Contract
* [`docs/29_Complete_User_Flows.md`](file:///c:/Users/Dell/Desktop/PawGuard%20Homepage%20Design%20%282%29/PawGuard%20Homepage%20Design/docs/29_Complete_User_Flows.md) — User Flow & Journey Diagrams
* [`docs/PAWGUARD_PUBLIC_WEB_REQUIREMENTS.md`](file:///c:/Users/Dell/Desktop/PawGuard%20Homepage%20Design%20%282%29/PawGuard%20Homepage%20Design/docs/PAWGUARD_PUBLIC_WEB_REQUIREMENTS.md) — Product Requirements & Specification

---

## Important Development Notes

1. **Google OAuth Callback Route:** The single authorized Google OAuth callback route is `/auth/callback`. Do NOT use `/oauth/callback`.
2. **Backend Production Target:** The active backend server is `https://pawguard-backend-mqri.onrender.com/api/v1`.
3. **Session Alert Dismissal:** Emergency alert banner dismissals are stored locally in browser `sessionStorage` per alert ID. Public visitors cannot deactivate backend alerts.

---

## Repository Scope

This repository contains **ONLY** the PawGuard Public Web application frontend.

* **Admin Portal Web App:** Maintained in a separate repository (`Pawguard_admin`).
* **Mobile Applications:** Maintained in dedicated mobile project repositories.
* **Backend System:** Maintained in the PawGuard backend repository (FastAPI / Render).