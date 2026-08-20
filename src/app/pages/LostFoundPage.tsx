"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, X, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import PageHeader from "../components/PageHeader";
import SectionHeading from "../components/SectionHeading";
import LostFoundCard from "../components/LostFoundCard";
import { PageShell, Section, Card, Reveal, StaggerGrid, StaggerItem, EmptyState, Skeleton, Alert, Button } from "../components/pawguard";
import { useLostFoundReports } from "../hooks/useLostFound";
import { getErrorMessage } from "@/lib/api";
import type { LostFoundReportStatus } from "@/lib/api";
import { cn } from "../components/ui/utils";
import type { LostFoundKind } from "@/types";

const PAGE_SIZE = 9;

const KIND_OPTIONS: { value: LostFoundKind; label: string; hint: string }[] = [
  {
    value: "lost",
    label: "Lost Pets",
    hint: "Reported missing by their owners. Check here if you've spotted a roaming animal.",
  },
  {
    value: "found",
    label: "Found Animals",
    hint: "Spotted or taken in by community members. Check here if you're searching for your missing companion.",
  },
];

const STATUS_OPTIONS: { value: LostFoundReportStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "resolved", label: "Resolved" },
  { value: "expired", label: "Expired" },
];

const EMPTY_MESSAGES: Record<LostFoundKind, { title: string; description: string }> = {
  lost: {
    title: "No lost pets reported yet",
    description:
      "When an owner files a lost-pet alert, it will appear here immediately for community sightings.",
  },
  found: {
    title: "No found animals reported yet",
    description:
      "If you've spotted or taken in a roaming animal, report it above so the owner can reach you.",
  },
};

function CardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-card overflow-hidden shadow-sm flex flex-col">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="p-5 flex flex-col gap-2">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-10 w-full mt-2" />
      </div>
    </div>
  );
}

export default function LostFoundPage() {
  const [kind, setKind] = useState<LostFoundKind>("lost");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [status, setStatus] = useState<LostFoundReportStatus | "">("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 350);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    setPage(1);
  }, [kind, debouncedQuery, status]);

  const hasFilters = debouncedQuery.length > 0 || status !== "";

  function clearAllFilters() {
    setQuery("");
    setStatus("");
  }

  const queryParams = useMemo(
    () => ({
      page,
      page_size: PAGE_SIZE,
      ...(debouncedQuery ? { search: debouncedQuery } : {}),
      ...(status ? { status } : {}),
    }),
    [page, debouncedQuery, status]
  );

  const {
    cases,
    total,
    totalPages,
    page: currentPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useLostFoundReports(kind, queryParams);

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <PageHeader
          eyebrow="Lost & Found"
          title="Help Families Reunite"
          subtitle="Browse missing-pet reports and animals found safe. If you recognize one of these companions, reach out through the contact details on each report."
        >
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" size="md" asLink={{ href: "/lost-found/report/lost" }}>
              Report a Lost Pet
            </Button>
            <Button variant="outline" size="md" asLink={{ href: "/lost-found/report/found" }}>
              Report a Found Animal
            </Button>
          </div>
        </PageHeader>

        <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-section-md lg:py-section-lg">
          {/* Kind toggle */}
          <Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-grid-md mb-8">
              {KIND_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setKind(opt.value)}
                  aria-pressed={kind === opt.value}
                  className={cn(
                    "text-left border rounded-card px-6 py-5 transition-all duration-gentle ease-gentle cursor-pointer",
                    kind === opt.value
                      ? "border-primary bg-primary/5 shadow-glow-soft"
                      : "border-border bg-card hover:border-primary/40 hover:bg-primary/2",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <h3 className={cn("font-condensed font-semibold tracking-wider uppercase text-sm", kind === opt.value ? "text-primary" : "text-foreground")}>
                      {opt.label}
                    </h3>
                    <span className="text-muted-foreground text-xs font-mono">{opt.value}</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mt-1">{opt.hint}</p>
                </button>
              ))}
            </div>
          </Reveal>

          {/* Clean Public-Service Filter Toolbar */}
          <Reveal>
            <div className="bg-card border border-border rounded-card p-4 sm:p-6 mb-8 shadow-sm">
              <div className="flex flex-col md:flex-row items-stretch md:items-end justify-between gap-4">
                {/* Search Bar Row */}
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <label className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground font-condensed">Search</label>
                  <div className="relative w-full">
                    <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={kind === "lost" ? "Search lost reports by name, breed, location…" : "Search found reports by breed, location…"}
                      aria-label={kind === "lost" ? "Search lost reports" : "Search found reports"}
                      className="w-full bg-background border border-border rounded-btn pl-10 pr-9 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-standard"
                    />
                    {query && (
                      <button
                        type="button"
                        onClick={() => setQuery("")}
                        aria-label="Clear search text"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors"
                      >
                        <X size={15} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Status Filter Dropdown */}
                <div className="w-full md:w-56 flex flex-col gap-1">
                  <label className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground font-condensed">Status</label>
                  <div className="relative">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as LostFoundReportStatus | "")}
                      aria-label="Filter by report status"
                      className="w-full appearance-none bg-background border border-border rounded-btn pl-3 pr-8 py-2.5 text-xs font-medium text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-standard cursor-pointer"
                    >
                      <option value="">All Statuses</option>
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-destructive hover:underline pb-2.5 px-1 shrink-0"
                  >
                    <X size={13} /> Clear filters
                  </button>
                )}
              </div>
            </div>
          </Reveal>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <p className="text-muted-foreground text-xs sm:text-sm">
              <span className="font-semibold text-foreground">{isLoading ? "…" : total}</span>{" "}
              {kind === "lost" ? (total === 1 ? "lost-pet report" : "lost-pet reports") : (total === 1 ? "found-animal report" : "found-animal reports")}
            </p>
          </div>

          {isLoading ? (
            <StaggerGrid key={`skeleton-${kind}-${page}-${debouncedQuery}-${status}`} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-grid-md">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <StaggerItem key={i}>
                  <CardSkeleton />
                </StaggerItem>
              ))}
            </StaggerGrid>
          ) : isError ? (
            <Alert variant="error" title={`Couldn't load ${kind === "lost" ? "lost-pet" : "found-animal"} reports`}>
              {getErrorMessage(error)}{" "}
              <button onClick={() => refetch()} className="font-semibold text-destructive underline underline-offset-2 hover:opacity-80 transition-opacity">
                Retry
              </button>
            </Alert>
          ) : cases.length === 0 ? (
            <EmptyState
              icon="search"
              title={hasFilters ? "No matches for your filters" : EMPTY_MESSAGES[kind].title}
              description={hasFilters ? "Try adjusting your search or status filters to see more reports." : EMPTY_MESSAGES[kind].description}
              action={hasFilters ? { label: "Clear Filters", onClick() { setQuery(""); setStatus(""); } } : undefined}
            />
          ) : (
            <StaggerGrid key={`${kind}-${page}-${debouncedQuery}-${status}`} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-grid-md lg:gap-6">
              {cases.map((caseItem) => (
                <StaggerItem key={caseItem.id}>
                  <LostFoundCard caseItem={caseItem} />
                </StaggerItem>
              ))}
            </StaggerGrid>
          )}

              {!isLoading && !isError && cases.length > 0 && totalPages > 1 && (
                <div className="flex items-center justify-between mt-10 gap-4">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                    className="inline-flex items-center gap-2 bg-card border border-border text-foreground text-xs font-semibold tracking-wider uppercase px-4 py-2.5 rounded-btn hover:border-primary hover:text-primary transition-all duration-fast disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <ChevronLeft size={15} />
                    Prev
                  </button>
                  <p className="text-muted-foreground text-sm">
                    Page <span className="font-semibold text-foreground">{currentPage}</span> of {totalPages}
                  </p>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="inline-flex items-center gap-2 bg-card border border-border text-foreground text-xs font-semibold tracking-wider uppercase px-4 py-2.5 rounded-btn hover:border-primary hover:text-primary transition-all duration-fast disabled:opacity-40 disabled:pointer-events-none"
                  >
                    Next
                    <ChevronRight size={15} />
                  </button>
                </div>
              )}
        </div>

        <Reveal>
          <Section bg="card">
            <div className="max-w-[800px] mx-auto flex flex-col gap-12">
              <SectionHeading eyebrow="How It Works" align="center">
                Reuniting Takes a Community
              </SectionHeading>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-grid-md">
                {[
                  { num: "01", title: "Report", desc: `A ${kind === "lost" ? "missing pet is reported with last-seen details" : "found animal is reported with where it was spotted"}, including photos when available.` },
                  { num: "02", title: "Browse & Match", desc: "Families and neighbours compare reports by breed, colour, and location to spot a match." },
                  { num: "03", title: "Reunite", desc: "Through PawGuard's matching and claim flow, verified owners are safely reconnected." },
                ].map((s) => (
                  <div key={s.num} className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="font-mono text-primary font-bold text-xs">{s.num}</span>
                      </div>
                      <div className="flex-1 h-px bg-border hidden lg:block" />
                    </div>
                    <h3 className="text-foreground font-bold text-lg">{s.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </Reveal>
      </main>
    </PageShell>
  );
}