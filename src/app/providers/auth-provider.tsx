"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authService, type RegisterRequest } from "@/services/api/auth";
import {
  ApiError,
  auth,
  normalizeError,
  QUERY_KEYS,
  useApiQuery,
  type AuthUser,
  type LoginResponse,
} from "@/lib/api";
import { queryClient } from "@/lib/react-query";

export type AuthDialogMode = "sign-in" | "sign-up";

/** Thrown by `signIn` when the account requires an MFA code step. */
export class MFARequiredError extends ApiError {
  readonly preAuthToken: string;
  constructor(preAuthToken: string) {
    super({
      kind: "http",
      status: 200,
      code: "MFA_REQUIRED",
      message: "Two-step verification required",
    });
    this.name = "MFARequiredError";
    this.preAuthToken = preAuthToken;
  }
}

interface AuthContextValue {
  /** Current user profile, or `null` when signed out. */
  user: AuthUser | null;
  /** Session readiness: `loading` while hydrating, then authenticated/unauthenticated. */
  status: "loading" | "authenticated" | "unauthenticated";
  isAuthenticated: boolean;
  /** Open the sign-in/sign-up dialog. */
  openAuthDialog: (mode?: AuthDialogMode) => void;
  closeAuthDialog: () => void;
  /** True while the auth dialog is open. */
  isDialogOpen: boolean;
  /** Which tab the dialog should focus initially. */
  dialogMode: AuthDialogMode;
  /**
   * Sign in with credentials. Resolves once the session is stored. Throws an
   * `MFARequiredError` when a second MFA step is needed (see `verifyMfa`).
   */
  signIn: (email: string, password: string) => Promise<void>;
  /** Complete an MFA challenge (after `signIn` threw `MFARequiredError`). */
  verifyMfa: (code: string) => Promise<void>;
  /** Create an account and sign the user in automatically. */
  signUp: (input: RegisterRequest) => Promise<void>;
  /** Complete OAuth provider authentication (e.g. Google). */
  signInWithOAuth: (provider: string, providerToken: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function applySession(session: LoginResponse): void {
  auth.setAuthTokens({
    accessToken: session.access_token,
    refreshToken: session.refresh_token ?? null,
    expiresIn: session.expires_in,
  });
}

/**
 * Account isolation guard. All authenticated queries (companion pets,
 * adoption applications, notifications, appointments, dashboard, …) share
 * non-user-scoped react-query keys, so when the signed-in identity changes we
 * must discard every cached query rather than only `auth.me`. Otherwise a
 * newly signed-in account could momentarily see the previous user's data that
 * is still sitting in the cache. `queryClient.clear()` removes all cached
 * queries & mutations; user-scoped queries are re-fetched from the backend
 * (source of truth) on the next render once the active session is known.
 */
function clearUserScopedCache(): void {
  queryClient.clear();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<AuthDialogMode>("sign-in");
  // pre_auth_token captured when sign-in hits an MFA challenge.
  const [preAuthToken, setPreAuthToken] = useState<string | null>(null);

  const isClientReady = typeof window !== "undefined";

  const meQuery = useApiQuery<AuthUser, AuthUser>({
    queryKey: QUERY_KEYS.auth.me,
    queryFn: () => authService.getMe(),
    enabled: isClientReady,
    staleTime: 30 * 1000,
    retry: false,
  });

  const user = meQuery.data ?? null;
  const status: "loading" | "authenticated" | "unauthenticated" = meQuery.isLoading
    ? "loading"
    : user
    ? "authenticated"
    : "unauthenticated";

  const openAuthDialog = useCallback((mode: AuthDialogMode = "sign-in") => {
    setDialogMode(mode);
    setPreAuthToken(null);
    setDialogOpen(true);
  }, []);

  const closeAuthDialog = useCallback(() => setDialogOpen(false), []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const result = await authService.login({
        email,
        password,
        device: { device_type: "web" },
      });
      if ("access_token" in result || ("success" in (result as any) && (result as any).success)) {
        clearUserScopedCache();
        await meQuery.refetch();
      } else {
        const mfa = result as { mfa_required: boolean; pre_auth_token: string };
        setPreAuthToken(mfa.pre_auth_token);
        throw new MFARequiredError(mfa.pre_auth_token);
      }
    },
    [meQuery],
  );

  const verifyMfa = useCallback(
    async (code: string) => {
      if (!preAuthToken) {
        throw new ApiError({
          kind: "http",
          status: null,
          code: "MFA_REQUIRED",
          message: "Start sign-in again to continue with two-step verification.",
        });
      }
      await authService.verifyMfa({
        pre_auth_token: preAuthToken,
        code,
        device: { device_type: "web" },
      });
      setPreAuthToken(null);
      clearUserScopedCache();
      await meQuery.refetch();
    },
    [preAuthToken, meQuery],
  );

  const signUp = useCallback(async (input: RegisterRequest) => {
    await authService.register(input);
    clearUserScopedCache();
    await meQuery.refetch();
  }, [meQuery]);

  const signInWithOAuth = useCallback(
    async (provider: string, providerToken: string) => {
      await authService.oauthLogin({
        provider,
        provider_token: providerToken,
        device: { device_type: "web" },
      });
      clearUserScopedCache();
      await meQuery.refetch();
    },
    [meQuery],
  );

  const signOut = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      clearUserScopedCache();
      queryClient.setQueryData(QUERY_KEYS.auth.me, null);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    await meQuery.refetch();
  }, [meQuery]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isAuthenticated: status === "authenticated",
      openAuthDialog,
      closeAuthDialog,
      isDialogOpen,
      dialogMode,
      signIn,
      verifyMfa,
      signUp,
      signInWithOAuth,
      signOut,
      refreshProfile,
    }),
    [
      user,
      status,
      openAuthDialog,
      closeAuthDialog,
      isDialogOpen,
      dialogMode,
      signIn,
      verifyMfa,
      signUp,
      signInWithOAuth,
      signOut,
      refreshProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}