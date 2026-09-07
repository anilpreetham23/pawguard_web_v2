# Public Web System Architecture & API Integration

## Overview

The PawGuard Public Web application (`pawguard-nextjs`) is the primary desktop and mobile-responsive browser frontend for animal welfare operations, pet adoption, foster management, volunteer engagement, emergency rescue reporting, lost & found pet tracking, public QR safety tag scanning, veterinary appointment booking, smart pet reminders, and donation processing.

Built on Next.js 15 using React 18, TypeScript 5, and Tailwind CSS 4, the application connects to the PawGuard REST API backend (`https://pawguard-backend-dev.onrender.com/api/v1`) using a resilient HTTP client layer powered by Axios and TanStack React Query v5.

---

## Scope

This document covers the frontend software architecture, component organization, state management, authentication workflows, HTTP communication patterns, error resilience, and backend API integration patterns implemented in the Public Web application repository.

### Included Scope
- Next.js 15 App Router architecture & page hierarchy
- State management with TanStack Query v5 & Zustand v5
- Axios HTTP client configuration, token refresh interceptors, and exponential retry backoff
- JWT session management, local storage token persistence, and auth state synchronization
- Public vs. Authenticated page route access controls
- API endpoint integration schemas for pets, adoptions, lost/found, rescue, volunteer, foster, appointments, reminders, and donations
- Client-side error handling, skeleton loading, and user feedback systems
- Security, privacy, and CORS proxy configurations

### Explicitly Excluded Scope
- Backend database implementations (PostgreSQL, SQL migrations, ORM schemas)
- Internal shelter administration tools (Admin Portal dashboards)
- Flutter and React Native mobile applications
- Mobile push notification engines (APNs / FCM)

---

## Features

- **Responsive Single-Page & SSR Navigation**: Seamless page transitions backed by Next.js App Router and dynamic client components.
- **Unified Authentication System**: Dual-mode session handling supporting public browsing, password authentication, OAuth link tokens, MFA verification, and silent JWT token refresh.
- **Resilient API Request Layer**: Automatic retry handling for transient network issues, request timeout protection (15s standard / 60s upload), and standardized error normalization.
- **Real-Time Query Caching**: Client-side query invalidation and optimistic state updates via TanStack Query v5.
- **Privacy-Preserving Public Workflows**: Dedicated public endpoints for QR tag scanning, emergency rescue tracking, and public pet adoption browsing without requiring user login.

---

## Architecture Diagram

```mermaid
graph TD
    User[Browser User / Citizen] -->|HTTPS| NextApp[Next.js 15 App Router Frontend]
    
    subgraph "Public Web Application (src/)"
        NextApp -->|Page Shell & Router| Pages[App Pages / Page Components]
        Pages -->|UI State & Forms| Components[Shadcn / Custom UI Components]
        Pages -->|Query Hooks| QueryHooks[TanStack React Query Hooks]
        QueryHooks -->|Feature Services| APIServices[API Service Layer src/services/api]
        APIServices -->|Axios Instance| HTTPClient[HTTP Client src/lib/api/client.ts]
        HTTPClient -->|Auth Tokens| AuthStore[Auth State & LocalStorage]
    end
    
    HTTPClient -->|REST API / JSON| APIProxy[Next.js Rewrites / Vercel Proxy]
    APIProxy -->|HTTPS / Bearer Auth| BackendAPI[PawGuard Backend REST API /api/v1]
    
    subgraph "External Web Services"
        Pages -->|Static Map Tiles| OpenStreetMap[Tile Server / Maps API]
        Pages -->|Camera Stream| BrowserMedia[Browser HTML5 Camera API]
        APIServices -->|Direct S3 PUT| S3Storage[AWS S3 Presigned Uploads]
    end
```

---

## Frontend Architecture

### Core Tech Stack
- **Framework**: Next.js 15.5.23 (React 18.3.1)
- **Language**: TypeScript 5.8.0
- **Styling**: Tailwind CSS 4.1.12, Radix UI Primitives, Lucide Icons
- **State Management**: TanStack React Query v5.101.4, Zustand v5.0.14
- **HTTP Client**: Axios 1.19.0
- **QR Utilities**: `html5-qrcode` 2.3.8, `jsqr` 1.4.0, `qrcode` 1.5.4

### Directory Structure
```
src/
├── app/                  # Next.js App Router route handlers & pages
│   ├── (public pages)   # /, /about, /adopt, /lost-found, /emergency, /scan
│   ├── account/         # User profile, pet management, notification preferences
│   ├── appointments/    # Vet appointment booking & history
│   ├── reminders/       # Smart pet vaccination & care reminders
│   ├── volunteer/       # Volunteer application & dashboard
│   ├── foster/          # Foster placement tracking & supply requests
│   └── donate/          # Donation checkout & immediate receipt generation
├── components/          # Reusable UI elements, modals, maps, scanners
├── lib/
│   └── api/             # HTTP client, interceptors, error parsers, constants
├── services/
│   └── api/             # Modular API service modules (pets, lost-found, etc.)
└── types/               # TypeScript domain models and DTO interfaces
```

---

## User Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Scanner
    participant Web as Public Web Frontend
    participant Client as Axios HTTP Client
    participant Auth as Auth State (Zustand)
    participant API as Backend REST API

    User->>Web: Navigate to Authenticated Route (e.g., /account)
    Web->>Auth: Check isAuthenticated & token validity
    alt Token Expired
        Auth->>Client: Trigger silent refresh (/auth/refresh)
        Client->>API: POST /api/v1/auth/refresh
        API-->>Client: 200 OK (New Access Token)
        Client-->>Auth: Store new access_token
    end
    Web->>Client: Fetch User Data via Service Layer
    Client->>API: GET /api/v1/companion-pets (Bearer Token)
    API-->>Client: 200 OK { items: [...] }
    Client-->>Web: Render Page with Data
```

---

## Frontend Implementation

### Page & Component Organization
1. **Page Shell (`PageShell.tsx`)**: Wraps every view with header navigation, emergency announcement banner, footer, and responsive containers.
2. **Feature Pages (`src/app/pages/`)**: Contains page-level business logic, search parameters, layout state, and query calls.
3. **Services (`src/services/api/`)**: Single-responsibility modules mapping frontend actions directly to API endpoints.

---

## API Integration

### Centralized Route Constants (`src/lib/api/constants.ts`)
All API endpoints are defined in a central route map relative to the `/api/v1` base URL:

```typescript
export const API_ROUTES = {
  health: "/health",
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    refresh: "/auth/refresh",
    me: "/auth/me",
  },
  companionPets: {
    base: "/companion-pets",
    pet: (id: string) => `/companion-pets/${id}`,
    appointments: "/companion-pets/appointments",
    clinics: "/companion-pets/clinics",
    reminders: (petId: string) => `/companion-pets/${petId}/reminders`,
  },
  lostFound: {
    lost: "/lost-found/lost",
    found: "/lost-found/found",
    sighting: "/lost-found/sighting",
    broadcast: (reportId: string) => `/lost-found/lost/${reportId}/broadcast`,
  },
  safetyTag: {
    scan: "/companion-pets/safety-tag/scan",
    petTag: (petId: string) => `/companion-pets/${petId}/safety-tag`,
  },
};
```

---

## Authentication & Authorization

### Session Persistence & Token Handling
- **Access Token Key**: `pawguard.access_token`
- **Refresh Token Key**: `pawguard.refresh_token`
- **Axios Interceptor**: Automatically attaches `Authorization: Bearer <token>` to outbound requests when a session is active.
- **Silent Token Refresh**: When a request receives a `401 Unauthorized` status, the Axios interceptor attempts a single token refresh call (`POST /auth/refresh`). If successful, the original pending request is retried seamlessly.

---

## Error Handling

### Normalized API Errors (`src/lib/api/errors.ts`)
API errors are parsed into a standardized `ApiError` format:
- `statusCode`: HTTP response status (400, 401, 403, 404, 422, 500)
- `code`: Domain error string (e.g., `NOT_FOUND`, `UNAUTHORIZED`, `VALIDATION_ERROR`)
- `message`: User-friendly diagnostic message
- `details`: Validation errors field map (if 422)

### UI Feedback
- **Skeletons**: Displayed during initial query loading state.
- **Alert Components**: Displayed on fetch failure with interactive **Retry** triggers.
- **Sonner Toast Alerts**: Used for transient mutation feedback (e.g., "Appointment booked successfully").

---

## Security / Privacy

- **XSS Mitigation**: React JSX automatic HTML escaping.
- **Privacy-Safe Scanning**: Public QR tag scans expose only essential pet rescue details (name, photo, medical alerts, emergency contact button); private owner details (home address, personal email) are hidden.
- **S3 Presigned Uploads**: Direct browser-to-S3 uploads avoid routing large image binaries through application servers.

---

## Backend Data Entities

*Backend data entities consumed through API integration:*
- `User`: Authenticated owner / citizen profile
- `CompanionPet`: Owner-registered pet record
- `SafetyTag`: QR token association
- `LostPetReport` / `FoundPetReport`: Lost and found pet listings
- `VetClinic` / `PetAppointment`: Veterinary network records
- `PetReminder`: Care and vaccination reminder record

---

## Related Modules

- [02-qr-safety-tag](../02-qr-safety-tag/README.md)
- [03-repository-and-qa](../03-repository-and-qa/README.md)
- [04-lost-found-alert-system](../04-lost-found-alert-system/README.md)
- [05-vet-directory-and-appointments](../05-vet-directory-and-appointments/README.md)
- [06-pet-reminders](../06-pet-reminders/README.md)
