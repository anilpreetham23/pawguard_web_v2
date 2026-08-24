"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input, Button, Alert } from "../pawguard";
import { useApiErrorMessage, normalizeError } from "@/lib/api";
import { useAuth, MFARequiredError } from "../../providers/auth-provider";
import { cn } from "../ui/utils";

type Step = "credentials" | "mfa";

export default function AuthDialog() {
  const {
    isDialogOpen,
    closeAuthDialog,
    dialogMode,
    signIn,
    verifyMfa,
    signUp,
  } = useAuth();

  const [mode, setMode] = useState<"sign-in" | "sign-up">(dialogMode);
  const [step, setStep] = useState<Step>("credentials");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [isPending, setPending] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [mfaRequired, setMfaRequired] = useState<MFARequiredError | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const errorText = useApiErrorMessage(error);
  const activeMode = step === "mfa" ? "sign-in" : mode;

  const title = useMemo(() => {
    if (step === "mfa") return "Two-step verification";
    return activeMode === "sign-in" ? "Welcome back" : "Create your account";
  }, [step, activeMode]);

  const description = useMemo(() => {
    if (step === "mfa") return "Enter the 6-digit code from your authenticator app.";
    return activeMode === "sign-in"
      ? "Sign in to unlock community features like reporting lost pets and broadcasting alerts."
      : "Join PawGuard to report lost pets, broadcast alerts, and support rescued companions.";
  }, [step, activeMode]);

  function switchMode(next: "sign-in" | "sign-up") {
    if (isPending) return;
    setMode(next);
    setError(null);
    setMfaRequired(null);
    setStep("credentials");
    setCode("");
    setNotice(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isPending) return;
    setError(null);
    setPending(true);

    try {
      if (step === "mfa") {
        await verifyMfa(code.trim());
        closeAuthDialog();
        reset();
        return;
      }
      if (activeMode === "sign-in") {
        try {
          await signIn(email.trim(), password);
        } catch (err) {
          if (err instanceof MFARequiredError) {
            setMfaRequired(err);
            setStep("mfa");
            setPending(false);
            return;
          }
          throw err;
        }
      } else {
        if (!phone.trim()) {
          setError("Phone number is required to create an account.");
          setPending(false);
          return;
        }
        await signUp({
          full_name: fullName.trim(),
          email: email.trim(),
          password,
          phone: phone.trim(),
        });
        // Registration succeeded — switch to sign-in with the email prefilled;
        // login must happen manually (email verification may still be pending).
        setMode("sign-in");
        setPassword("");
        setNotice("Account created. Sign in to continue.");
        setPending(false);
        return;
      }
      closeAuthDialog();
      reset();
    } catch (err) {
      setError(normalizeError(err));
    } finally {
      setPending(false);
    }
  }

  async function handleGoogleSignIn() {
    if (isPending) return;
    setError(null);
    setNotice(null);
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setError("Google Sign-In is configured on the backend API (/auth/oauth/login). Set NEXT_PUBLIC_GOOGLE_CLIENT_ID to enable frontend OAuth redirect.");
      return;
    }
    setPending(true);
    try {
      const redirectUri = `${window.location.origin}/auth/callback`;
      const state = Math.random().toString(36).substring(2) + Date.now().toString(36);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("oauth_state", state);
      }
      const scope = "openid email profile";
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(scope)}&state=${encodeURIComponent(state)}`;
      window.location.href = googleAuthUrl;
    } catch (err) {
      setError(normalizeError(err));
      setPending(false);
    }
  }

  function reset() {
    setMode(dialogMode);
    setStep("credentials");
    setEmail("");
    setPassword("");
    setFullName("");
    setPhone("");
    setCode("");
    setError(null);
    setMfaRequired(null);
    setNotice(null);
    setPending(false);
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => !open && closeAuthDialog()}>
      <DialogContent className="max-w-md gap-0 rounded-card border-border bg-card p-0 sm:max-w-md">
        <div className="px-5 pt-5 sm:px-8 sm:pt-8 sticky top-0 z-10 bg-card rounded-t-card">
          <DialogHeader className="text-left gap-2">
            <DialogTitle className="font-condensed text-2xl tracking-tight">
              {title}
            </DialogTitle>
            <DialogDescription className="leading-relaxed">
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-5 pb-5 sm:px-8 sm:pb-8 flex flex-col gap-4">
          {step === "credentials" && (
            <>
              <button
                type="button"
                disabled={isPending}
                onClick={handleGoogleSignIn}
                className="w-full min-h-[44px] flex items-center justify-center gap-3 bg-background border border-border rounded-input px-4 py-2.5 text-foreground text-sm font-medium hover:bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-fast shadow-sm disabled:opacity-50"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign in with Google</span>
              </button>

              <div className="relative flex items-center justify-center my-0.5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <span className="relative bg-card px-3 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                  or continue with email
                </span>
              </div>

              <div
                className={cn(
                  "grid grid-cols-2 w-full rounded-full border border-border bg-input-background p-1 text-sm font-semibold",
                )}
                role="tablist"
                aria-label="Auth mode"
              >
                {(["sign-in", "sign-up"] as const).map((m) => (
                  <button
                    key={m}
                    role="tab"
                    aria-selected={activeMode === m}
                    onClick={() => switchMode(m)}
                    className={cn(
                      "h-9 rounded-full transition-all duration-gentle ease-gentle uppercase tracking-wider font-condensed text-xs",
                      activeMode === m
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {m === "sign-in" ? "Sign in" : "Create account"}
                  </button>
                ))}
              </div>
            </>
          )}

          {notice && (
            <Alert variant="success" title="Done">
              {notice}
            </Alert>
          )}

          {errorText && (
            <Alert variant="error" title="We couldn't complete that">
              {errorText}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {activeMode === "sign-up" && step === "credentials" && (
              <Input
                id="auth-full-name"
                label="Full name"
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            )}

            {step === "credentials" ? (
              <>
                <Input
                  id="auth-email"
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {activeMode === "sign-up" && (
                  <Input
                    id="auth-phone"
                    label="Phone number *"
                    type="tel"
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                )}
                <Input
                  id="auth-password"
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete={activeMode === "sign-in" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </>
            ) : (
              <>
                {mfaRequired && (
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Your account uses two-step verification. We've issued a
                    challenge for <span className="font-semibold text-foreground">{email.trim()}</span>.
                  </p>
                )}
                <Input
                  id="auth-mfa-code"
                  label="Verification code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="123456"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  required
                />
                <button
                  type="button"
                  onClick={() => {
                    setStep("credentials");
                    setError(null);
                  }}
                  className="text-primary text-xs font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity self-start"
                >
                  Back to password
                </button>
              </>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isPending}
              disabled={isPending}
            >
              {step === "mfa" ? "Verify & sign in" : activeMode === "sign-in" ? "Sign in" : "Create account"}
            </Button>
          </form>

          {step !== "mfa" && (
            <p className="text-muted-foreground text-xs leading-relaxed">
              By continuing you agree to PawGuard&apos;s terms and privacy policy.
              We&apos;ll use your details to help reunite companions with their
              families.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}