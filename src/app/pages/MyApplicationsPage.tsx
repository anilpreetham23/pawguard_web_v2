"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, PawPrint, CheckCircle2 } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { PageShell, Card, Reveal, Skeleton, EmptyState, Alert } from "../components/pawguard";
import { AddCompanionPetButton } from "../components/AddCompanionPetButton";
import {
  useMyApplications,
  ADOPTION_STATUS_ORDER,
  ADOPTION_STATUS_LABEL,
  adoptionStatusStep,
} from "../hooks/useMyApplications";
import { useAuth } from "../providers/auth-provider";
import { getErrorMessage } from "@/lib/api";
import type { AdoptionApplicationResponse } from "@/lib/api";

const PAGE_SIZE = 10;

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function statusColor(status: string): string {
  switch (status) {
    case "submitted":
      return "bg-sky-500/10 text-sky-600 border-sky-500/25";
    case "screening":
    case "vetting":
      return "bg-amber-500/10 text-amber-600 border-amber-500/25";
    case "interview":
      return "bg-violet-500/10 text-violet-600 border-violet-500/25";
    case "home_check":
      return "bg-indigo-500/10 text-indigo-600 border-indigo-500/25";
    case "approved":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/25";
    case "completed":
      return "bg-teal-500/10 text-teal-600 border-teal-500/25";
    case "rejected":
      return "bg-destructive/10 text-destructive border-destructive/25";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

function StatusBadge({ status }: { status: AdoptionApplicationResponse["status"] }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold tracking-wider uppercase ${statusColor(status)}`}
    >
      {ADOPTION_STATUS_LABEL[status] ?? status}
    </span>
  );
}

function Pipeline({ status }: { status: AdoptionApplicationResponse["status"] }) {
  const step = adoptionStatusStep(status);
  if (status === "rejected") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="w-3 h-3 rounded-full bg-destructive shrink-0" aria-hidden="true" />
        This application was not able to proceed.
      </div>
    );
  }
  const total = ADOPTION_STATUS_ORDER.length;
  const pct = total > 0 ? Math.round((step / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
          Application progress
        </span>
        <span className="text-xs font-bold text-foreground">{step} of {total}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden" role="progressbar" aria-valuenow={step} aria-valuemin={0} aria-valuemax={total}>
        <div
          className="h-full rounded-full bg-primary transition-all duration-standard"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between mt-2">
        {ADOPTION_STATUS_ORDER.map((s, i) => {
          const isDone = i + 1 <= step;
          const isCurrent = i + 1 === step;
          return (
            <span
              key={s}
              aria-hidden="true"
              className={`w-2.5 h-2.5 rounded-full ${isDone ? (isCurrent ? "bg-primary ring-4 ring-primary/20" : "bg-primary/70") : "bg-border"}`}
            />
          );
        })}
      </div>
    </div>
  );
}

function ApplicationCard({ app }: { app: AdoptionApplicationResponse }) {
  return (
    <Card>
      <div className="p-6 flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-11 h-11 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
              <PawPrint size={20} className="text-primary" />
            </span>
            <div className="min-w-0">
              <p className="text-foreground font-bold text-base truncate">
                {app.dog?.name ?? "Adoption application"}
              </p>
              <p className="text-muted-foreground text-xs">
                {app.dog?.breed ? `${app.dog.breed}` : "Application"} · Applied {formatDate(app.created_at)}
              </p>
            </div>
          </div>
          <StatusBadge status={app.status} />
        </div>

        <Pipeline status={app.status} />

        {app.status === "rejected" && app.vetting_officer_notes && (
          <p className="text-sm text-muted-foreground bg-destructive/5 border border-destructive/15 rounded-card px-4 py-3">
            {app.vetting_officer_notes}
          </p>
        )}

        {(app.status === "approved" || app.status === "completed") && (
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-card px-4 py-3 flex flex-col gap-2">
            <span className="inline-flex items-center gap-1.5 text-emerald-700 text-sm font-semibold">
              <CheckCircle2 size={15} /> Adoption Approved
            </span>
            <p className="text-xs text-muted-foreground">
              {app.status === "completed"
                ? "This adoption is complete. This pet is part of your account."
                : "Your adoption has been approved. Add this dog to your pets to book veterinary visits, set smart reminders, and use the QR safety tag."}
            </p>
            {(app.status === "approved" || app.status === "completed") && (
              <AddCompanionPetButton
                applicationId={app.id}
                dogId={app.dog_id}
                petName={app.dog?.name ?? app.dog_id}
                breed={app.dog?.breed ?? null}
                sex={app.dog?.gender ?? null}
                species="dog"
                size="sm"
                variant="outline"
                className="mt-1"
              />
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
          <Link
            href={`/adopt/${app.dog_id}`}
            className="text-xs font-semibold text-primary hover:underline"
          >
            View dog profile
          </Link>
          <span className="text-[11px] text-muted-foreground">
            Last updated {formatDate(app.updated_at)}
          </span>
        </div>
      </div>
    </Card>
  );
}

export default function MyApplicationsPage() {
  const { isAuthenticated, status: authStatus, openAuthDialog } = useAuth();
  const [page, setPage] = useState(1);
  const {
    applications,
    total,
    totalPages,
    isLoading,
    isError,
    error,
    refetch,
  } = useMyApplications(page, PAGE_SIZE);

  if (authStatus === "loading") {
    return (
      <PageShell>
        <main id="main-content" className="flex-1">
          <PageHeader eyebrow="Adoption" title="My Applications" subtitle="Track the status of your adoption applications." />
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-section-md lg:py-section-lg">
            <div className="flex flex-col gap-4">
              {[0, 1, 2].map((i) => <div key={i} className="h-48 rounded-card bg-muted animate-pulse" />)}
            </div>
          </div>
        </main>
      </PageShell>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageShell>
        <main id="main-content" className="flex-1">
          <PageHeader eyebrow="Adoption" title="My Applications" subtitle="Sign in to track the status of your adoption applications." />
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-section-md lg:py-section-lg">
            <Reveal>
              <Card>
                <EmptyState
                  icon="heart"
                  title="Sign in to see your applications"
                  description="Track screening, interview, home check, and approval milestones for every application you've submitted."
                  action={{ label: "Sign in", onClick: () => openAuthDialog("sign-in") }}
                />
              </Card>
            </Reveal>
          </div>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <PageHeader
          eyebrow="Adoption"
          title="My Applications"
          subtitle="Follow each application through screening, interview, home check, and approval."
        />

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-section-md lg:py-section-lg">
          <Reveal>
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground text-sm">
                <span className="font-semibold text-foreground">{total}</span> application{total === 1 ? "" : "s"}
              </p>
              <Link
                href="/adopt"
                className="inline-flex items-center gap-2 bg-card border border-border text-foreground text-xs font-semibold tracking-wider uppercase px-4 py-2.5 rounded-btn hover:border-primary hover:text-primary transition-all duration-fast"
              >
                Browse dogs
              </Link>
            </div>

            {isLoading ? (
              <div className="flex flex-col gap-4">
                {[0, 1, 2].map((i) => <div key={i} className="h-48 rounded-card bg-muted animate-pulse" />)}
              </div>
            ) : isError ? (
              <Alert variant="error" title="Couldn't load your applications">
                {getErrorMessage(error)}{" "}
                <button onClick={() => refetch()} className="font-semibold text-destructive underline underline-offset-2 hover:opacity-80 transition-opacity">
                  Retry
                </button>
              </Alert>
            ) : applications.length === 0 ? (
              <Card>
                <EmptyState
                  icon="heart"
                  title="No applications yet"
                  description="When you apply to adopt a dog, you'll be able to track its progress here."
                  action={{ label: "Start your search", to: "/adopt" }}
                />
              </Card>
            ) : (
              <div className="flex flex-col gap-4">
                {applications.map((app) => (
                  <ApplicationCard key={app.id} app={app} />
                ))}
              </div>
            )}

            {!isLoading && !isError && totalPages > 1 && (
              <div className="flex items-center justify-between mt-10 gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="inline-flex items-center gap-2 bg-card border border-border text-foreground text-xs font-semibold tracking-wider uppercase px-4 py-2.5 rounded-btn hover:border-primary hover:text-primary transition-all duration-fast disabled:opacity-40 disabled:pointer-events-none"
                >
                  <ChevronLeft size={15} />
                  Prev
                </button>
                <p className="text-muted-foreground text-sm">
                  Page <span className="font-semibold text-foreground">{page}</span> of {totalPages}
                </p>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="inline-flex items-center gap-2 bg-card border border-border text-foreground text-xs font-semibold tracking-wider uppercase px-4 py-2.5 rounded-btn hover:border-primary hover:text-primary transition-all duration-fast disabled:opacity-40 disabled:pointer-events-none"
                >
                  Next
                  <ChevronRight size={15} />
                </button>
              </div>
            )}
          </Reveal>
        </div>
      </main>
    </PageShell>
  );
}