"use client";

import { useRef, useState } from "react";
import { Link2, MapPin, CalendarDays, Gauge, CheckCircle2, XCircle, Clock, Send } from "lucide-react";
import { useReportMatches } from "../hooks/useLostFound";
import { useAuth } from "../providers/auth-provider";
import type { LostFoundKind } from "@/types";
import { cn } from "./ui/utils";
import { Alert } from "./pawguard";
import { Button } from "./pawguard";

const STATUS_BADGE: Record<string, { label: string; cls: string; Icon: typeof Clock }> = {
  pending: { label: "Pending", cls: "bg-amber-500/10 text-amber-600 border-amber-500/25", Icon: Clock },
  confirmed: { label: "Confirmed", cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/25", Icon: CheckCircle2 },
  rejected: { label: "Rejected", cls: "bg-destructive/10 text-destructive border-destructive/25", Icon: XCircle },
};

function confidenceLabel(score: number): { text: string; cls: string } {
  const pct = Math.round(score * 100);
  if (pct >= 80) return { text: `${pct}% — very likely`, cls: "bg-emerald-500/10 text-emerald-600" };
  if (pct >= 55) return { text: `${pct}% — possible match`, cls: "bg-sky-500/10 text-sky-600" };
  return { text: `${pct}% — low confidence`, cls: "bg-muted text-muted-foreground" };
}

function ConfidenceMeter({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(score * 100)));
  const { text, cls } = confidenceLabel(score);
  return (
    <div className="flex items-center gap-3 w-full">
      <Gauge size={15} className="shrink-0 text-primary" aria-hidden="true" />
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full bg-primary transition-all duration-standard" style={{ width: `${pct}%` }} />
      </div>
      <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold whitespace-nowrap", cls)}>{text}</span>
    </div>
  );
}

function MatchTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
      {children}
    </span>
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

export function MatchesPanel({ reportId, kind, petName }: { reportId: string; kind: LostFoundKind; petName: string }) {
  const { isAuthenticated, openAuthDialog } = useAuth();
  const { matches, total, isLoading, isError, error, refetch, claim, claimPending } =
    useReportMatches(reportId, kind, true);

  // claim form state per open match
  const [claimFor, setClaimFor] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [microchipUrl, setMicrochipUrl] = useState("");
  const [vetBillUrl, setVetBillUrl] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [claimError, setClaimError] = useState<string | null>(null);
  const [claimSuccess, setClaimSuccess] = useState<string | null>(null);
  const claimCountRef = useRef(0);

  const openClaim = (matchId: string) => {
    setClaimFor(matchId);
    setClaimError(null);
    setClaimSuccess(null);
  };

  const submitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimFor) return;
    setClaimError(null);
    setClaimSuccess(null);
    claimCountRef.current += 1;
    try {
      await claim(claimFor, {
        verification_notes: notes.trim() || undefined,
        microchip_doc_url: microchipUrl.trim() || undefined,
        vet_bill_url: vetBillUrl.trim() || undefined,
        photo_proof_url: photoUrl.trim() || undefined,
      });
      setClaimSuccess("Ownership claim submitted for review. PawGuard staff will verify your documents.");
      setClaimFor(null);
      setNotes("");
      setMicrochipUrl("");
      setVetBillUrl("");
      setPhotoUrl("");
    } catch (err) {
      setClaimError(err instanceof Error ? err.message : "Couldn't submit the claim. Please try again.");
    } finally {
      claimCountRef.current = claimCountRef.current - 1;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-section-md">
        <div className="flex flex-col gap-3">
          {[0, 1].map((i) => <div key={i} className="h-32 rounded-card bg-muted animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-section-md">
        <Alert variant="error" title="Couldn't load potential matches">
          {error instanceof Error ? error.message : "Something went wrong while checking for matches."}{" "}
          <button onClick={() => refetch()} className="font-semibold text-destructive underline underline-offset-2 hover:opacity-80 transition-opacity">
            Retry
          </button>
        </Alert>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-section-md">
        <div className="bg-card border border-border rounded-card p-8 lg:p-10 flex flex-col items-center text-center gap-3">
          <span aria-hidden="true" className="text-4xl leading-none">{kind === "lost" ? "🔍" : "🐾"}</span>
          <h2 className="text-foreground font-bold text-lg">
            {kind === "lost" ? "No potential matches yet" : "No matching reports yet"}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-[520px]">
            {kind === "lost"
              ? `If ${petName || "the pet"} is found nearby and reported, PawGuard's matching engine will surface the closest report here automatically.`
              : "If a nearby family reports a lost pet that matches this found animal, PawGuard will surface it here automatically."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-section-md">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-foreground font-bold text-lg">Potential matches</h2>
          <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-bold">
            {total} match{total === 1 ? "" : "es"}
          </span>
        </div>

        {matches.map((match) => {
          const badge = STATUS_BADGE[match.status] ?? STATUS_BADGE.pending;
          const badgeIcon = badge.Icon;
          const peer =
            kind === "lost"
              ? match.found_report
              : match.lost_report;
          const peerLabel = kind === "lost" ? "Found" : "Lost";
          const peerName =
            peer && "pet_name" in peer
              ? peer.pet_name
              : peer && "breed_observed" in peer
                ? `Found ${peer.breed_observed || "animal"}`
                : "Matching report";

          return (
            <div key={match.id} className="bg-card border border-border rounded-card p-6">
              <div className="flex flex-col gap-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3 min-w-0">
                    <Link2 size={18} className="shrink-0 text-primary" aria-hidden="true" />
                    <p className="text-foreground font-bold">
                      {peerName}
                      <span className="text-muted-foreground font-medium"> · {peerLabel} nearby</span>
                    </p>
                  </div>
                  <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold tracking-wider uppercase", badge.cls)}>
                    {(() => {
                      const Icon = badge.Icon;
                      return <Icon size={12} aria-hidden="true" />;
                    })()}
                    {badge.label}
                  </span>
                </div>

                <ConfidenceMeter score={match.confidence_score} />

                {match.match_reasons.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {match.match_reasons.map((reason) => (
                      <MatchTag key={reason}>{reason}</MatchTag>
                    ))}
                  </div>
                )}

                {(match.distance_km !== null || match.temporal_gap_days !== null) && (
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {match.distance_km !== null && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={14} className="text-primary" aria-hidden="true" />
                        {match.distance_km.toFixed(1)} km apart
                      </span>
                    )}
                    {match.temporal_gap_days !== null && (
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={14} className="text-primary" aria-hidden="true" />
                        {Math.round(match.temporal_gap_days)} days between reports
                      </span>
                    )}
                  </div>
                )}

                {peer && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {"pet_name" in peer ? `${peer.pet_name}, ` : ""}
                    {"color_observed" in peer ? `${peer.color_observed || ""}, ` : `${peer.color || ""}, `}
                    last seen near {peer.location_address || "unknown location"}
                    {"lost_at" in peer ? ` on ${formatDate(peer.lost_at)}` : ` on ${formatDate(peer.found_at)}`}.
                  </p>
                )}

                {match.status === "pending" && (
                  <div className="border-t border-border pt-4">
                    {!isAuthenticated ? (
                      <Alert variant="info" title="Ownership claim requires sign-in">
                        If this is your {kind === "lost" ? "pet" : "report"}, sign in to submit proof of ownership for review.{" "}
                        <button onClick={() => openAuthDialog("sign-in")} className="font-semibold text-primary underline underline-offset-2 hover:opacity-80 transition-opacity">
                          Sign in
                        </button>
                      </Alert>
                    ) : claimFor === match.id ? (
                      <form onSubmit={submitClaim} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                          <label htmlFor={`notes-${match.id}`} className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Verification notes
                          </label>
                          <textarea
                            id={`notes-${match.id}`}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            placeholder={`e.g. ${petName || "the pet"} was chipped at PawHealth Clinic in 2023, spayed/neutered, answers to a name.`}
                            className="bg-background border border-border rounded-btn px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-standard w-full"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input
                            type="url"
                            value={microchipUrl}
                            onChange={(e) => setMicrochipUrl(e.target.value)}
                            placeholder="Microchip doc URL"
                            aria-label="Microchip document URL"
                            className="bg-background border border-border rounded-btn px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-standard"
                          />
                          <input
                            type="url"
                            value={vetBillUrl}
                            onChange={(e) => setVetBillUrl(e.target.value)}
                            placeholder="Vet bill URL"
                            aria-label="Vet bill URL"
                            className="bg-background border border-border rounded-btn px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-standard"
                          />
                          <input
                            type="url"
                            value={photoUrl}
                            onChange={(e) => setPhotoUrl(e.target.value)}
                            placeholder="Photo proof URL"
                            aria-label="Photo proof URL"
                            className="bg-background border border-border rounded-btn px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-standard"
                          />
                        </div>
                        {claimError && <Alert variant="error">{claimError}</Alert>}
                        <div className="flex items-center justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => setClaimFor(null)}
                            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors duration-fast"
                          >
                            Cancel
                          </button>
                          <Button type="submit" size="sm" isLoading={claimPending} className="shrink-0">
                            {claimPending ? "Submitting..." : "Submit claim"}
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openClaim(match.id)}
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-xs font-semibold tracking-wider uppercase font-condensed px-4 py-2.5 rounded-btn hover:bg-primary-hover transition-all duration-fast"
                      >
                        <Send size={14} aria-hidden="true" />
                        I own this pet — claim it
                      </button>
                    )}
                  </div>
                )}

                {match.status === "confirmed" && (
                  <Alert variant="success" title="Match confirmed">
                    This {peerLabel.toLocaleLowerCase()} report has been verified. The family has been put in touch.
                  </Alert>
                )}

                {claimSuccess && (
                  <Alert variant="success">{claimSuccess}</Alert>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}