# PawGuard Public Web Deployment Guide

This guide details the production deployment architecture, environment configuration, build pipeline, and post-deployment verification procedures for the **PawGuard Public Web** application.

---

## Deployment Architecture

PawGuard Public Web uses a decoupled architecture separating the frontend user agent layer from the REST API backend layer.

```
+-------------------------------------------------------+
|                 Public Web Browsers                   |
+-------------------------------------------------------+
                           |
                           v
+-------------------------------------------------------+
|                   Vercel Platform                     |
|           PawGuard Public Web Frontend                |
|             (Next.js 15.5+ App Router)                |
+-------------------------------------------------------+
                           |
                           | /api/v1 Proxy Rewrite
                           v
+-------------------------------------------------------+
|                    Render Platform                    |
|             PawGuard FastAPI REST Backend             |
|       https://pawguard-backend-mqri.onrender.com      |
+-------------------------------------------------------+
```

### Key Architectural Characteristics
* **Frontend Hosting:** Deployed on **Vercel** as a Next.js 15.5+ App Router application with Server-Side Rendering (SSR) and Client-Side Rendering (CSR).
* **Backend Hosting:** Communicates with the PawGuard RESTful API v1 backend hosted independently on **Render**.
* **Browser Proxy Rewrites:** Client-side HTTP requests target relative `/api/v1` paths, which are proxied to the Render backend via Next.js rewrite rules in `next.config.ts`. Authentication uses client-side JWT access (`pawguard.access_token`) and refresh (`pawguard.refresh_token`) tokens stored in `window.localStorage`. Authenticated API requests attach the access token through the `Authorization: Bearer <token>` header. The Next.js same-origin rewrite proxies browser requests through `/api/v1` to the backend, avoiding browser cross-origin API requests.

---

## Production Environment

* **Production Frontend URL:** [https://pawguard-web-v2.vercel.app](https://pawguard-web-v2.vercel.app)
* **Production Backend API Base:** `https://pawguard-backend-mqri.onrender.com/api/v1`
* **Primary Git Repository:** `anilpreetham23/pawguard_web_v2` (Main branch: `main`)

---

## Prerequisites

Before deploying PawGuard Public Web, ensure you have access to:

1. **Vercel Account:** Team or personal account linked to the GitHub repository.
2. **Google Cloud Console:** Access to the Google OAuth 2.0 Credentials manager for configuring Authorized Origins and Redirect URIs.
3. **Razorpay Dashboard:** Merchant account for key retrieval and payment verification testing.
4. **Node.js Environment:** Local Node.js v18.17.0+ and npm v9.0.0+ for local build verification.

---

## Environment Variables

Environment variables are configured in the **Vercel Project Settings** under Environment Variables.

| Variable | Required | Description | Production Guidance |
|---|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Optional | Base REST API v1 endpoint URL. | Defaults to `https://pawguard-backend-mqri.onrender.com/api/v1` if unset. |
| `NEXT_PUBLIC_SITE_URL` | Optional | Canonical public website domain used for SEO and metadata. | Set to `https://pawguard-web-v2.vercel.app`. Falls back to `https://pawguard-public-web.vercel.app` in constants or placeholder `https://pawguard.example.com`. |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Required for OAuth | Google OAuth 2.0 Public Client ID. | Must match the OAuth Client ID configured in Google Cloud Console. |
| `NEXT_PUBLIC_GOOGLE_REDIRECT_URI` | Optional | Explicit override for Google OAuth callback URL. | Defaults dynamically to `${window.location.origin}/auth/callback`. |

*IMPORTANT: All client-exposed environment variables MUST be prefixed with `NEXT_PUBLIC_`. Never place private API secrets, database passwords, or Google Client Secrets in frontend code or repository environment files.*

---

## Vercel Project Configuration

When connecting the repository to Vercel, configure the following project settings:

* **Framework Preset:** `Next.js`
* **Build Command:** `npm run build`
* **Output Directory:** `.next` (Automatically detected by Vercel)
* **Install Command:** `npm install`
* **Node.js Version:** `18.x` or `20.x`
* **Root Directory:** `./`

---

## Backend Connectivity

The frontend establishes backend communication using a dual-mode API strategy:

1. **Client-Side Requests (Browser):** Client components issue HTTP requests to relative `/api/v1/*` endpoints. Vercel routes these requests through the rewrite proxy defined in [`next.config.ts`](file:///c:/Users/Dell/Desktop/PawGuard%20Homepage%20Design%20%282%29/PawGuard%20Homepage%20Design/next.config.ts):
   ```typescript
   async rewrites() {
     return [
       {
         source: "/api/v1/:path*",
         destination: "https://pawguard-backend-mqri.onrender.com/api/v1/:path*",
       },
     ];
   }
   ```
   * **Authentication & Token Storage:** JWT access (`pawguard.access_token`) and refresh (`pawguard.refresh_token`) tokens are stored client-side in `window.localStorage`. Authenticated API requests automatically attach the access token via the `Authorization: Bearer <token>` header through Axios request interceptors. Mutating requests also attach the `X-CSRF-Token` header if `pg_csrf_token` cookie is present.
2. **Server-Side Requests (SSR / SSG):** Server components and pre-rendering routines resolve absolute URLs directly via `NEXT_PUBLIC_API_BASE_URL` or default to `https://pawguard-backend-mqri.onrender.com/api/v1`.

---

## Google OAuth Configuration

PawGuard Public Web implements Google OAuth 2.0 Token / Implicit Flow with CSRF State Validation.

### Authorized Route
The frontend OAuth callback handler is located at:
```
/auth/callback
```

### Google Cloud Console Setup
In the Google Cloud Console under **APIs & Services > Credentials > OAuth 2.0 Client IDs**:

1. **Authorized JavaScript origins:**
   * `https://pawguard-web-v2.vercel.app`
   * `http://localhost:3000` (for local development)
2. **Authorized redirect URIs:**
   * `https://pawguard-web-v2.vercel.app/auth/callback`
   * `http://localhost:3000/auth/callback`

*Note: If the production deployment domain changes, the redirect URI MUST be updated in Google Cloud Console to prevent `redirect_uri_mismatch` errors.*

---

## Razorpay Configuration

Donations on `/donate` use the Razorpay Web Checkout SDK:

1. Public Web requests checkout creation via `POST /api/v1/donations/checkout`.
2. The backend creates the Razorpay order and returns checkout metadata, including `order.checkout_key`.
3. The frontend uses `order.checkout_key` returned dynamically by the backend as the public Razorpay checkout key (no frontend `NEXT_PUBLIC_RAZORPAY_KEY_ID` environment variable is required).
4. The Razorpay SDK modal opens on the client device.
5. Upon payment completion, Public Web sends verification payload to `POST /api/v1/donations/verify`.
6. Verification payload includes:
   * `gateway_payment_id` (`response.razorpay_payment_id`)
   * `gateway_signature` (`response.razorpay_signature`)
   * `gateway_order_id` (`response.razorpay_order_id`)
7. All private Razorpay Key Secrets and Webhook signing secrets are stored strictly on the Render backend server.

---

## Build & Quality Verification

Before deploying updates to production, execute local quality checks:

```bash
# 1. Clear cached build outputs
npm run clean

# 2. Verify TypeScript type checking
npx tsc --noEmit

# 3. Verify ESLint compliance
npm run lint

# 4. Test production compilation locally
npm run build
npm run start
```

---

## Deployment Procedure

### Automatic Git Deployments
Vercel is configured to trigger automatic production builds upon pushing to the `main` branch:

1. Push clean, verified code to `main`:
   ```bash
   git push origin main
   ```
2. Monitor build progress in the Vercel Dashboard.
3. Upon build completion, Vercel updates the production domain `https://pawguard-web-v2.vercel.app`.

### Manual CLI Deployment (Optional)
To deploy directly via Vercel CLI:

```bash
# Install Vercel CLI globally
npm i -g vercel

# Authenticate and link project
vercel login
vercel link

# Deploy preview build
vercel

# Deploy directly to production
vercel --prod
```

---

## Post-Deployment Checklist

After a production deployment completes, verify the following core features:

- [ ] **Home Page:** Loads cleanly at `https://pawguard-web-v2.vercel.app` with navigation header and footer.
- [ ] **Urgent Alert Banner:** Emergency alerts render via `GET /portal/urgent-alerts` and close button dismisses banner locally for session.
- [ ] **Authentication Modal:** Email/password sign-in dialog opens and authenticates properly.
- [ ] **Google OAuth Sign-In:** Google OAuth button redirects to Google, returns to `/auth/callback`, and completes sign-in.
- [ ] **User Account Dashboard:** Protected `/account` routes load user details when authenticated and redirect when unauthenticated.
- [ ] **QR Safety Tag Scanner:** Scanning/visiting `/tag/[tagId]` renders privacy-safe pet profile without exposing owner PII.
- [ ] **Lost & Found Directory:** Active lost pet gallery renders and sighting submission form opens.
- [ ] **Vet Directory:** `/veterinary` lists verified vets and allows appointment booking.
- [ ] **Adoption Catalog:** `/adopt` displays shelter animals and adoption inquiry modal.
- [ ] **Donations Portal:** `/donate` opens Razorpay payment modal.
- [ ] **Contact & Grievance:** `/contact` form submits grievance ticket to `POST /api/v1/grievance`.
- [ ] **Browser Console:** Developer tools show no unhandled CORS, 404, or script errors.

---

## Troubleshooting Guide

### 1. Google OAuth `redirect_uri_mismatch`
* **Symptom:** Google OAuth login fails with Error 400 (`redirect_uri_mismatch`).
* **Cause:** The current deployment domain URI (`https://pawguard-web-v2.vercel.app/auth/callback`) is missing from Google Cloud Console Authorized Redirect URIs.
* **Solution:** Register the exact callback URL in Google Cloud Console Credentials manager.

### 2. API Proxy 404 / 502 Bad Gateway
* **Symptom:** API calls to `/api/v1/*` fail in production browser.
* **Cause:** Misconfigured rewrite rules in `next.config.ts` or Render backend downtime.
* **Solution:** Verify `next.config.ts` contains destination `https://pawguard-backend-mqri.onrender.com/api/v1/:path*` and check Render backend service health.

### 3. Build Failures (`next build` Error)
* **Symptom:** Vercel deployment fails during `npm run build`.
* **Cause:** TypeScript type mismatch or broken imports.
* **Solution:** Run `npx tsc --noEmit` and `npm run dev:clean` locally to isolate build errors.

### 4. Environment Variables Not Updating
* **Symptom:** Changes to `NEXT_PUBLIC_*` variables are not reflected on site.
* **Cause:** Next.js bakes `NEXT_PUBLIC_` environment variables into client bundles at build time.
* **Solution:** Trigger a new Vercel deployment after changing environment variables.

---

## Production Safety & Security

* **No Secret Storage:** Never commit secrets, private tokens, or credentials into the repository.
* **Client Variable Boundaries:** Only expose non-sensitive public identifiers with `NEXT_PUBLIC_` prefix.
* **State CSRF Protection:** Ensure Google OAuth flow maintains state token checks in `/auth/callback`.
* **Cookie Protection:** Maintain relative proxy rewrites to preserve same-origin cookie security flags.

---

## Rollback & Redeployment

If a production issue is detected post-deployment:

1. Open **Vercel Dashboard > Project > Deployments**.
2. Locate the previous stable production deployment.
3. Click the **`...`** menu icon next to the deployment and select **Promote to Production**.
4. Vercel instantly routes domain traffic back to the selected deployment without rebuilding.