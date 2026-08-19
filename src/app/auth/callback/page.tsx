"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/api/auth";
import { getErrorMessage, auth } from "@/lib/api";
import { PageShell, Section, Alert, Button } from "@/app/components/pawguard";
import { useAuth } from "@/app/providers/auth-provider";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { signInWithOAuth } = useAuth();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    async function handleCallback() {
      try {
        const hash = window.location.hash.substring(1);
        const search = window.location.search.substring(1);
        const hashParams = new URLSearchParams(hash);
        const searchParams = new URLSearchParams(search);

        const returnedState = hashParams.get("state") || searchParams.get("state");
        const savedState = sessionStorage.getItem("oauth_state");
        if (savedState) {
          sessionStorage.removeItem("oauth_state");
          if (returnedState !== savedState) {
            setStatus("error");
            setErrorMessage("OAuth state mismatch — security check failed.");
            return;
          }
        }

        const error = searchParams.get("error") || hashParams.get("error");
        if (error) {
          setStatus("error");
          setErrorMessage(
            error === "access_denied"
              ? "Google Sign-In was cancelled."
              : `Google OAuth error: ${error}`
          );
          return;
        }

        const providerToken =
          hashParams.get("access_token") ||
          hashParams.get("id_token") ||
          searchParams.get("code") ||
          searchParams.get("token");

        if (!providerToken) {
          setStatus("error");
          setErrorMessage("No authentication token was returned from Google.");
          return;
        }

        await signInWithOAuth("google", providerToken);

        setStatus("success");
        setTimeout(() => {
          router.push("/account");
        }, 300);
      } catch (err) {
        setStatus("error");
        setErrorMessage(getErrorMessage(err));
      }
    }

    handleCallback();
  }, [signInWithOAuth, router]);

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <Section bg="default" className="min-h-[60vh] flex items-center justify-center">
          <div className="max-w-md w-full mx-auto p-6 bg-card border border-border rounded-card shadow-sm flex flex-col gap-6 items-center text-center">
            {status === "processing" && (
              <>
                <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <div className="flex flex-col gap-1">
                  <h2 className="text-foreground font-bold text-xl">Completing Sign-In</h2>
                  <p className="text-muted-foreground text-sm">Exchanging credentials with PawGuard backend...</p>
                </div>
              </>
            )}

            {status === "success" && (
              <>
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xl">
                  ✓
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-foreground font-bold text-xl">Sign-In Successful</h2>
                  <p className="text-muted-foreground text-sm">Redirecting to your account dashboard...</p>
                </div>
              </>
            )}

            {status === "error" && (
              <>
                <Alert variant="error" title="Sign-In Failed">
                  {errorMessage}
                </Alert>
                <div className="flex gap-3 w-full mt-2">
                  <Button variant="outline" size="md" className="flex-1" onClick={() => router.push("/")}>
                    Home
                  </Button>
                  <Button variant="primary" size="md" className="flex-1" onClick={() => router.push("/account")}>
                    Try Again
                  </Button>
                </div>
              </>
            )}
          </div>
        </Section>
      </main>
    </PageShell>
  );
}
