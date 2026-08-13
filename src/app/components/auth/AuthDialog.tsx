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
        await signUp({
          full_name: fullName.trim(),
          email: email.trim(),
          password,
          phone: phone.trim() === "" ? null : phone.trim(),
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
                    label="Phone (optional)"
                    type="tel"
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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