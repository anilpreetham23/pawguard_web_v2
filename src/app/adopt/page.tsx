import type { Metadata } from "next";
import { CheckCircle2, RefreshCw, Shield } from "lucide-react";
import { fetchServerCachedAdoptableDogs } from "@/lib/api/server-public-data";
import PageHeader from "@/components/shared/PageHeader";
import SectionHeading from "@/layouts/SectionHeading";
import { PageShell, Section, PawGuardInfoCard, type InfoCardVisualType } from "@/components/ui/pawguard";
import AdoptionClientIsland from "./AdoptionClientIsland";

export const metadata: Metadata = {
  title: "Adopt a Pet — PawGuard",
  description: "Browse verified rescue dogs available for adoption on PawGuard.",
};

export default async function Page() {
  const initialDogs = await fetchServerCachedAdoptableDogs();

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <PageHeader
          eyebrow="Adoption"
          title="Find Your New Companion"
          subtitle="Every dog in our care has been assessed, vaccinated, and prepared for their permanent home."
        />

        <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-section-md lg:py-section-lg">
          {/* Server-Rendered Process Overview */}
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

          {/* Client Interactive Island for Search, Filter, and Grid */}
          <AdoptionClientIsland initialDogs={initialDogs} />
        </div>

        {/* Server-Rendered Peace of Mind Section */}
        <Section bg="card">
          <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto flex flex-col gap-10 sm:gap-12">
            <SectionHeading eyebrow="Peace of Mind" align="center">
              Adoption Support &amp; Guarantee
            </SectionHeading>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
              {[
                {
                  icon: <CheckCircle2 size={22} className="shrink-0" />,
                  title: "Health Guarantee",
                  desc: "Every dog is vaccinated, microchipped, and vet-checked before adoption. Full medical history provided.",
                  visualType: "health-guarantee" as InfoCardVisualType,
                  accentVariant: "emerald" as const,
                  badgeText: "100% Verified",
                },
                {
                  icon: <RefreshCw size={22} className="shrink-0" />,
                  title: "30-Day Adjustment Period",
                  desc: "If the match isn't right within 30 days, we will help find a better fit or welcome the dog back.",
                  visualType: "adjustment-period" as InfoCardVisualType,
                  accentVariant: "blue" as const,
                  badgeText: "Flexible Match",
                },
                {
                  icon: <Shield size={22} className="shrink-0" />,
                  title: "Lifetime Support",
                  desc: "All adopters get access to our behaviour helpline, training resources, and discounted veterinary care.",
                  visualType: "lifetime-support" as InfoCardVisualType,
                  accentVariant: "indigo" as const,
                  badgeText: "Always Here",
                },
              ].map((item) => (
                <PawGuardInfoCard
                  key={item.title}
                  icon={item.icon}
                  title={item.title}
                  desc={item.desc}
                  visualType={item.visualType}
                  accentVariant={item.accentVariant}
                  badgeText={item.badgeText}
                />
              ))}
            </div>
          </div>
        </Section>
      </main>
    </PageShell>
  );
}
