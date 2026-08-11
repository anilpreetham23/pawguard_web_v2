"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Home,
  MapPin,
  PawPrint,
  Ruler,
  Scale,
  Shield,
  CheckCircle2,
  Heart,
  Sparkles,
} from "lucide-react";
import { PageShell, Section, Card, Reveal, Button, Input, EmptyState, SuccessState } from "../components/pawguard";
import SectionHeading from "../components/SectionHeading";
import AdoptionCard from "../components/AdoptionCard";
import { StaggerGrid, StaggerItem } from "../components/pawguard";
import { InteractiveImage } from "../../motion/components/InteractiveImage";
import { cn } from "../components/ui/utils";
import { getAnimalBySlug, ANIMALS } from "../data/animals";

const energyLabels: Record<string, string> = {
  Low: "Easy-going",
  Medium: "Balanced",
  High: "High energy",
};

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof PawPrint;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon size={16} className="text-primary" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-muted-foreground text-2xs font-semibold tracking-wider uppercase font-condensed">
          {label}
        </span>
        <span className="text-foreground font-semibold text-sm truncate">{value}</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: "available" | "pending" | "adopted" }) {
  const map = {
    available: { label: "Available", cls: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" },
    pending: { label: "Application pending", cls: "bg-amber-500/10 text-amber-700 border-amber-500/20" },
    adopted: { label: "Adopted", cls: "bg-muted text-muted-foreground border-border" },
  } as const;
  const s = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1.5 text-2xs font-semibold tracking-wider uppercase rounded-full border",
        s.cls,
      )}
    >
      {s.label}
    </span>
  );
}

export default function AnimalDetailPage({ slug }: { slug?: string }) {
  const animal = getAnimalBySlug(slug ?? "");

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [favourite, setFavourite] = useState(false);

  if (!animal) {
    return (
      <PageShell>
        <main
          id="main-content"
          className="flex-1 flex items-center justify-center px-6 pt-[var(--header-height)]"
        >
          <EmptyState
            icon="search"
            title="We couldn't find that dog"
            description="The profile may have been adopted or moved. Browse our currently available dogs."
            action={{ label: "Browse available dogs", to: "/adopt" }}
          />
        </main>
      </PageShell>
    );
  }

  const isAvailable = animal.status === "available";
  const related = ANIMALS.filter((a) => a.slug !== animal.slug && a.status === "available").slice(0, 3);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting || !isAvailable) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
  }

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        {/* ── Breadcrumb + back ─────────────────────────────────────────── */}
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pt-[calc(var(--header-height)+1.5rem)]">
          <Link
            href="/adopt"
            className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-primary transition-colors duration-fast group"
          >
            <ArrowLeft size={15} className="transition-transform duration-fast group-hover:-translate-x-0.5" />
            Back to all dogs
          </Link>
        </div>

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-8 lg:py-12">
          <Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-stretch">
              {/* Image */}
              <div className="relative">
                <InteractiveImage
                  src={animal.img}
                  alt={`${animal.name} — ${animal.breed}, ${animal.age}, ${animal.gender}`}
                  variant="hero"
                  aspectRatio="4/5"
                  className="rounded-img shadow-lg"
                  overlay={
                    <div className="absolute bottom-0 left-0 right-0 p-5 flex items-center justify-between">
                      <StatusBadge status={animal.status} />
                      <button
                        onClick={() => setFavourite((v) => !v)}
                        aria-label={favourite ? "Remove from favourites" : "Add to favourites"}
                        className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:bg-white transition-colors duration-fast"
                      >
                        <Heart
                          size={18}
                          className={cn(
                            "transition-colors duration-fast",
                            favourite ? "text-destructive fill-destructive" : "text-foreground",
                          )}
                        />
                      </button>
                    </div>
                  }
                />
              </div>

              {/* Identity + story */}
              <div className="flex flex-col justify-center gap-8">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-primary text-xs font-semibold tracking-widest uppercase font-condensed">
                      {animal.species}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-primary/30" />
                    <span className="text-muted-foreground text-xs font-semibold tracking-widest uppercase font-condensed">
                      {animal.breed}
                    </span>
                  </div>
                  <h1 className="font-serif font-bold text-5xl lg:text-6xl leading-none tracking-tight text-foreground">
                    {animal.name}
                  </h1>
                  <p className="text-muted-foreground text-lg leading-relaxed max-w-[520px]">
                    {animal.desc}
                  </p>
                </div>

                {/* Facts grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-5 bg-card border border-border rounded-card">
                  <Fact icon={CalendarDays} label="Age" value={animal.age} />
                  <Fact icon={Scale} label="Size" value={animal.size} />
                  <Fact icon={MapPin} label="Location" value={animal.location} />
                  <Fact icon={PawPrint} label="Temperament" value={animal.temperament} />
                  <Fact icon={Ruler} label="Good with" value={animal.goodWith.slice(0, 2).join(", ")} />
                  <Fact icon={Sparkles} label="Energy" value={energyLabels[animal.energy]} />
                </div>

                {/* Health chips */}
                <div className="flex flex-wrap gap-2">
                  {animal.vaccinated && (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      <CheckCircle2 size={12} /> Vaccinated
                    </span>
                  )}
                  {animal.microchipped && (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      <Shield size={12} /> Microchipped
                    </span>
                  )}
                  {animal.urgent && (
                    <span className="inline-flex items-center gap-1.5 bg-destructive/10 text-destructive text-xs font-semibold px-2.5 py-1 rounded-full">
                      Urgent — needs a home fast
                    </span>
                  )}
                </div>

                {/* Apply CTA */}
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Your name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Full name"
                        required
                      />
                      <Input
                        label="Email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Phone (optional)"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="(555) 000-0000"
                      />
                      <Button
                        variant={isAvailable ? "primary" : "outline"}
                        size="lg"
                        type="submit"
                        isLoading={submitting}
                        context="adoption_apply"
                        disabled={!isAvailable}
                      >
                        {isAvailable ? <>Apply to adopt {animal.name}</> : <>Already adopted</>}
                      </Button>
                    </div>
                    {!isAvailable && (
                      <p className="text-muted-foreground text-xs">
                        This dog is <strong className="text-foreground">{animal.status === "pending" ? "currently being processed" : "already in a forever home"}</strong>. Applications are paused.
                      </p>
                    )}
                  </form>
                ) : (
                  <SuccessState
                    icon={Heart}
                    title={`Application received for ${animal.name}`}
                    description="Our adoption team will review your details and get back to you within 2 business days to arrange a meet & greet."
                    impact={{
                      value: `${animal.name}`,
                      label: "We'll personally review your application against this profile",
                    }}
                    action={{ label: "Browse more dogs", to: "/adopt" }}
                    secondaryAction={{ label: "Contact us", to: "/contact" }}
                  />
                )}
              </div>
            </div>
          </Reveal>
        </div>

        {/* ── Story ─────────────────────────────────────────────────────── */}
        <Reveal>
          <Section>
            <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-10 lg:gap-16">
              <div className="flex flex-col gap-6">
                <SectionHeading eyebrow="Their story">
                  How {animal.name} came to PawGuard
                </SectionHeading>
                <p className="text-foreground text-lg leading-relaxed">{animal.story}</p>
              </div>

              <div className="flex flex-col gap-5">
                <SectionHeading eyebrow="A good match for" as="h3">
                  Who {animal.name} suits best
                </SectionHeading>
                <ul className="flex flex-col gap-3">
                  {animal.goodWith.map((g) => (
                    <li key={g} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={13} className="text-primary" />
                      </span>
                      <span className="text-foreground text-base">{g}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>
        </Reveal>

        {/* ── Care needs ─────────────────────────────────────────────────── */}
        <Reveal>
          <Section bg="card">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-grid-md">
              {animal.care.map((c, i) => (
                <Card key={c} variant="elevated" className="gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Home size={16} className="text-primary" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="font-mono text-primary text-xs font-bold">0{i + 1}</span>
                    <p className="text-foreground font-semibold text-base leading-snug">{c}</p>
                  </div>
                </Card>
              ))}
            </div>
          </Section>
        </Reveal>

        {/* ── More animals ──────────────────────────────────────────────── */}
        {related.length > 0 && (
          <Reveal>
            <Section>
              <div className="flex flex-col gap-8">
                <SectionHeading eyebrow="Still looking">
                  Meet more dogs waiting for a home
                </SectionHeading>
                <StaggerGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-grid-md">
                  {related.map((a) => (
                    <StaggerItem key={a.slug}>
                      <AdoptionCard {...a} />
                    </StaggerItem>
                  ))}
                </StaggerGrid>
              </div>
            </Section>
          </Reveal>
        )}
      </main>
    </PageShell>
  );
}