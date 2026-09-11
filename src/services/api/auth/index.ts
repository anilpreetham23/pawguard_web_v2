/**
 * Auth feature service.
 *
 * Feature-level API calls for authentication. Request/response shapes are
 * derived from the backend OpenAPI contract:
 *   https://pawguard-backend-mqri.onrender.com/redoc
 *
 * Token storage, refresh, and low-level logout live in `@/lib/api/auth`;
 * this service is the only module that knows how to reach the auth endpoints.
 */

import { API_ROUTES, apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { logout as clearSessionAndNotify } from "@/lib/api/auth";
import type {
  AuthUser,
  EmailVerificationConfirmRequest,
  LoginRequest,
  LoginResponse,
  LoginResult,
  MFAEnrollConfirmRequest,
  MFAEnrollResponse,
  MFAVerifyRequest,
  OAuthAccountInfo,
  OAuthLinkRequest,
  OAuthLoginRequest,
  PasswordResetConfirmRequest,
  PasswordResetRequest,
  SessionInfo,
  UserProfileUpdate,
} from "@/lib/api";

/** `POST /auth/register` request body (per OpenAPI `RegisterRequest`). */
export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  phone?: string | null;
}

/** `POST /auth/password/change` request body. */
export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export const authService = {
  /**
   * `POST /auth/login` — returns a full session, or an MFA challenge when the
   * account has MFA enabled (`{ mfa_required, pre_auth_token }`).
   *
   * `auth: false` prevents the request interceptor from attaching a stale
   * bearer token and prevents the 401 response interceptor from attempting a
   * token refresh — login credentials are the only proof of identity here.
   */
  login(body: LoginRequest): Promise<LoginResult> {
    return apiPost<LoginResult>(API_ROUTES.auth.login, body, { auth: false });
  },

  /**
   * `POST /auth/mfa/verify` — completes an MFA challenge and returns tokens.
   * Also unauthenticated — the pre_auth_token in the body is the credential.
   */
  verifyMfa(body: MFAVerifyRequest): Promise<LoginResponse> {
    return apiPost<LoginResponse>(API_ROUTES.auth.mfaVerify, body, { auth: false });
  },

  /** `POST /auth/register` — creates an account and returns its profile. */
  register(body: RegisterRequest): Promise<AuthUser> {
    return apiPost<AuthUser>(API_ROUTES.auth.register, body, { auth: false });
  },

  /**
   * `POST /auth/logout` — clears the local session and best-effort revokes the
   * server session. Resolves even if the server call fails.
   */
  logout(): Promise<void> {
    return clearSessionAndNotify({ notifyServer: true });
  },

  /** `GET /auth/me` — fetch the current user profile. */
  getMe(): Promise<AuthUser> {
    return apiGet<AuthUser>(API_ROUTES.auth.me);
  },

  /** `PUT /auth/me` — update the current user's profile fields. */
  updateProfile(body: UserProfileUpdate): Promise<AuthUser> {
    return apiPut<AuthUser>(API_ROUTES.auth.me, body);
  },

  /**
   * `DELETE /auth/me` — soft-delete the authenticated user's account,
   * revoke all active sessions, and clear local session state.
   */
  async deleteAccount(): Promise<null> {
    const res = await apiDelete<null>(API_ROUTES.auth.me);
    await clearSessionAndNotify({ notifyServer: false });
    return res;
  },

  /** `GET /auth/sessions` — list the current user's active sessions. */
  getSessions(): Promise<SessionInfo[]> {
    return apiGet<SessionInfo[]>(API_ROUTES.auth.sessions);
  },

  /** `DELETE /auth/sessions/{id}` — revoke a specific session. */
  revokeSession(sessionId: string): Promise<null> {
    return apiDelete<null>(API_ROUTES.auth.session(sessionId));
  },

  /** `POST /auth/password/change` — update the current password. */
  changePassword(body: ChangePasswordRequest): Promise<null> {
    return apiPost<null>(API_ROUTES.auth.changePassword, body);
  },

  /**
   * `POST /auth/logout-all` — revoke every session for the current user and
   * clear the local session. Resolves even if the server call fails.
   */
  async logoutAll(): Promise<void> {
    try {
      await apiPost<null>(API_ROUTES.auth.logoutAll);
    } finally {
      await clearSessionAndNotify({ notifyServer: false });
    }
  },

  /**
   * `POST /auth/password/reset/request` — send a password-reset email for the
   * given address (public, rate-limited).
   */
  requestPasswordReset(body: PasswordResetRequest): Promise<null> {
    return apiPost<null>(API_ROUTES.auth.passwordResetRequest, body);
  },

  /**
   * `POST /auth/password/reset/confirm` — redeem a reset token with a new
   * password (public, rate-limited).
   */
  confirmPasswordReset(body: PasswordResetConfirmRequest): Promise<null> {
    return apiPost<null>(API_ROUTES.auth.passwordResetConfirm, body);
  },

  /** `POST /auth/email/verify/request` — resend the verification email. */
  requestEmailVerification(): Promise<null> {
    return apiPost<null>(API_ROUTES.auth.emailVerifyRequest);
  },

  /**
   * `POST /auth/email/verify/confirm` — confirm the email with a token from
   * the verification link (public).
   */
  confirmEmailVerification(body: EmailVerificationConfirmRequest): Promise<null> {
    return apiPost<null>(API_ROUTES.auth.emailVerifyConfirm, body);
  },

  /** `POST /auth/mfa/enroll` — start MFA enrollment (returns a TOTP secret). */
  enrollMfa(): Promise<MFAEnrollResponse> {
    return apiPost<MFAEnrollResponse>(API_ROUTES.auth.mfaEnroll);
  },

  /** `POST /auth/mfa/enroll/confirm` — activate MFA with a 6-digit code. */
  confirmMfaEnrollment(body: MFAEnrollConfirmRequest): Promise<null> {
    return apiPost<null>(API_ROUTES.auth.mfaEnrollConfirm, body);
  },

  /** `POST /auth/mfa/disable` — turn off MFA for the current account. */
  disableMfa(): Promise<null> {
    return apiPost<null>(API_ROUTES.auth.mfaDisable);
  },

  /** `POST /auth/oauth/login` — sign in (or create an account) via a provider token. */
  oauthLogin(body: OAuthLoginRequest): Promise<LoginResponse> {
    return apiPost<LoginResponse>(API_ROUTES.auth.oauthLogin, body);
  },

  /** `GET /auth/oauth/accounts` — the current user's linked OAuth identities. */
  getOauthAccounts(): Promise<OAuthAccountInfo[]> {
    return apiGet<OAuthAccountInfo[]>(API_ROUTES.auth.oauthAccounts);
  },

  /** `POST /auth/oauth/link` — link a provider account to the current user. */
  linkOauthAccount(body: OAuthLinkRequest): Promise<OAuthAccountInfo> {
    return apiPost<OAuthAccountInfo>(API_ROUTES.auth.oauthLink, body);
  },

  /** `DELETE /auth/oauth/accounts/{id}` — unlink a provider account. */
  unlinkOauthAccount(accountId: string): Promise<null> {
    return apiDelete<null>(API_ROUTES.auth.oauthAccount(accountId));
  },
};

export type { LoginRequest };
