"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageHeader from "../components/PageHeader";
import SectionHeading from "../components/SectionHeading";
import LostFoundCard from "../components/LostFoundCard";
import { PageShell, Section, Card, Reveal, StaggerGrid, StaggerItem, EmptyState, Skeleton, Alert, Input, Button } from "../components/pawguard";
import { useLostFoundReports } from "../hooks/useLostFound";
import { getErrorMessage } from "@/lib/api";
import type { Species, LostFoundReportStatus } from "@/lib/api";
import { cn } from "../components/ui/utils";
import type { LostFoundKind } from "@/types";

const PAGE_SIZE = 9;

const KIND_OPTIONS: { value: LostFoundKind; label: string; hint: string }[] = [
  { value: "lost", label: "Lost Pets", hint: "Missing companions reported by their families." },
  { value: "found", label: "Found Animals", hint: "Unidentified animals found and sheltering with reporters." },
];

const STATUS_OPTIONS: { value: LostFoundReportStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "resolved", label: "Resolved" },
  { value: "expired", label: "Expired" },
];

const SPECIES_OPTIONS: { value: Species; label: string }[] = [
  { value: "dog", label: "Dogs" },
  { value: "cat", label: "Cats" },
  { value: "bird", label: "Birds" },
  { value: "rabbit", label: "Rabbits" },
  { value: "other", label: "Other" },
];

const EMPTY_MESSAGES: Record<LostFoundKind, { title: string; description: string }> = {
  lost: {
    title: "No lost-pet reports right now",
    description: "New missing-pet reports appear here as families file them. Check back soon, or widen your filters.",
  },
  found: {
    title: "No found-animal reports right now",
    description: "Reports of found animals land here as neighbours shelter them. Check back soon, or widen your filters.",
  },
};

function FilterToggle({ label, selected, onSelect }: { label: string; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "flex items-center justify-between gap-3 cursor-pointer group min-h-[44px] py-1 text-left w-full",
      )}
    >
      <span className={cn(
        "text-sm transition-colors duration-fast",
        selected ? "text-foreground font-semibold" : "text-muted-foreground group-hover:text-foreground",
      )}>
        {label}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "shrink-0 w-5 h-5 rounded-full border transition-all duration-fast",
          selected ? "border-primary bg-primary/10" : "border-border bg-transparent group-hover:border-primary/40",
        )}
      >
        {selected && <span className="block w-2 h-2 rounded-full bg-primary mx-auto mt-[5px]" />}
      </span>
    </button>
  );
}

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
  const [species, setSpecies] = useState<Species | "">("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 350);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    setPage(1);
  }, [kind, debouncedQuery, status, species]);

  const hasFilters = debouncedQuery.length > 0 || status !== "" || species !== "";

  const queryParams = useMemo(
    () => ({
      page,
      page_size: PAGE_SIZE,
      ...(debouncedQuery ? { search: debouncedQuery } : {}),
      ...(status ? { status } : {}),
      ...(species ? { species } : {}),
    }),
    [page, debouncedQuery, status, species]
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

        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-section-md lg:py-section-lg">
          {/* Kind toggle */}
          <Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-grid-md mb-12">
              {KIND_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setKind(opt.value)}
                  aria-pressed={kind === opt.value}
                  className={cn(
                    "text-left border rounded-card px-6 py-5 transition-all duration-gentle ease-gentle",
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

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <aside className="lg:w-[240px] shrink-0">
              <Card className="sticky top-[88px]">
                <div className="flex items-center justify-between">
                  <h3 className="text-foreground font-semibold text-xs tracking-wider uppercase">Filters</h3>
                  {hasFilters && (
                    <button
                      onClick={() => { setQuery(""); setStatus(""); setSpecies(""); }}
                      className="text-destructive text-xs font-semibold hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <Input
                  id="lost-found-search"
                  label="Search"
                  type="search"
                  placeholder="Name, breed, location…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />

                <div className="h-px bg-border" />
                <fieldset className="flex flex-col gap-3 border-0 p-0 m-0" role="radiogroup">
                  <legend className="text-muted-foreground text-xs font-semibold tracking-wider uppercase mb-0">Status</legend>
                  {STATUS_OPTIONS.map((opt) => (
                    <FilterToggle
                      key={opt.value}
                      label={opt.label}
                      selected={status === opt.value}
                      onSelect={() => setStatus(status === opt.value ? "" : opt.value)}
                    />
                  ))}
                </fieldset>
                <div className="h-px bg-border" />
                <fieldset className="flex flex-col gap-3 border-0 p-0 m-0" role="radiogroup">
                  <legend className="text-muted-foreground text-xs font-semibold tracking-wider uppercase mb-0">Species</legend>
                  {SPECIES_OPTIONS.map((opt) => (
                    <FilterToggle
                      key={opt.value}
                      label={opt.label}
                      selected={species === opt.value}
                      onSelect={() => setSpecies(species === opt.value ? "" : opt.value)}
                    />
                  ))}
                </fieldset>
              </Card>
            </aside>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground text-sm">
                  <span className="font-semibold text-foreground">{isLoading ? "…" : total}</span>{" "}
                  {kind === "lost" ? "lost-pet report" : "found-animal report"}{total === 1 ? "" : "s"}
                </p>
              </div>

              {isLoading ? (
                <StaggerGrid key={`skeleton-${kind}-${page}-${debouncedQuery}-${status}-${species}`} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-grid-md">
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
                  description={hasFilters ? "Try adjusting your search, status, or species filters to see more reports." : EMPTY_MESSAGES[kind].description}
                  action={hasFilters ? { label: "Clear Filters", onClick() { setQuery(""); setStatus(""); setSpecies(""); } } : undefined}
                />
              ) : (
                <StaggerGrid key={`${kind}-${page}-${debouncedQuery}-${status}-${species}`} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-grid-md">
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
          </div>
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