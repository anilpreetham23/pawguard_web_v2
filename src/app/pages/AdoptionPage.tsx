"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Shield, RefreshCw, ChevronLeft, ChevronRight, Search, X, ChevronDown, Filter } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import PageHeader from "../components/PageHeader";
import AdoptionCard from "../components/AdoptionCard";
import { PageShell, Section, Card, Reveal, StaggerGrid, StaggerItem, EmptyState, Skeleton, Alert, Input } from "../components/pawguard";
import { useAdoptionPets } from "../hooks/useAdoptionPets";
import { getErrorMessage } from "@/lib/api";

const AGE_OPTIONS = ["Puppy", "Adult", "Senior"];
const SIZE_OPTIONS = ["Small", "Medium", "Large"];
type PetAgeGroup = "puppy" | "adult" | "senior";
type PetSize = "small" | "medium" | "large";

const AGE_ORDER: Record<PetAgeGroup, number> = { puppy: 0, adult: 1, senior: 2 };
const AGE_LABEL: Record<PetAgeGroup, string> = { puppy: "Puppy", adult: "Adult", senior: "Senior" };
const SIZE_LABEL: Record<PetSize, string> = { small: "Small", medium: "Medium", large: "Large" };

const PAGE_SIZE = 9;

function FilterCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group min-h-[44px] py-1">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-5 h-5 accent-primary rounded border-border shrink-0"
      />
      <span className="text-muted-foreground text-sm group-hover:text-foreground transition-colors duration-fast">{label}</span>
    </label>
  );
}

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

export default function AdoptionPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAge, setSelectedAge] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("default");
  const [page, setPage] = useState(1);

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
      search: searchQuery.trim() || undefined,
      min_age_months,
      max_age_months,
      min_weight,
      max_weight,
      page,
      page_size: 24,
    };
  }, [searchQuery, selectedAge, selectedSize, page]);

  const { data: pets = [], isLoading, isError, error, refetch } = useAdoptionPets(apiParams);

  function toggle(list: string[], value: string, setter: (v: string[]) => void) {
    setter(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  }

  function clearAllFilters() {
    setSearchQuery("");
    setSelectedAge([]);
    setSelectedSize([]);
    setSortBy("default");
  }

  const filtered = pets.filter((pet) => {
    if (selectedAge.length && !selectedAge.includes(AGE_LABEL[pet.ageGroup])) return false;
    if (selectedSize.length && !selectedSize.includes(SIZE_LABEL[pet.size])) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = pet.name.toLowerCase().includes(q);
      const matchBreed = pet.breed.toLowerCase().includes(q);
      const matchColor = pet.color.toLowerCase().includes(q);
      const matchDesc = pet.description.toLowerCase().includes(q);
      if (!matchName && !matchBreed && !matchColor && !matchDesc) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "age") return AGE_ORDER[a.ageGroup] - AGE_ORDER[b.ageGroup];
    return 0;
  });

  const hasFilters = selectedAge.length > 0 || selectedSize.length > 0 || searchQuery.trim().length > 0 || sortBy !== "default";

  // Reset to first page whenever any filter, search, or sort changes
  useEffect(() => {
    setPage(1);
  }, [selectedAge, selectedSize, sortBy, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagePets = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <PageHeader
          eyebrow="Adoption"
          title="Find Your New Companion"
          subtitle="Every dog in our care has been assessed, vaccinated, and prepared for their permanent home."
        />

        <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-section-md lg:py-section-lg">
          {/* Process overview — shown before filters to set expectations */}
          <Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-grid-md lg:gap-grid-lg mb-12 pb-12 border-b border-border">
              {[
                { num: "01", title: "Find Your Match", desc: "Browse and filter available dogs. Each profile includes health, temperament, and care needs." },
                { num: "02", title: "Submit Application", desc: "Complete a short application. We review within 2 business days." },
                { num: "03", title: "Meet & Greet", desc: "Schedule a supervised meeting at one of our centres." },
                { num: "04", title: "Take Them Home", desc: "Finalize paperwork and bring your new companion home with a starter care kit." },
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
          </Reveal>

          {/* Clean Public-Service Filter Toolbar */}
          <Reveal>
            <div className="bg-card border border-border rounded-card p-4 sm:p-6 mb-8 shadow-sm">
              <div className="flex flex-col gap-4">
                {/* Search Bar Row */}
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

                {/* Filter Dropdowns Grid */}
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
              <span className="font-semibold text-foreground">{isLoading ? "…" : filtered.length}</span> {filtered.length === 1 ? "companion available" : "companions available"}
            </p>
          </div>

              {isLoading ? (
                <StaggerGrid key={`skeleton-${currentPage}-${selectedAge.join(",")}-${selectedSize.join(",")}-${sortBy}`} className="grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-grid-md lg:gap-6">
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
              ) : filtered.length === 0 ? (
                <EmptyState
                  title={pets.length === 0 ? "No dogs available right now" : "No dogs match your filters"}
                  description={pets.length === 0 ? "New dogs join our care every week. Check back soon or follow us for updates." : "Try adjusting your selection — every dog here is waiting for someone like you."}
                  action={hasFilters ? { label: "Clear Filters", onClick() { setSelectedAge([]); setSelectedSize([]); } } : undefined}
                />
              ) : (
                <StaggerGrid key={`${currentPage}-${selectedAge.join(",")}-${selectedSize.join(",")}-${sortBy}`} className="grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-grid-md lg:gap-6">
                  {pagePets.map((pet) => (
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
        <Reveal><Section bg="card">
          <div className="max-w-[800px] mx-auto flex flex-col gap-12">
            <SectionHeading eyebrow="Peace of Mind" align="center">
              Adoption Support &amp; Guarantee
            </SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-grid-md">
              {[
                { icon: CheckCircle2, title: "Health Guarantee", desc: "Every dog is vaccinated, microchipped, and vet-checked before adoption. Full medical history provided." },
                { icon: RefreshCw, title: "30-Day Adjustment Period", desc: "If the match isn't right within 30 days, we will help find a better fit or welcome the dog back." },
                { icon: Shield, title: "Lifetime Support", desc: "All adopters get access to our behaviour helpline, training resources, and discounted veterinary care." },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="bg-background border border-border rounded-card p-6 flex flex-col items-center text-center gap-3 shadow-sm">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon size={22} className="text-primary" />
                    </div>
                    <h3 className="text-foreground font-bold text-base">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Section></Reveal>
      </main>
    </PageShell>
  );
}
