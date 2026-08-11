"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Shield, RefreshCw } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import PageHeader from "../components/PageHeader";
import AdoptionCard from "../components/AdoptionCard";
import { PageShell, Section, Card, Reveal, StaggerGrid, StaggerItem, EmptyState } from "../components/pawguard";
import { ANIMALS } from "../data/animals";

const AGE_OPTIONS = ["Puppy", "Young", "Adult", "Senior"];
const SIZE_OPTIONS = ["Small", "Medium", "Large"];

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

export default function AdoptionPage() {
  const [selectedAge, setSelectedAge] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("default");

  function toggle(list: string[], value: string, setter: (v: string[]) => void) {
    setter(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  }

  const filtered = ANIMALS.filter((a) => {
    if (selectedAge.length && !selectedAge.includes(a.ageGroup)) return false;
    if (selectedSize.length && !selectedSize.includes(a.size)) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    const ageOrder = ["Puppy", "Young", "Adult", "Senior"];
    if (sortBy === "age") return ageOrder.indexOf(a.ageGroup) - ageOrder.indexOf(b.ageGroup);
    return 0;
  });

  const hasFilters = selectedAge.length > 0 || selectedSize.length > 0;

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <PageHeader
          eyebrow="Adoption"
          title="Find Your New Companion"
          subtitle="Every dog in our care has been assessed, vaccinated, and prepared for their permanent home."
        />

        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-section-md lg:py-section-lg">
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

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <aside className="lg:w-[240px] shrink-0">
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
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground text-sm">
                  <span className="font-semibold text-foreground">{filtered.length}</span> dogs available
                </p>
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

              {filtered.length === 0 ? (
                <EmptyState
                  title="No dogs match your filters"
                  description="Try adjusting your selection — every dog here is waiting for someone like you."
                  action={hasFilters ? { label: "Clear Filters", onClick() { setSelectedAge([]); setSelectedSize([]); } } : undefined}
                />
              ) : (
                <StaggerGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-grid-md">
                  {filtered.map((a) => (
                    <StaggerItem key={a.name}>
                      <AdoptionCard {...a} />
                    </StaggerItem>
                  ))}
                </StaggerGrid>
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
