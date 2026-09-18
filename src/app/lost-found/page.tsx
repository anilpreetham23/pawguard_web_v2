import type { Metadata } from "next";
import Link from "next/link";
import { Plus, ShieldAlert, Sparkles, MapPin } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import SectionHeading from "@/layouts/SectionHeading";
import { PageShell, Section, Button } from "@/components/ui/pawguard";
import { fetchServerCachedLostFoundReports } from "@/lib/api/server-public-data";
import LostFoundClientIsland from "./LostFoundClientIsland";

export const metadata: Metadata = {
  title: "Lost & Found Pets Directory — PawGuard",
  description: "Report lost dogs, submit sighting alerts, and help reunite pets with families in your community.",
};

export default async function Page() {
  const initialReports = await fetchServerCachedLostFoundReports();

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <PageHeader
          eyebrow="Community Directory"
          title="Lost &amp; Found Pets"
          subtitle="Report missing dogs, submit sighting alerts, and help reunite animals with their families."
        />

        <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-section-md lg:py-section-lg">
          {/* Server-Rendered Process Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-grid-md lg:gap-grid-lg mb-12 pb-12 border-b border-border">
            <div className="flex flex-col gap-3 p-6 bg-card border border-border rounded-card">
              <div className="w-10 h-10 bg-amber-500/10 text-amber-600 rounded-lg flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-foreground font-bold text-lg">File a Report</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Submit a lost or found pet report with photos, last seen location, and pet details.
              </p>
              <div className="flex gap-2 mt-2">
                <Link href="/lost-found/report/lost" className="text-xs font-semibold text-primary hover:underline">
                  Report Lost →
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link href="/lost-found/report/found" className="text-xs font-semibold text-emerald-600 hover:underline">
                  Report Found →
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-3 p-6 bg-card border border-border rounded-card">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-foreground font-bold text-lg">Instant Matching</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Our automated engine compares lost and found profiles by breed, color, location, and distance.
              </p>
            </div>

            <div className="flex flex-col gap-3 p-6 bg-card border border-border rounded-card">
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 rounded-lg flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-foreground font-bold text-lg">Verified Reunion</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Reporters and owners connect directly via secure contact channels to verify ownership and reunite pets.
              </p>
            </div>
          </div>

          {/* Client Interactive Island for Tabs, Search, Filter, and Grid */}
          <LostFoundClientIsland initialReports={initialReports} />
        </div>
      </main>
    </PageShell>
  );
}
