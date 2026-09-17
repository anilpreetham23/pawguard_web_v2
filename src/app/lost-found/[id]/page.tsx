import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CalendarDays, MapPin, PawPrint, Sparkles, Navigation, Phone, Mail } from "lucide-react";
import { fetchServerCachedLostFoundReportById } from "@/lib/api/server-public-data";
import { reportToCase } from "@/services/api/lost-found/mapper";
import { PageShell, Button } from "@/components/ui/pawguard";
import { BroadcastPanelIsland, MatchesPanelIsland } from "./LostFoundClientActionsIsland";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const report = await fetchServerCachedLostFoundReportById(id);
    if (!report) return { title: "Lost & Found Report — PawGuard" };
    const kindLabel = report.kind === "lost" ? "Lost" : "Found";
    const petName = "pet_name" in report ? report.pet_name : "Unidentified Pet";
    const breed = "breed" in report ? report.breed : report.breed_observed;
    const title = `${kindLabel} Pet Report: ${petName} (${breed || "Dog"}) — PawGuard`;
    const description = `${kindLabel} ${breed || "dog"} in ${report.location_address || "local area"}. Help reunite this pet!`;
    const image = report.photo_url || "/images/hero/hero-dog.jpg";
    return {
      title,
      description,
      openGraph: { title, description, images: [{ url: image }] },
      twitter: { card: "summary_large_image", title, description, images: [image] },
    };
  } catch {
    return { title: "Lost & Found Report — PawGuard" };
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const initialReport = await fetchServerCachedLostFoundReportById(id);

  const kindLabel = initialReport?.kind === "lost" ? "Lost Pet" : "Found Pet";
  const petName = initialReport ? ("pet_name" in initialReport ? initialReport.pet_name : "Unidentified Pet") : "Reported Animal";
  const breed = initialReport ? ("breed" in initialReport ? initialReport.breed : initialReport.breed_observed) || "Mix" : "Unknown Breed";
  const color = initialReport ? ("color" in initialReport ? initialReport.color : initialReport.color_observed) || "Not specified" : "Not specified";
  const location = initialReport?.location_address || "Local Area";
  const rawDate = initialReport ? ("lost_at" in initialReport ? initialReport.lost_at : initialReport.found_at) : undefined;
  const dateStr = rawDate ? new Date(rawDate).toLocaleDateString() : "Recent";
  const descriptionText: string = initialReport && "notes" in initialReport && typeof initialReport.notes === "string" ? initialReport.notes : "Help reunite this pet with their family.";
  const photoUrl = initialReport?.photo_url || "/images/hero/hero-dog.jpg";
  const contactPhone = initialReport?.user?.phone || null;

  const caseItem = initialReport ? reportToCase(initialReport) : {
    id,
    caseNumber: id.slice(0, 8),
    kind: "lost" as const,
    petName,
    animalType: "dog" as const,
    breed,
    age: "Unknown",
    gender: "unknown" as const,
    color,
    size: "medium" as const,
    distinctiveMarks: "None specified",
    condition: "unknown" as const,
    date: dateStr,
    time: "",
    location,
    reward: "$0",
    description: descriptionText,
    status: "active" as const,
    reporterName: "Verified Member",
    contactNumber: "",
    email: "",
    reportedAt: new Date().toISOString(),
    reportedDaysAgo: 0,
    timeline: [],
    tone: "amber" as const,
    emoji: "🐶",
    photosCount: 1,
    hasPhotos: true,
    hasVideo: false,
    imageUrls: [photoUrl],
    photoObjectKeys: [],
    videoObjectKey: null,
    latitude: null,
    longitude: null,
    userId: undefined,
  };

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(var(--header-height)+1.5rem)]">
          <Link
            href="/lost-found"
            className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-primary transition-colors duration-fast group"
          >
            <ArrowLeft size={15} className="transition-transform duration-fast group-hover:-translate-x-0.5" />
            Back to Lost &amp; Found
          </Link>

          <div className="py-8 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-stretch">
              {/* Server-Rendered Report Photo */}
              <div className="relative aspect-[4/5] rounded-img overflow-hidden shadow-lg border border-border bg-card">
                <Image
                  src={photoUrl}
                  alt={`${kindLabel}: ${petName}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute bottom-4 left-4 z-10">
                  <span className={`text-white text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-sm shadow-sm ${initialReport?.kind === "lost" ? "bg-destructive" : "bg-emerald-600"}`}>
                    {kindLabel}
                  </span>
                </div>
              </div>

              {/* Server-Rendered Details */}
              <div className="flex flex-col justify-center gap-8">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-primary text-xs font-semibold tracking-widest uppercase font-condensed">
                      Report #{id.slice(0, 8)}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-primary/30" />
                    <span className="text-muted-foreground text-xs font-semibold tracking-widest uppercase font-condensed">
                      {kindLabel}
                    </span>
                  </div>
                  <h1 className="font-serif font-bold text-4xl lg:text-5xl leading-none tracking-tight text-foreground">
                    {petName}
                  </h1>
                  <p className="text-muted-foreground text-lg leading-relaxed max-w-[520px]">
                    {descriptionText}
                  </p>
                </div>

                {/* Server-Rendered Facts Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-5 bg-card border border-border rounded-card">
                  <div className="flex flex-col gap-1.5">
                    <PawPrint size={15} className="text-primary/70" />
                    <span className="text-muted-foreground text-2xs font-semibold tracking-wider uppercase">Breed</span>
                    <span className="text-foreground text-sm font-semibold">{breed}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Sparkles size={15} className="text-primary/70" />
                    <span className="text-muted-foreground text-2xs font-semibold tracking-wider uppercase">Colour</span>
                    <span className="text-foreground text-sm font-semibold">{color}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <MapPin size={15} className="text-primary/70" />
                    <span className="text-muted-foreground text-2xs font-semibold tracking-wider uppercase">Location</span>
                    <span className="text-foreground text-sm font-semibold">{location}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <CalendarDays size={15} className="text-primary/70" />
                    <span className="text-muted-foreground text-2xs font-semibold tracking-wider uppercase">Date Reported</span>
                    <span className="text-foreground text-sm font-semibold">{dateStr}</span>
                  </div>
                </div>

                {contactPhone && (
                  <div className="flex flex-col gap-3 bg-card border border-border rounded-card p-5">
                    <p className="text-foreground font-semibold text-xs tracking-wider uppercase">Contact Reporter</p>
                    <a href={`tel:${contactPhone}`} className="flex items-center gap-2.5 text-muted-foreground text-sm hover:text-foreground transition-colors duration-fast">
                      <Phone size={15} className="shrink-0 text-primary" />
                      {contactPhone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Client Interactive Islands for Broadcast Alert & Matches */}
        <BroadcastPanelIsland caseItem={caseItem} />

        <MatchesPanelIsland reportId={id} kind={initialReport?.kind || "lost"} petName={petName} />

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-section-lg text-center">
          <div className="bg-card border border-border rounded-card p-10 flex flex-col items-center gap-4">
            <h2 className="font-serif font-bold text-2xl lg:text-3xl text-foreground">
              Recognize this animal?
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed max-w-[540px]">
              Matching and ownership claims surface automatically when a matching report is found nearby. Verified owners can submit proof directly through PawGuard.
            </p>
            <Button variant="primary" size="md" asLink={{ href: "/lost-found" }}>
              Browse More Reports
            </Button>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
