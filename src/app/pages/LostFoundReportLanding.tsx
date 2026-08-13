"use client";

import Link from "next/link";
import { PawPrint, Search, ArrowRight } from "lucide-react";
import PageHeader from "../components/PageHeader";
import SectionHeading from "../components/SectionHeading";
import { PageShell, Section, Card, Reveal, Button } from "../components/pawguard";

const CHOICES = [
  {
    kind: "lost",
    title: "Report a Lost Pet",
    subtitle: "Has your companion gone missing? File a report so neighbours can help search.",
    href: "/lost-found/report/lost",
    emoji: "🐾",
  },
  {
    kind: "found",
    title: "Report a Found Animal",
    subtitle: "Found a roaming animal? File a report so their family can find them.",
    href: "/lost-found/report/found",
    emoji: "🏠",
  },
];

export default function LostFoundReportLanding() {
  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <PageHeader
          eyebrow="Lost & Found"
          title="Report a Missing or Found Companion"
          subtitle="Your report appears in the public Lost & Found directory, giving your community the details they need to help reunite."
        />

        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-section-md lg:py-section-lg">
          <Reveal>
            <SectionHeading eyebrow="Choose a Report Type">What would you like to report?</SectionHeading>
          </Reveal>

          <Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-grid-md mt-10">
              {CHOICES.map((choice) => (
                <Link
                  key={choice.kind}
                  href={choice.href}
                  className="group bg-card border border-border rounded-card p-[var(--space-8)] flex flex-col gap-[var(--space-6)] shadow-sm transition-all duration-gentle ease-gentle hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl">
                    <span aria-hidden="true">{choice.emoji}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-foreground font-serif font-bold text-2xl leading-tight">{choice.title}</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">{choice.subtitle}</p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-primary text-xs font-semibold tracking-wider uppercase font-condensed">
                    Start Report
                    <ArrowRight size={15} className="transition-transform duration-fast group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <Section bg="card">
              <div className="max-w-[720px] mx-auto flex flex-col items-center gap-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Search size={22} className="text-primary" />
                </div>
                <SectionHeading eyebrow="Prefer to look first?" align="center">
                  Browse Existing Reports
                </SectionHeading>
                <p className="text-muted-foreground text-base leading-relaxed max-w-[520px] -mt-4">
                  Your companion or a found animal they might know could already be listed. 
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" size="md" asLink={{ href: "/lost-found" }}>
                    <PawPrint size={15} />
                    Go to Lost &amp; Found
                  </Button>
                </div>
              </div>
            </Section>
          </Reveal>
        </div>
      </main>
    </PageShell>
  );
}