"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/api/auth";
import { getErrorMessage } from "@/lib/api";
import { PageShell, Section, Alert, Button, Input } from "@/app/components/pawguard";
import { useAuth } from "@/app/providers/auth-provider";
import { Lock, Key, CheckCircle2 } from "lucide-react";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openAuthDialog } = useAuth();

  const token = searchParams.get("token") || searchParams.get("code") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      setErrorMessage("Missing or invalid password reset token. Please request a new link.");
      setStatus("error");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters long.");
      setStatus("error");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify and try again.");
      setStatus("error");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setStatus("idle");

    try {
      await authService.confirmPasswordReset({
        token,
        new_password: newPassword,
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (status === "success") {
    return (
      <div className="max-w-md w-full mx-auto p-6 lg:p-8 bg-card border border-border rounded-card shadow-sm flex flex-col gap-6 items-center text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xl">
          <CheckCircle2 size={24} />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-foreground font-bold text-2xl font-condensed tracking-tight">Password Reset Complete</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Your password has been successfully updated. You can now sign in to your PawGuard account with your new password.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          className="w-full mt-2"
          onClick={() => {
            router.push("/");
            setTimeout(() => openAuthDialog("sign-in"), 300);
          }}
        >
          Sign In Now
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full mx-auto p-6 lg:p-8 bg-card border border-border rounded-card shadow-sm flex flex-col gap-6">
      <div>
        <h2 className="text-foreground font-bold text-2xl font-condensed tracking-tight">Set New Password</h2>
        <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
          Create a new secure password for your PawGuard account.
        </p>
      </div>

      {!token && (
        <Alert variant="warning" title="Missing Reset Token">
          No password reset token was found in the link. Please click the exact link from your email or request a new password reset.
        </Alert>
      )}

      {status === "error" && errorMessage && (
        <Alert variant="error" title="Reset Failed">
          {errorMessage}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="New Password"
          type="password"
          placeholder="••••••••"
          prefix={<Lock size={16} />}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <Input
          label="Confirm New Password"
          type="password"
          placeholder="••••••••"
          prefix={<Key size={16} />}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSubmitting}
          disabled={isSubmitting || !token}
          className="w-full mt-2"
        >
          Update Password
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <Section bg="default" className="min-h-[60vh] flex items-center justify-center py-12">
          <Suspense fallback={
            <div className="max-w-md w-full mx-auto p-8 text-center text-muted-foreground">
              Loading password reset form...
            </div>
          }>
            <ResetPasswordContent />
          </Suspense>
        </Section>
      </main>
    </PageShell>
  );
}
