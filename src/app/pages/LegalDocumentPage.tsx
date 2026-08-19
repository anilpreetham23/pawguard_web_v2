"use client";

import Link from "next/link";
import PageHeader from "../components/PageHeader";
import { PageShell, Section, Card } from "../components/pawguard";
import { useApiQuery, QUERY_KEYS } from "@/lib/api";
import { communityService } from "@/services/api/community";

export type LegalDocType = "privacy" | "terms" | "adoption-agreement" | "data-usage";

const STATIC_DOCS: Record<LegalDocType, { title: string; subtitle: string; sections: Array<{ heading: string; body: string }> }> = {
  privacy: {
    title: "Privacy Policy",
    subtitle: "How PawGuard collects, protects, and manages your personal data and animal report details.",
    sections: [
      {
        heading: "1. Information We Collect",
        body: "We collect information you provide directly to us when registering an account, submitting an adoption application, reporting a lost/found pet, reporting a rescue emergency, or donating. This includes name, email, phone number, location address, and GPS coordinates."
      },
      {
        heading: "2. How We Use Information",
        body: "Your information is strictly used to process adoption applications, dispatch rescue teams, verify pet ownership, coordinate volunteer shifts, and process secure donations. We do not sell or monetize personal data."
      },
      {
        heading: "3. Location Data & Emergency Rescues",
        body: "GPS location data requested during emergency incident reports or Lost & Found filings is transmitted securely to verified rescue personnel and shelter staff to locate distress cases."
      },
      {
        heading: "4. Data Security & Retention",
        body: "We employ industry-standard encryption, SSL transmission, and access control policies to safeguard user profiles and transaction records."
      }
    ]
  },
  terms: {
    title: "Terms of Service",
    subtitle: "Terms and conditions governing the use of PawGuard public web platform and rescue services.",
    sections: [
      {
        heading: "1. Platform Usage",
        body: "By accessing PawGuard, you agree to submit truthful, accurate emergency rescue reports, adoption applications, and Lost & Found filings. Falsifying critical emergency distress reports is strictly prohibited."
      },
      {
        heading: "2. Adoption & Rescue Obligations",
        body: "Adoption applications are subject to background review, residential status verification, and shelter approval. PawGuard reserves the right to decline applications in the best interest of animal welfare."
      },
      {
        heading: "3. Volunteer & Community Code of Conduct",
        body: "Volunteers and community members participating in shelter shifts or emergency transport must comply with PawGuard safety protocols and local animal protection laws."
      }
    ]
  },
  "adoption-agreement": {
    title: "Standard Adoption Agreement",
    subtitle: "Terms and responsibilities governing animal adoptions through PawGuard shelter partners.",
    sections: [
      {
        heading: "1. Humane Care & Medical Treatment",
        body: "The adopter agrees to provide humane care, adequate food, shelter, exercise, annual vaccinations, and prompt veterinary treatment for the adopted dog."
      },
      {
        heading: "2. Microchipping & Safety Tag Identification",
        body: "The adopted dog must wear a PawGuard Safety Tag or microchip with current owner contact information at all times."
      },
      {
        heading: "3. Non-Transferability & Return Policy",
        body: "If the adopter is ever unable to care for the dog, the dog must be returned to PawGuard or an authorized shelter partner. The dog may not be abandoned, sold, or surrendered to an unauthorized facility."
      }
    ]
  },
  "data-usage": {
    title: "Data Usage & Transparency Policy",
    subtitle: "Our commitment to open transparency, public statistics, and responsible data handling.",
    sections: [
      {
        heading: "1. Public Impact Ledger",
        body: "PawGuard publishes aggregated, anonymized rescue statistics, adoption rates, and financial transparency figures to demonstrate open accountability."
      },
      {
        heading: "2. Third-Party Integrations",
        body: "We integrate with secure payment gateways for donations and map service providers for location dispatch. No user credentials or unencrypted data are shared."
      },
      {
        heading: "3. Access & Erasure Requests",
        body: "Users may request export or deletion of their account profile and history by contacting privacy@pawguard.org."
      }
    ]
  }
};

export default function LegalDocumentPage({ type }: { type: LegalDocType }) {
  const staticData = STATIC_DOCS[type];

  // Best-effort check if backend exposes dynamic legal document endpoint
  const { data: remoteDoc } = useApiQuery({
    queryKey: QUERY_KEYS.community.legalDoc(type),
    queryFn: () => communityService.getLegalDocumentBySlug(type),
    enabled: true,
  });

  const title = remoteDoc?.title || staticData.title;
  const subtitle = staticData.subtitle;

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <PageHeader
          eyebrow="Legal & Policy"
          title={title}
          subtitle={subtitle}
        />

        <Section bg="default">
          <div className="max-w-[800px] mx-auto flex flex-col gap-8">
            {remoteDoc?.body ? (
              <Card variant="default" className="p-6 text-foreground leading-relaxed whitespace-pre-line">
                {remoteDoc.body}
              </Card>
            ) : (
              staticData.sections.map((sec, i) => (
                <Card key={i} variant="default" className="p-6 flex flex-col gap-3">
                  <h2 className="font-serif font-bold text-xl text-foreground">
                    {sec.heading}
                  </h2>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                    {sec.body}
                  </p>
                </Card>
              ))
            )}

            <div className="border-t border-border pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
              <span>Last updated: October 2025</span>
              <div className="flex items-center gap-4">
                <Link href="/privacy" className="hover:text-primary underline">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-primary underline">Terms of Service</Link>
                <Link href="/adoption-agreement" className="hover:text-primary underline">Adoption Agreement</Link>
                <Link href="/data-usage" className="hover:text-primary underline">Data Usage</Link>
              </div>
            </div>
          </div>
        </Section>
      </main>
    </PageShell>
  );
}
