import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CalendarDays, CheckCircle2, Home, MapPin, PawPrint, Scale, Shield, Sparkles } from "lucide-react";
import { fetchServerCachedAdoptableDogBySlug } from "@/lib/api/server-public-data";
import { getAnimalBySlug } from "@/app/data/animals";
import { PageShell, Section, Card } from "@/components/ui/pawguard";
import SectionHeading from "@/layouts/SectionHeading";
import AdoptionFormIsland from "./AdoptionFormIsland";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const dog = await fetchServerCachedAdoptableDogBySlug(slug);
    if (!dog) {
      const mockAnimal = getAnimalBySlug(slug);
      if (mockAnimal) {
        return {
          title: `${mockAnimal.name} (${mockAnimal.breed}) — Adopt on PawGuard`,
          description: mockAnimal.desc,
        };
      }
      return { title: "Pet Detail — PawGuard" };
    }
    const title = `${dog.name} (${dog.breed || "Dog"}) — Adopt on PawGuard`;
    const description = dog.temperament || `Meet ${dog.name}, a ${dog.gender || ""} ${dog.breed || "dog"} looking for a loving home on PawGuard.`;
    const image = dog.photo_url || dog.image_url || "/images/hero/hero-dog.jpg";
    return {
      title,
      description,
      openGraph: { title, description, images: [{ url: image }] },
      twitter: { card: "summary_large_image", title, description, images: [image] },
    };
  } catch {
    return { title: "Adopt a Pet — PawGuard" };
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const initialDog = await fetchServerCachedAdoptableDogBySlug(slug);
  const mockAnimal = getAnimalBySlug(slug);

  const petName = initialDog?.name || mockAnimal?.name || "Rescue Pet";
  const breed = initialDog?.breed || mockAnimal?.breed || "Mix";
  const age = initialDog?.estimated_age || mockAnimal?.age || "Young";
  const size = mockAnimal?.size || "Medium";
  const weight = initialDog?.weight ? `${initialDog.weight} kg` : mockAnimal?.location || "Local Centre";
  const desc = initialDog?.temperament || mockAnimal?.desc || mockAnimal?.story || "Looking for a loving home.";
  const photoUrl = initialDog?.photo_url || initialDog?.image_url || mockAnimal?.img || "/images/hero/hero-dog.jpg";

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(var(--header-height)+1.5rem)]">
          <Link
            href="/adopt"
            className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-primary transition-colors duration-fast group"
          >
            <ArrowLeft size={15} className="transition-transform duration-fast group-hover:-translate-x-0.5" />
            Back to all dogs
          </Link>
        </div>

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-stretch">
            {/* Server-Rendered Hero Photo */}
            <div className="relative aspect-[4/5] rounded-img overflow-hidden shadow-lg border border-border bg-card">
              <Image
                src={photoUrl}
                alt={`${petName} — ${breed}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Server-Rendered Pet Profile Details */}
            <div className="flex flex-col justify-center gap-8">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-primary text-xs font-semibold tracking-widest uppercase font-condensed">
                    Dog Profile
                  </span>
                  <span className="w-2 h-2 rounded-full bg-primary/30" />
                  <span className="text-muted-foreground text-xs font-semibold tracking-widest uppercase font-condensed">
                    {breed}
                  </span>
                </div>
                <h1 className="font-serif font-bold text-5xl lg:text-6xl leading-none tracking-tight text-foreground">
                  {petName}
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-[520px]">
                  {desc}
                </p>
              </div>

              {/* Server-Rendered Facts Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-5 bg-card border border-border rounded-card">
                <div className="flex flex-col gap-1.5">
                  <CalendarDays size={15} className="text-primary/70" />
                  <span className="text-muted-foreground text-2xs font-semibold tracking-wider uppercase">Age</span>
                  <span className="text-foreground text-sm font-semibold">{age}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Scale size={15} className="text-primary/70" />
                  <span className="text-muted-foreground text-2xs font-semibold tracking-wider uppercase">Size</span>
                  <span className="text-foreground text-sm font-semibold">{size}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Home size={15} className="text-primary/70" />
                  <span className="text-muted-foreground text-2xs font-semibold tracking-wider uppercase">Weight / Location</span>
                  <span className="text-foreground text-sm font-semibold">{weight}</span>
                </div>
              </div>

              {/* Server-Rendered Verification Badges */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  <CheckCircle2 size={12} /> Vaccinated &amp; Vet-Checked
                </span>
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  <Shield size={12} /> Health Guarantee Included
                </span>
              </div>

              {/* Client Interactive Island for Application Wizard Modal */}
              <AdoptionFormIsland petName={petName} dogId={initialDog?.id || slug} />
            </div>
          </div>
        </div>

        {/* Server-Rendered Care & Background Section */}
        <Section bg="card">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-grid-md">
            {[
              { title: "Care & attention", desc: "A dedicated care plan covering feeding, exercise, and daily enrichment." },
              { title: "Responsible rehoming", desc: "Every adoption includes a full medical history and ongoing support." },
              { title: "Adjustment period", desc: "We support both of you for the first 30 days in your home." },
            ].map((c, i) => (
              <Card key={c.title} variant="elevated" className="gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Home size={16} className="text-primary" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-primary text-xs font-bold">0{i + 1}</span>
                  <p className="text-foreground font-semibold text-base leading-snug">{c.title}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{c.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </Section>
      </main>
    </PageShell>
  );
}
