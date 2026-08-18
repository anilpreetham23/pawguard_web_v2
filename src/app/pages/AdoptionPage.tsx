"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Shield, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import PageHeader from "../components/PageHeader";
import AdoptionCard from "../components/AdoptionCard";
import { PageShell, Section, Card, Reveal, StaggerGrid, StaggerItem, EmptyState, Skeleton, Alert } from "../components/pawguard";
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
  const { data: pets = [], isLoading, isError, error, refetch } = useAdoptionPets();

  const [selectedAge, setSelectedAge] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("default");
  const [page, setPage] = useState(1);

  function toggle(list: string[], value: string, setter: (v: string[]) => void) {
    setter(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  }

  const filtered = pets.filter((pet) => {
    if (selectedAge.length && !selectedAge.includes(AGE_LABEL[pet.ageGroup])) return false;
    if (selectedSize.length && !selectedSize.includes(SIZE_LABEL[pet.size])) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "age") return AGE_ORDER[a.ageGroup] - AGE_ORDER[b.ageGroup];
    return 0;
  });

  const hasFilters = selectedAge.length > 0 || selectedSize.length > 0;

  // Reset to first page whenever any filter, search, or sort changes
  useEffect(() => {
    setPage(1);
  }, [selectedAge, selectedSize, sortBy]);

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

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-section-md lg:py-section-lg">
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

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
            {/* Desktop Filter Sidebar */}
            <aside className="hidden lg:block lg:w-[240px] shrink-0">
              <Card className="sticky top-[88px]">
                <div className="flex items-center justify-between">
                  <h3 className="text-foreground font-semibold text-xs tracking-wider uppercase">Filters</h3>
                  {hasFilters && (
                    <button
                      onClick={() => { setSelectedAge([]); setSelectedSize([]); }}
                      className="text-destructive text-xs font-semibold hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <fieldset className="flex flex-col gap-3 border-0 p-0 m-0">
                  <legend className="text-muted-foreground text-xs font-semibold tracking-wider uppercase mb-0">Age</legend>
                  {AGE_OPTIONS.map((opt) => (
                    <FilterCheckbox key={opt} label={opt} checked={selectedAge.includes(opt)} onChange={() => toggle(selectedAge, opt, setSelectedAge)} />
                  ))}
                </fieldset>
                <div className="h-px bg-border" />
                <fieldset className="flex flex-col gap-3 border-0 p-0 m-0">
                  <legend className="text-muted-foreground text-xs font-semibold tracking-wider uppercase mb-0">Size</legend>
                  {SIZE_OPTIONS.map((opt) => (
                    <FilterCheckbox key={opt} label={opt} checked={selectedSize.includes(opt)} onChange={() => toggle(selectedSize, opt, setSelectedSize)} />
                  ))}
                </fieldset>
              </Card>
            </aside>

            <div className="flex-1 min-w-0">
              {/* Compact Mobile Filters [ Age ▼ ] [ Size ▼ ] [ Sort ▼ ] */}
              <div className="lg:hidden flex flex-wrap items-center gap-2 mb-4">
                <select
                  value={selectedAge[0] || ""}
                  onChange={(e) => setSelectedAge(e.target.value ? [e.target.value] : [])}
                  aria-label="Filter by age"
                  className="flex-1 min-w-[90px] bg-background border border-border rounded-btn px-2.5 py-2 text-xs font-medium text-foreground focus:outline-none focus:border-primary transition-all"
                >
                  <option value="">Age: All</option>
                  {AGE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>Age: {opt}</option>
                  ))}
                </select>

                <select
                  value={selectedSize[0] || ""}
                  onChange={(e) => setSelectedSize(e.target.value ? [e.target.value] : [])}
                  aria-label="Filter by size"
                  className="flex-1 min-w-[90px] bg-background border border-border rounded-btn px-2.5 py-2 text-xs font-medium text-foreground focus:outline-none focus:border-primary transition-all"
                >
                  <option value="">Size: All</option>
                  {SIZE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>Size: {opt}</option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort dogs by"
                  className="flex-1 min-w-[100px] bg-background border border-border rounded-btn px-2.5 py-2 text-xs font-medium text-foreground focus:outline-none focus:border-primary transition-all"
                >
                  <option value="default">Sort: Default</option>
                  <option value="name">Sort: Name A-Z</option>
                  <option value="age">Sort: Age</option>
                </select>

                {hasFilters && (
                  <button
                    onClick={() => { setSelectedAge([]); setSelectedSize([]); }}
                    className="text-destructive text-xs font-semibold px-2 py-1 hover:underline shrink-0"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <p className="text-muted-foreground text-xs sm:text-sm">
                  <span className="font-semibold text-foreground">{isLoading ? "…" : filtered.length}</span> dogs available
                </p>
                <div className="hidden lg:block">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="Sort dogs by"
                    className="bg-background border border-border rounded-btn px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-standard"
                  >
                    <option value="default">Default</option>
                    <option value="name">Name A-Z</option>
                    <option value="age">Age (Youngest)</option>
                  </select>
                </div>
              </div>

              {isLoading ? (
                <StaggerGrid key={`skeleton-${currentPage}-${selectedAge.join(",")}-${selectedSize.join(",")}-${sortBy}`} className="grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-grid-md">
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
                <StaggerGrid key={`${currentPage}-${selectedAge.join(",")}-${selectedSize.join(",")}-${sortBy}`} className="grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-grid-md">
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
          </div>
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
