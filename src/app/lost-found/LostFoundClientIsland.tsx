"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, X, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "@/layouts/SectionHeading";
import LostFoundCard from "@/features/lost-found/LostFoundCard";
import { Section, Card, StaggerGrid, StaggerItem, EmptyState, Skeleton, Alert, Button } from "@/components/ui/pawguard";
import { reportToCase } from "@/services/api/lost-found/mapper";
import { useLostFoundReports } from "@/hooks/useLostFound";
import { getErrorMessage } from "@/lib/api";
import type { LostFoundReportStatus, LostFoundReportResponse } from "@/lib/api";
import { cn } from "@/components/ui/utils";
import type { LostFoundKind } from "@/types";

const PAGE_SIZE = 9;

const KIND_OPTIONS: { value: LostFoundKind; label: string; hint: string }[] = [
  {
    value: "lost",
    label: "Lost Dogs",
    hint: "Reported missing by their owners. Check here if you've spotted a roaming dog.",
  },
  {
    value: "found",
    label: "Found Dogs",
    hint: "Spotted or taken in by community members. Check here if you're searching for your missing dog.",
  },
];

const STATUS_OPTIONS: { value: LostFoundReportStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "resolved", label: "Resolved" },
  { value: "expired", label: "Expired" },
];

const EMPTY_MESSAGES: Record<LostFoundKind, { title: string; description: string }> = {
  lost: {
    title: "No lost dogs reported yet",
    description:
      "When an owner files a lost-dog alert, it will appear here immediately for community sightings.",
  },
  found: {
    title: "No found dogs reported yet",
    description:
      "If you've spotted or taken in a roaming dog, report it above so the owner can reach you.",
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

interface LostFoundClientIslandProps {
  initialReports?: LostFoundReportResponse[];
}

export default function LostFoundClientIsland({ initialReports }: LostFoundClientIslandProps) {
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

  const initialCases = useMemo(
    () => initialReports?.map((r) => reportToCase(r)),
    [initialReports]
  );

  const {
    cases,
    total,
    totalPages,
    isLoading,
    isError,
    error,
    refetch,
  } = useLostFoundReports(kind, queryParams, initialCases);

  const activeKindHint = KIND_OPTIONS.find((o) => o.value === kind)?.hint;

  return (
    <div className="flex flex-col gap-8">
      {/* Category Tabs */}
      <div className="flex flex-col gap-3">
        <div
          role="tablist"
          aria-label="Filter lost or found reports"
          className="inline-flex p-1 bg-secondary rounded-btn border border-border self-start"
        >
          {KIND_OPTIONS.map((opt) => {
            const selected = kind === opt.value;
            return (
              <button
                key={opt.value}
                role="tab"
                id={`tab-${opt.value}`}
                aria-selected={selected}
                aria-controls="reports-section"
                tabIndex={selected ? 0 : -1}
                onClick={() => setKind(opt.value)}
                className={cn(
                  "px-5 py-2.5 text-sm font-semibold rounded-[calc(var(--radius-btn)-2px)] transition-all duration-fast",
                  selected
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        {activeKindHint && (
          <p className="text-muted-foreground text-xs">{activeKindHint}</p>
        )}
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-card border border-border rounded-card p-4 sm:p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 shadow-xs">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by breed, color, location..."
            aria-label="Search reports"
            className="w-full bg-background border border-border rounded-btn pl-10 pr-9 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-standard"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search text"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <div className="relative shrink-0 min-w-[140px]">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as LostFoundReportStatus | "")}
              aria-label="Filter by report status"
              className="w-full appearance-none bg-background border border-border rounded-btn px-3.5 py-2.5 pr-8 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-standard cursor-pointer"
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={15}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs text-primary font-semibold hover:underline px-2 py-1 shrink-0"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Main Grid & States */}
      <div id="reports-section">
        {isError ? (
          <Alert variant="error" className="my-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
              <span>{getErrorMessage(error, "Failed to load reports.")}</span>
              <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          </Alert>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-grid-md lg:gap-grid-lg">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : cases.length === 0 ? (
          <EmptyState
            title={hasFilters ? "No matching reports" : EMPTY_MESSAGES[kind].title}
            description={
              hasFilters
                ? "Try relaxing your search terms or clearing status filters."
                : EMPTY_MESSAGES[kind].description
            }
            action={
              hasFilters
                ? { label: "Clear all filters", onClick: clearAllFilters }
                : { label: kind === "lost" ? "Report Lost Dog" : "Report Found Dog", to: `/lost-found/report/${kind}` }
            }
          />
        ) : (
          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-grid-md lg:gap-grid-lg">
            {cases.map((caseItem) => (
              <StaggerItem key={caseItem.id}>
                <LostFoundCard caseItem={caseItem} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && !isError && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Showing Page <span className="font-semibold text-foreground">{page}</span> of{" "}
            <span className="font-semibold text-foreground">{totalPages}</span> ({total} total reports)
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              aria-label="Previous page"
            >
              <ChevronLeft size={14} /> Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              aria-label="Next page"
            >
              Next <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
