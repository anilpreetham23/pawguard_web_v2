"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  QrCode,
  ScanLine,
  KeyRound,
  PawPrint,
  AlertTriangle,
  ShieldCheck,
  RotateCcw,
  Phone,
} from "lucide-react";
import { PageShell, Card, Reveal, Alert, Button, Input, Badge, Skeleton } from "../components/pawguard";
import SectionHeading from "../components/SectionHeading";
import QrScanner from "../components/scan/QrScanner";
import { useApiMutation, useApiErrorMessage, isRetryableError } from "@/lib/api";
import { safetyTagService } from "@/services/api/safety-tag";
import type { SafetyTagScanResponse } from "@/lib/api";

type ScanState =
  | { status: "idle" }
  | { status: "loading"; token: string }
  | { status: "success"; pet: SafetyTagScanResponse }
  | { status: "error"; token: string };

const SPECIES_LABEL: Record<string, string> = {
  dog: "Dog",
  cat: "Cat",
  bird: "Bird",
  rabbit: "Rabbit",
  other: "Other",
};

export default function ScanPage() {
  const [state, setState] = useState<ScanState>({ status: "idle" });
  const [manualToken, setManualToken] = useState("");
  const [scanNotice, setScanNotice] = useState<string | null>(null);

  const scan = useApiMutation<SafetyTagScanResponse, string>({
    mutationFn: (token: string) => safetyTagService.scanToken(token),
    onSuccess: (pet) => setState({ status: "success", pet }),
    onError: (_err, token) => setState({ status: "error", token }),
  });

  const errorText = useApiErrorMessage(scan.error);
  const isUnauthorized = scan.error?.isUnauthorized === true;

  const submitToken = useCallback(
    (token: string) => {
      const clean = token.trim();
      if (clean.length === 0) {
        setScanNotice("Please enter the safety-tag token from the back of the tag.");
        return;
      }
      setScanNotice(null);
      setState({ status: "loading", token: clean });
      scan.mutate(clean);
    },
    [scan]
  );

  const handleDetected = useCallback((token: string) => {
    submitToken(token);
  }, [submitToken]);

  const reset = useCallback(() => {
    setState({ status: "idle" });
    setScanNotice(null);
    scan.reset();
  }, [scan]);

  const isError = state.status === "error";

  const emergencyNotes = state.status === "success" ? state.pet.emergency_notes : null;

  const resultView = useMemo(() => {
    if (state.status !== "success") return null;
    const pet = state.pet;
    const speciesLabel = SPECIES_LABEL[pet.species.toLowerCase()] ?? pet.species;

    return (
      <Reveal>
        <Card className="overflow-hidden">
          <div className="aspect-[16/9] w-full bg-gradient-to-br from-primary/10 via-background to-amber-100/40 relative flex items-center justify-center">
            {pet.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={pet.photo_url}
                alt={`${pet.name}, a ${speciesLabel.toLowerCase()}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <PawPrint size={44} strokeWidth={1.2} />
                <span className="text-xs font-semibold tracking-widest uppercase font-condensed text-muted-foreground/80">
                  Photo not available
                </span>
              </div>
            )}
          </div>

          <div className="p-6 lg:p-8 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="success">Safety tag verified</Badge>
                {speciesLabel && <Badge variant="neutral">{speciesLabel}</Badge>}
              </div>
              <h2 className="text-foreground font-serif font-bold text-2xl lg:text-3xl leading-tight">{pet.name}</h2>
              <p className="text-muted-foreground text-sm">
                {[pet.breed, pet.color].filter(Boolean).join(" · ") || "Details on file"}
              </p>
            </div>

            {emergencyNotes && (
              <Alert variant="error" title="Emergency notes">
                {emergencyNotes}
              </Alert>
            )}

            {pet.message && !emergencyNotes && (
              <Alert variant="info">{pet.message}</Alert>
            )}

            <div className="flex flex-col gap-3 pt-1">
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <ShieldCheck size={16} className="shrink-0 text-primary" />
                This pet carries a verified PawGuard safety tag.
              </div>
              <Link
                href="tel:+18005557372"
                className="inline-flex items-center gap-2 text-destructive font-semibold text-sm hover:opacity-80 transition-opacity"
              >
                <Phone size={15} />
                {emergencyNotes ? "Need urgent help? Call +91 98765 43210" : "Call PawGuard for help"}
              </Link>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="primary" size="md" onClick={reset}>
                <RotateCcw size={15} />
                Scan another tag
              </Button>
              <Button variant="outline" size="md" asLink={{ href: "/emergency" }}>
                Emergency help
              </Button>
            </div>
          </div>
        </Card>
      </Reveal>
    );
  }, [state, reset, emergencyNotes]);

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pt-[calc(var(--header-height)+1.5rem)]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-primary transition-colors duration-fast group"
          >
            <ArrowLeft size={15} className="transition-transform duration-fast group-hover:-translate-x-0.5" />
            Back to home
          </Link>
        </div>

        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-8 lg:py-12">
          <Reveal>
            <div className="max-w-[760px]">
              <SectionHeading eyebrow="Safety Tags">
                Scan a safety tag
              </SectionHeading>
              <p className="text-muted-foreground text-base leading-relaxed mt-3 max-w-[560px]">
                Found a pet with a PawGuard safety tag? Scan the QR code or enter
                the token to see public safety information — no sign-in required.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--space-12)] lg:gap-[var(--space-16)] mt-10">
            {state.status !== "success" ? (
              <Reveal>
                <Card className="p-6 lg:p-8 flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-primary">
                      <QrCode size={18} />
                      <span className="text-xs font-semibold tracking-widest uppercase font-condensed">Scan a QR code</span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Point your camera at the QR code on the safety tag. Camera access
                      is requested only when you start scanning.
                    </p>
                  </div>

                  <QrScanner onDetected={handleDetected} />
                </Card>
              </Reveal>
            ) : (
              <Reveal>
                <div className="flex flex-col gap-3">
                  <Alert variant="success" title="Tag verified">
                    This safety tag is registered and active with PawGuard.
                  </Alert>
                  <Button type="button" variant="outline" size="md" onClick={reset} className="self-start">
                    <ScanLine size={15} />
                    Scan another tag
                  </Button>
                </div>
              </Reveal>
            )}

            {/* Manual token entry */}
            {state.status !== "success" && (
              <Reveal>
                <Card className="p-6 lg:p-8 flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-primary">
                      <KeyRound size={18} />
                      <span className="text-xs font-semibold tracking-widest uppercase font-condensed">Or enter the token manually</span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      If your camera can&apos;t scan the code, type the safety-tag token
                      shown under the QR code.
                    </p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      submitToken(manualToken);
                    }}
                    className="flex flex-col gap-4"
                  >
                    <Input
                      id="safety-tag-token"
                      label="Safety tag token"
                      placeholder="Paste or type the token…"
                      value={manualToken}
                      onChange={(e) => setManualToken(e.target.value)}
                      autoComplete="off"
                      spellCheck={false}
                      className="font-mono"
                    />

                    {scanNotice && state.status !== "loading" && <Alert variant="info">{scanNotice}</Alert>}

                    {state.status === "loading" && (
                      <div className="flex flex-col gap-3">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-full max-w-[480px]" />
                        <div className="flex items-center gap-2 text-muted-foreground text-xs">
                          <span className="h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                          Checking safety tag…
                        </div>
                      </div>
                    )}

                    {isError && (
                      <Alert variant="error" title={isUnauthorized ? "Something went wrong" : "We couldn't verify this tag"}>
                        {isUnauthorized
                          ? "We couldn't verify this safety tag right now. Please try again shortly."
                          : errorText}
                      </Alert>
                    )}

                    <div className="flex flex-col gap-3">
                      <Button type="submit" variant="primary" size="md" isLoading={state.status === "loading"} disabled={state.status === "loading"}>
                        <ScanLine size={16} />
                        Look up safety tag
                      </Button>
                      {isError && isRetryableError(scan.error) && (
                        <button
                          onClick={() => submitToken(state.token)}
                          className="self-start text-xs font-semibold text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
                        >
                          Retry
                        </button>
                      )}
                    </div>
                  </form>
                </Card>
              </Reveal>
            )}
          </div>

          {state.status === "success" && (
            <div className="mt-10">
              {resultView}
            </div>
          )}
        </div>
      </main>
    </PageShell>
  );
}