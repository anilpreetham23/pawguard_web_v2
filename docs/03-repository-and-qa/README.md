# Repository Architecture & QA Documentation

## Overview

This repository (`pawguard-nextjs`) houses the official Public Web application for the PawGuard animal welfare platform. It serves as the digital front door for citizens, pet owners, fosters, volunteers, and veterinary partners. This document outlines the codebase organization, development branch strategy, quality assurance methodology, and empirical verification status matrix.

---

## Scope

This document covers repository setup, build pipelines, testing suites, static analysis checks, manual QA procedures, and feature verification metrics for the Public Web repository.

### Included Scope
- Directory layout & module separation
- Build & static analysis pipelines (`npx tsc --noEmit`, Next.js build verification)
- Integration & manual QA test cases
- Empirically verified status matrix for all major Public Web modules
- Environment configuration & production build guidelines

---

## Repository Structure

```
.
├── docs/                        # Complete technical documentation suite
│   ├── 01-system-architecture-and-api/
│   ├── 02-qr-safety-tag/
│   ├── 03-repository-and-qa/
│   ├── 04-lost-found-alert-system/
│   ├── 05-vet-directory-and-appointments/
│   └── 06-pet-reminders/
├── public/                      # Static branding assets and favicons
├── src/
│   ├── app/                     # App Router pages and API route handlers
│   ├── components/              # Reusable UI, dialogs, maps, and scanners
│   ├── lib/                     # Axios client, error handling, date utilities
│   ├── services/api/            # Feature-level REST service layer
│   ├── styles/                  # Global CSS, theme tokens, and typography
│   └── types/                   # TypeScript interfaces and API DTO models
├── next.config.ts               # Next.js configuration and proxy rewrites
├── package.json                 # Dependency manifest and scripts
└── tsconfig.json                # Strict TypeScript configuration
```

---

## QA Verification Matrix

The following matrix documents the verification status of all Public Web modules based on automated static analysis (`npx tsc --noEmit`), build verification (`npm run build`), network payload inspection, and manual browser test execution against the live backend API.

| Area | Verification | Status |
|------|--------------|--------|
| **Authentication & Session** | Password sign-in/up, refresh token interceptor, MFA modal, local storage sync | **Verified** |
| **Public QR Safety Tag Scanning** | Camera stream scanner (`html5-qrcode`), token resolution (`POST /safety-tag/scan`), public profile view | **Verified** |
| **Companion Pet Profiles** | Pet list, pet detail, owner updates, presigned S3 photo upload pipeline | **Verified** |
| **Lost & Found Alert System** | Lost/Found reporting, photo upload, broadcast alerts, match claims | **Verified** |
| **GPS Location & Sightings** | `LocationMapPicker` map interaction, pin selection, public sighting submission | **Verified** |
| **Vet Directory & Booking** | Partner clinic discovery, appointment booking, cancellation, owner list sync | **Verified** |
| **Smart Pet Reminders** | Manual care creation, auto clinic reminders, due date tags, soft-delete | **Verified** |
| **Volunteer Application & Dashboard** | Application submission, lifecycle status resolution, dashboard shift calendar | **Verified** |
| **Foster Management** | Placement history, progress updates, supply requests, convert-to-adopt | **Verified** |
| **Emergency Rescue Reporting** | Citizen public reporting, ticket tracking, emergency action panel | **Verified** |
| **Donations & Receipts** | One-time/monthly checkout flow, immediate receipt generator modal | **Verified** |

---

## QA Methodology & Testing Protocols

### 1. Static Type Checking & Code Audits
Every module is strictly typed using TypeScript 5. Compilation integrity is verified prior to deployment:
```bash
npx tsc --noEmit
```

### 2. API Contract Auditing
Request DTOs and response models are derived directly from the backend OpenAPI contract. Service methods normalize backend errors (`401`, `403`, `404`, `422`, `500`) into consistent application errors.

### 3. Responsive & Cross-Browser Verification
All pages are tested across viewport sizes:
- **Mobile**: 375px (iPhone SE) / 390px (iPhone 14)
- **Tablet**: 768px (iPad portrait)
- **Desktop**: 1280px / 1440px / 1536px wide screens

---

## Related Modules

- [01-system-architecture-and-api](../01-system-architecture-and-api/README.md)
- [04-lost-found-alert-system](../04-lost-found-alert-system/README.md)
