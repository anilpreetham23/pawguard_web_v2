"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Navigation,
  PawPrint,
  Sparkles,
  Phone,
  Mail,
  User,
  Mic,
} from "lucide-react";
import { PageShell, Card, Reveal, StaggerGrid, StaggerItem, EmptyState, Skeleton, Alert, Button } from "../components/pawguard";
import SectionHeading from "../components/SectionHeading";
import LostFoundCard from "../components/LostFoundCard";
import { MatchesPanel } from "../components/MatchesPanel";
import { useLostFoundReport, useRelatedLostFoundCases } from "../hooks/useLostFound";
import { useApiMutation, useApiErrorMessage, getErrorMessage, isApiError } from "@/lib/api";
import { lostFoundService } from "@/services/api/lost-found";
import { directionsUrl } from "@/services/api/contact/mapper";
import { InteractiveImage } from "../../motion/components/InteractiveImage";
import { cn } from "../components/ui/utils";
import { useAuth } from "../providers/auth-provider";
import type { LostFoundCase } from "@/types";

const TONE_GRADIENTS: Record<string, string> = {
  amber: "from-amber-200/90 via-orange-100 to-amber-100",
  sky: "from-sky-200/90 via-cyan-100 to-sky-100",
  rose: "from-rose-200/90 via-pink-100 to-rose-100",
  teal: "from-teal-200/90 via-emerald-100 to-teal-100",
  violet: "from-violet-200/90 via-purple-100 to-violet-100",
  indigo: "from-indigo-200/90 via-blue-100 to-indigo-100",
};

const STATUS_BADGE: Record<LostFoundCase["status"], { label: string; cls: string }> = {
  active: {
    label: "Active",
    cls: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  },
  resolved: {
    label: "Resolved",
    cls: "bg-muted text-muted-foreground border-border",
  },
  expired: {
    label: "Expired",
    cls: "bg-muted text-muted-foreground border-border",
  },
};

const SPECIES_LABEL: Record<string, string> = {
  dog: "Dog",
  cat: "Cat",
  bird: "Bird",
  rabbit: "Rabbit",
  other: "Other",
};

function PhotoPanel({ caseItem }: { caseItem: LostFoundCase }) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const showPhoto = Boolean(caseItem.photoUrl) && !photoFailed;
  return (
    <div
      className={cn(
        "aspect-[4/5] rounded-img shadow-lg overflow-hidden relative",
        showPhoto ? "bg-card" : "bg-gradient-to-br",
        !showPhoto && (TONE_GRADIENTS[caseItem.tone] ?? TONE_GRADIENTS.amber),
      )}
    >
      {showPhoto ? (
        <InteractiveImage
          src={caseItem.photoUrl!}
          alt={`${caseItem.petName} — ${caseItem.breed}`}
          variant="hero"
          className="absolute inset-0 w-full h-full"
          noParallax
          noFloat
          onError={() => setPhotoFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[9rem] leading-none drop-shadow-sm select-none">{caseItem.emoji}</span>
        </div>
      )}
      {caseItem.kind === "lost" && (
        <div className="absolute bottom-4 left-4">
          <span className="bg-destructive text-white text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-sm shadow-sm">
            Lost Pet
          </span>
        </div>
      )}
    </div>
  );
}

function Fact({ icon: Icon, label, value }: { icon: typeof PawPrint; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon size={16} className="text-primary" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-muted-foreground text-2xs font-semibold tracking-wider uppercase font-condensed">{label}</span>
        <span className="text-foreground font-semibold text-sm truncate">{value}</span>
      </div>
    </div>
  );
}

function BroadcastPanel({ caseItem }: { caseItem: LostFoundCase }) {
  const broadcast = useApiMutation({
    mutationFn: () => lostFoundService.broadcastLostPetAlert(caseItem.id),
  });
  const { user, isAuthenticated, openAuthDialog } = useAuth();
  const isRateLimited = broadcast.error?.status === 429;
  const hasBroadcastedRef = useRef(false);

  useEffect(() => {
    if (!broadcast.isPending) {
      hasBroadcastedRef.current = false;
    }
  }, [broadcast.isPending]);

  useEffect(() => {
    if (broadcast.isError && broadcast.error?.isUnauthorized && isAuthenticated) {
      broadcast.mutate();
    }
  }, [isAuthenticated, broadcast.isError]);

  const errorText = useApiErrorMessage(
    isRateLimited ? null : broadcast.error,
  );

  // Broadcast is strictly an OWNER-ONLY action on LOST pet reports.
  const isOwner = Boolean(
    isAuthenticated &&
    user?.id &&
    caseItem.userId &&
    user.id === caseItem.userId
  );

  if (caseItem.kind !== "lost" || !isOwner) return null;

  const isDisabled =
    broadcast.isPending || broadcast.isSuccess || isRateLimited;

  // Extract remaining cooldown duration dynamically from backend HTTP 429 response when available
  const backendCooldownSeconds = (() => {
    if (!isRateLimited || !broadcast.error) return null;
    const detailObj = broadcast.error.detail;
    if (typeof detailObj === "object" && detailObj !== null) {
      const sec = (detailObj as Record<string, any>).retry_after || (detailObj as Record<string, any>).cooldown_seconds;
      if (typeof sec === "number") return sec;
    }
    const msg = typeof broadcast.error.message === "string" ? broadcast.error.message : "";
    const match = msg.match(/(\d+)\s*(seconds?|minutes?|mins?|secs?)/i);
    if (match) {
      const num = parseInt(match[1], 10);
      const unit = match[2].toLowerCase();
      if (unit.startsWith("min")) return num * 60;
      return num;
    }
    return null;
  })();

  const cooldownMessage = backendCooldownSeconds
    ? `You recently broadcast this missing-pet alert. Please wait ${Math.ceil(backendCooldownSeconds / 60)} minute${Math.ceil(backendCooldownSeconds / 60) === 1 ? "" : "s"} before sending another alert.`
    : "You recently broadcast this missing-pet alert. Please wait before sending another alert.";

  const handleBroadcast = () => {
    if (hasBroadcastedRef.current) return;
    if (broadcast.isPending || broadcast.isSuccess || isRateLimited) return;
    hasBroadcastedRef.current = true;
    broadcast.mutate();
  };

  return (
    <Reveal>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card border border-border rounded-card p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-8">
          <div className="flex-1 flex flex-col gap-1.5">
            <h2 className="text-foreground font-bold text-lg">Broadcast a missing-dog alert</h2>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-[520px]">
              Push this lost report to nearby PawGuard members for faster sightings. Sign-in is required.
            </p>
          </div>
          <Button
            variant="destructive"
            size="md"
            isLoading={broadcast.isPending}
            context="broadcast"
            disabled={isDisabled}
            onClick={handleBroadcast}
            className="shrink-0"
          >
            {broadcast.isSuccess ? "Alert Broadcast" : "Broadcast Alert"}
          </Button>
        </div>
        {broadcast.isSuccess && (
          <Alert variant="success" title="Alert sent">
            Neighbours in the report area have been notified about {caseItem.petName}.
          </Alert>
        )}
        {isRateLimited && (
          <Alert variant="info" title="Alert already sent">
            {cooldownMessage}
          </Alert>
        )}
        {broadcast.isError && !isRateLimited && (
          <Alert variant="error" title={broadcast.error?.isUnauthorized ? "Sign in required" : "Couldn't broadcast the alert"}>
            {broadcast.error?.isUnauthorized ? (
              <>
                Broadcasting requires a PawGuard account.{" "}
                <button
                  onClick={() => openAuthDialog("sign-in")}
                  className="font-semibold text-destructive underline underline-offset-2 hover:opacity-80 transition-opacity"
                >
                  Sign in now
                </button>{" "}
                and we&apos;ll retry automatically.
              </>
            ) : (
              errorText
            )}
          </Alert>
        )}
      </div>
    </Reveal>
  );
}

function CaseContent({ caseItem }: { caseItem: LostFoundCase }) {
  const status = STATUS_BADGE[caseItem.status] ?? STATUS_BADGE.active;
  const hasCoords =
    typeof caseItem.latitude === "number" && typeof caseItem.longitude === "number";

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(var(--header-height)+1.5rem)]">
      <Link
        href="/lost-found"
        className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-primary transition-colors duration-fast group"
      >
        <ArrowLeft size={15} className="transition-transform duration-fast group-hover:-translate-x-0.5" />
        Back to Lost &amp; Found
      </Link>

      <div className="py-8 lg:py-12">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-stretch">
            <div className="relative">
              <PhotoPanel caseItem={caseItem} />
            </div>

            <div className="flex flex-col justify-center gap-8">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-primary text-xs font-semibold tracking-widest uppercase font-condensed">
                    {caseItem.caseNumber}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-primary/30" />
                  <span className="text-muted-foreground text-xs font-semibold tracking-widest uppercase font-condensed">
                    {SPECIES_LABEL[caseItem.animalType] ?? "Pet"}
                  </span>
                  <span className={cn("inline-flex items-center px-2.5 py-0.5 text-2xs font-semibold tracking-wider uppercase rounded-full border", status.cls)}>
                    {status.label}
                  </span>
                </div>
                <h1 className="font-serif font-bold text-4xl lg:text-5xl leading-none tracking-tight text-foreground">
                  {caseItem.petName}
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-[520px]">
                  {caseItem.description}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-5 bg-card border border-border rounded-card">
                <Fact icon={PawPrint} label="Breed" value={caseItem.breed || "Not specified"} />
                <Fact icon={Sparkles} label="Colour" value={caseItem.color || "Not specified"} />
                <Fact icon={MapPin} label="Location" value={caseItem.location || "Not specified"} />
                <Fact icon={CalendarDays} label="Date" value={`${caseItem.date}${caseItem.time ? ` · ${caseItem.time}` : ""}`} />
                <Fact icon={User} label="Reported by" value={caseItem.reporterName} />
                <Fact icon={Mic} label="Microchip" value={caseItem.microchipId || "Not provided"} />
              </div>

              {hasCoords && (
                <a
                  href={directionsUrl(caseItem.latitude!, caseItem.longitude!)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="self-start inline-flex items-center gap-2 h-9 px-4 rounded-btn border border-border bg-background text-foreground text-xs font-semibold uppercase tracking-wider font-condensed hover:bg-primary/5 hover:border-primary hover:text-primary transition-all duration-fast"
                >
                  <Navigation size={15} />
                  View on Google Maps
                </a>
              )}

              {(caseItem.contactNumber || caseItem.email) && (
                <div className="flex flex-col gap-3 bg-card border border-border rounded-card p-5">
                  <p className="text-foreground font-semibold text-xs tracking-wider uppercase">Contact the reporter</p>
                  {caseItem.contactNumber && (
                    <a href={`tel:${caseItem.contactNumber.replace(/[^+\d]/g, "")}`} className="flex items-center gap-2.5 text-muted-foreground text-sm hover:text-foreground transition-colors duration-fast">
                      <Phone size={15} className="shrink-0 text-primary" />
                      {caseItem.contactNumber}
                    </a>
                  )}
                  {caseItem.email && (
                    <a href={`mailto:${caseItem.email}`} className="flex items-center gap-2.5 text-muted-foreground text-sm hover:text-foreground transition-colors duration-fast break-all">
                      <Mail size={15} className="shrink-0 text-primary" />
                      {caseItem.email}
                    </a>
                  )}
                </div>
              )}

              {caseItem.contactNumber === "" && caseItem.email === "" && (
                <Alert variant="info" title="Reporting comes next">
                  Contact details aren't shown yet. In a future update, verified reporters will publish a safe way to reach them so families can reunite.
                </Alert>
              )}
            </div>
          </div>
        </Reveal>

        {caseItem.timeline.length > 0 && (
          <Reveal>
            <div className="mt-16 max-w-[720px]">
              <SectionHeading eyebrow="Timeline">Case History</SectionHeading>
              <ol className="relative border-l border-border pl-6 mt-8 flex flex-col gap-8">
                {caseItem.timeline.map((event) => (
                  <li key={`${event.title}-${event.date}`} className="relative">
                    <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-primary/15" />
                    <p className="text-foreground font-semibold">{event.title}</p>
                    <p className="text-muted-foreground text-sm mt-0.5">{event.description}</p>
                    <p className="text-muted-foreground/70 text-xs mt-1">{event.date}</p>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}

function CaseSkeleton() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(var(--header-height)+1.5rem)]">
      <Skeleton className="h-4 w-32 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-stretch">
        <Skeleton className="aspect-[4/5] rounded-img" />
        <div className="flex flex-col gap-5">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-14 w-3/4" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-44 w-full" />
        </div>
      </div>
    </div>
  );
}

export default function LostFoundDetailPage({ id }: { id: string }) {
  const { case: caseItem, isLoading, isError, error, refetch } = useLostFoundReport(id);
  const { cases: related, isLoading: relatedLoading } = useRelatedLostFoundCases(
    id,
    caseItem?.kind ?? "lost",
    3,
    Boolean(caseItem),
  );

  if (isLoading) {
    return (
      <PageShell>
        <main id="main-content" className="flex-1">
          <CaseSkeleton />
        </main>
      </PageShell>
    );
  }

  if (isError && error !== null) {
    const notFound = isApiError(error) && error.isNotFound;
    return (
      <PageShell>
        <main id="main-content" className="flex-1 flex items-center justify-center px-6 pt-[var(--header-height)]">
          <div className="max-w-[560px] w-full">
            <Alert variant="error" title={notFound ? "Report not found" : "We couldn't load this report"}>
              {notFound ? "This report may have been removed or the link may be out of date." : getErrorMessage(error)}
            </Alert>
            <div className="mt-5">
              <EmptyState
                icon="search"
                title="Report unavailable"
                description="Browse the current lost & found reports instead to find who's looking for their companion."
                action={{ label: "Browse Lost & Found", to: "/lost-found" }}
              />
            </div>
          </div>
        </main>
      </PageShell>
    );
  }

  if (!caseItem) {
    return (
      <PageShell>
        <main id="main-content" className="flex-1 flex items-center justify-center px-6 pt-[var(--header-height)]">
          <div className="max-w-[560px] w-full">
            <EmptyState
              icon="search"
              title="Report unavailable"
              description="This report couldn't be found. It may have been removed."
              action={{ label: "Browse Lost & Found", to: "/lost-found" }}
            />
          </div>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <CaseContent caseItem={caseItem} />

        {related.length > 0 && (
          <Reveal>
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-section-lg">
              <div className="border-t border-border pt-12">
                <div className="flex flex-col gap-2">
                  <SectionHeading eyebrow="More Reports">
                    {caseItem.kind === "lost" ? "Other Lost Pets" : "Other Found Animals"}
                  </SectionHeading>
                </div>
                <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-grid-md mt-10">
                  {related.map((item) => (
                    <StaggerItem key={item.id}>
                      <LostFoundCard caseItem={item} />
                    </StaggerItem>
                  ))}
                </StaggerGrid>
              </div>
            </div>
          </Reveal>
        )}

        <BroadcastPanel caseItem={caseItem} />

        <Reveal>
          <div className="border-t border-border">
            <MatchesPanel reportId={caseItem.id} kind={caseItem.kind} petName={caseItem.petName} />
          </div>
        </Reveal>

        <Reveal>
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-section-lg text-center">
            <div className="bg-card border border-border rounded-card p-10 flex flex-col items-center gap-4">
              <h2 className="font-serif font-bold text-2xl lg:text-3xl text-foreground">
                Recognize this {SPECIES_LABEL[caseItem.animalType]?.toLowerCase() ?? "animal"}?
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed max-w-[540px]">
                Matching and ownership claims surface automatically when a matching report is found nearby. Verified owners can submit proof directly through PawGuard.
              </p>
              <Button variant="primary" size="md" asLink={{ href: "/lost-found" }}>
                Browse More Reports
              </Button>
            </div>
          </div>
        </Reveal>
      </main>
    </PageShell>
  );
}