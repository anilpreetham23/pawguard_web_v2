"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search, X, ChevronDown } from "lucide-react";
import AdoptionCard from "@/features/adoption/AdoptionCard";
import { Reveal, StaggerGrid, StaggerItem, EmptyState, Skeleton, Alert } from "@/components/ui/pawguard";
import { useAdoptionPets, type Pet } from "@/hooks/useAdoptionPets";
import { getErrorMessage } from "@/lib/api";

const AGE_OPTIONS = ["Puppy", "Adult", "Senior"];
const SIZE_OPTIONS = ["Small", "Medium", "Large"];
type PetAgeGroup = "puppy" | "adult" | "senior";
type PetSize = "small" | "medium" | "large";

const AGE_ORDER: Record<PetAgeGroup, number> = { puppy: 0, adult: 1, senior: 2 };
const AGE_LABEL: Record<PetAgeGroup, string> = { puppy: "Puppy", adult: "Adult", senior: "Senior" };
const SIZE_LABEL: Record<PetSize, string> = { small: "Small", medium: "Medium", large: "Large" };

const PAGE_SIZE = 9;

function CardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-card overflow-hidden shadow-sm flex flex-col">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="p-5 flex flex-col gap-2">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-10 w-full mt-2" />
      </div>
    </div>
  );
}

export default function AdoptionClientIsland({
  initialDogs,
}: {
  initialDogs?: import("@/lib/api").DogProfileResponse[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedAge, setSelectedAge] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("default");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const apiParams = useMemo(() => {
    let min_age_months: number | undefined;
    let max_age_months: number | undefined;
    let min_weight: number | undefined;
    let max_weight: number | undefined;

    if (selectedAge.length === 1) {
      const age = selectedAge[0];
      if (age === "Puppy (< 1 yr)") max_age_months = 12;
      else if (age === "Young (1-3 yrs)") { min_age_months = 12; max_age_months = 36; }
      else if (age === "Adult (3-8 yrs)") { min_age_months = 36; max_age_months = 96; }
      else if (age === "Senior (8+ yrs)") min_age_months = 96;
    }

    if (selectedSize.length === 1) {
      const sz = selectedSize[0];
      if (sz === "Small (< 10 kg)") max_weight = 10;
      else if (sz === "Medium (10-25 kg)") { min_weight = 10; max_weight = 25; }
      else if (sz === "Large (25+ kg)") min_weight = 25;
    }

    return {
      search: debouncedSearch.trim() || undefined,
      min_age_months,
      max_age_months,
      min_weight,
      max_weight,
      page,
      page_size: PAGE_SIZE,
      ...(sortBy !== "default" ? { sort_by: sortBy === "name" ? "name" : "created_at" } : {}),
    };
  }, [debouncedSearch, selectedAge, selectedSize, sortBy, page]);

  const { pets, meta, isLoading, isError, error, refetch } = useAdoptionPets(apiParams, initialDogs);

  function clearAllFilters() {
    setSearchQuery("");
    setSelectedAge([]);
    setSelectedSize([]);
    setSortBy("default");
  }

  const hasFilters = selectedAge.length > 0 || selectedSize.length > 0 || searchQuery.trim().length > 0 || sortBy !== "default";

  useEffect(() => {
    setPage(1);
  }, [selectedAge, selectedSize, sortBy, debouncedSearch]);

  const totalPages = Math.max(1, meta.total_pages);
  const pagePets = pets;

  return (
    <>
      {/* Clean Public-Service Filter Toolbar */}
      <Reveal>
        <div className="bg-card border border-border rounded-card p-4 sm:p-6 mb-8 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1 min-w-0">
                <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, breed, or color…"
                  aria-label="Search available dogs by name, breed, or color"
                  className="w-full bg-background border border-border rounded-btn pl-10 pr-9 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-standard"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search text"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-destructive hover:underline self-end md:self-auto py-2 px-1"
                >
                  <X size={13} /> Clear filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-border/60">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground font-condensed">Age</label>
                <div className="relative">
                  <select
                    value={selectedAge[0] || ""}
                    onChange={(e) => setSelectedAge(e.target.value ? [e.target.value] : [])}
                    aria-label="Filter by age group"
                    className="w-full appearance-none bg-background border border-border rounded-btn pl-3 pr-8 py-2 text-xs font-medium text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-standard cursor-pointer"
                  >
                    <option value="">All Ages</option>
                    {AGE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground font-condensed">Size</label>
                <div className="relative">
                  <select
                    value={selectedSize[0] || ""}
                    onChange={(e) => setSelectedSize(e.target.value ? [e.target.value] : [])}
                    aria-label="Filter by size"
                    className="w-full appearance-none bg-background border border-border rounded-btn pl-3 pr-8 py-2 text-xs font-medium text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-standard cursor-pointer"
                  >
                    <option value="">All Sizes</option>
                    {SIZE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground font-condensed">Sort By</label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="Sort dogs by"
                    className="w-full appearance-none bg-background border border-border rounded-btn pl-3 pr-8 py-2 text-xs font-medium text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-standard cursor-pointer"
                  >
                    <option value="default">Default</option>
                    <option value="name">Name (A-Z)</option>
                    <option value="age">Age (Youngest)</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Results Summary & Dog Grid */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <p className="text-muted-foreground text-xs sm:text-sm">
          <span className="font-semibold text-foreground">{isLoading ? "…" : meta.total}</span> {meta.total === 1 ? "companion available" : "companions available"}
        </p>
      </div>

      {isLoading ? (
        <StaggerGrid key={`skeleton-${page}-${selectedAge.join(",")}-${selectedSize.join(",")}-${sortBy}`} className="grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-grid-md lg:gap-6">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <StaggerItem key={i}>
              <CardSkeleton />
            </StaggerItem>
          ))}
        </StaggerGrid>
      ) : isError ? (
        <Alert variant="error" title="Couldn't load available dogs">
          {getErrorMessage(error)} <button onClick={() => refetch()} className="font-semibold text-destructive underline underline-offset-2 hover:opacity-80 transition-opacity">Retry</button>
        </Alert>
      ) : pets.length === 0 ? (
        <EmptyState
          title="No dogs match your filters"
          description="Try adjusting your selection — every dog here is waiting for someone like you."
          action={hasFilters ? { label: "Clear Filters", onClick() { setSelectedAge([]); setSelectedSize([]); } } : undefined}
        />
      ) : (
        <StaggerGrid key={`${page}-${selectedAge.join(",")}-${selectedSize.join(",")}-${sortBy}`} className="grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-grid-md lg:gap-6">
          {pagePets.map((pet: Pet) => (
            <StaggerItem key={pet.id}>
              <AdoptionCard
                name={pet.name}
                breed={pet.breed}
                age={pet.age}
                gender={pet.gender === "female" ? "Female" : "Male"}
                desc={pet.description}
                temperament={pet.personalityTraits.join(", ")}
                vaccinated={pet.vaccinationStatus === "up-to-date"}
                urgent={pet.adoptionBadge === "recent"}
                newArrival={(pet.addedDaysAgo ?? 99) <= 14}
                slug={pet.id}
                emoji={pet.emoji}
                tone={pet.tone}
                img={pet.img}
                image_urls={pet.image_urls}
                photo_gallery_urls={pet.photo_gallery_urls}
              />
            </StaggerItem>
          ))}
        </StaggerGrid>
      )}

      {!isLoading && !isError && pagePets.length > 0 && totalPages > 1 && (
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
    </>
  );
}
