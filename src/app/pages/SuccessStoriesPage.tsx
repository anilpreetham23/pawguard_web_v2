"use client";

import Link from "next/link";
import StoryCard from "../components/StoryCard";
import { ArrowRight } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { PageShell, Section, Button, Reveal, StaggerGrid, StaggerItem } from "../components/pawguard";

import { Quote } from "lucide-react";

const FEATURED = {
  title: "From the Streets of Millbrook to His Forever Home",
  animal: "Bruno — Golden Retriever Mix",
  type: "Bruno — Golden Retriever Mix · March 2024",
  date: "March 2024",
  excerpt: "Bruno was found severely malnourished and unable to walk following a road accident near the Millbrook interchange. PawGuard's emergency team reached the scene in under 12 minutes.",
  quote: "The gentlest, most grateful dog we've ever known.",
  img: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=500&fit=crop&auto=format",
  adopter: "Helena & Stefan Lindqvist",
  timeline: [
    { date: "March 12", event: "Found near Millbrook interchange. Emergency team dispatched." },
    { date: "March 12", event: "Rescued and transported to emergency veterinary clinic." },
    { date: "March 14", event: "Surgery performed for road accident injuries." },
    { date: "March 28", event: "Transferred to foster care for rehabilitation." },
    { date: "April 22", event: "Formally adopted by the Lindqvist family." },
  ],
};

const STORIES = [
  { animal: "Mochi", type: "Dog · Rescued June 2023", headline: "Tiny Survivor, Giant Spirit", excerpt: "Mochi was trapped in a collapsed building following storm damage. Three days later, she was reunited with her new family.", img: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=280&fit=crop&auto=format", adopter: "The Nakamura Family" },
  { animal: "Rex", type: "Dog · Rescued January 2024", headline: "Second Chances Work", excerpt: "Rex had been returned to three shelters before PawGuard's behavioural team discovered he needed a quiet, single-adult household.", img: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=280&fit=crop&auto=format", adopter: "Philip Adeyemi" },
  { animal: "Willow", type: "Dog · Rescued September 2023", headline: "A Foster Stay That Became Forever", excerpt: "Willow came in as a foster placement for two weeks. Six months later, her foster family couldn't imagine life without her.", img: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=280&fit=crop&auto=format", adopter: "The Okafor Family" },
  { animal: "Cleo", type: "Dog · Rescued August 2023", headline: "From Fearful to Family", excerpt: "Cleo arrived cowering and terrified. Eight weeks of careful socialisation later, she was curled up beside her new family at the adoption event.", img: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400&h=280&fit=crop&auto=format", adopter: "Emma Torres" },
  { animal: "Scout", type: "Dog · Rescued October 2023", headline: "Built for the Outdoors", excerpt: "Scout was rescued from a hoarding situation. His boundless energy found its match in a hiking-obsessed couple from Ashford.", img: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400&h=280&fit=crop&auto=format", adopter: "Marie & Leo Dubois" },
  { animal: "Nala", type: "Dog · Rescued April 2024", headline: "The Office Dog Who Wasn't", excerpt: "Nala was surrendered when her owner relocated. Two weeks at PawGuard, and she walked straight into the arms of her new family.", img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=280&fit=crop&auto=format", adopter: "James & Priya Mehta" },
];

export default function SuccessStoriesPage() {
  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <PageHeader
          eyebrow="Happy Tails"
          title="Success Stories"
          subtitle="Every number in our reports is a name. A personality. A family changed forever. These are their stories."
        />

        <Reveal><Section bg="card">
          <div className="max-w-[1280px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--space-12)] lg:gap-[var(--space-16)]">
              <div className="lg:col-span-7 relative aspect-[4/3] lg:aspect-[7/5] bg-secondary rounded-img overflow-hidden shadow-lg group">
                <img
                  src={FEATURED.img}
                  alt={FEATURED.title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-gentle ease-out will-change-transform"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white/80 text-xs font-semibold tracking-widest uppercase font-condensed mb-1">Featured Story</p>
                  <p className="text-white/70 text-sm">{FEATURED.type}</p>
                </div>
              </div>
              <div className="lg:col-span-5 flex flex-col justify-center gap-8">
                <div className="flex flex-col gap-4">
                  <h2 className="text-foreground font-serif font-bold text-2xl lg:text-3xl leading-tight tracking-tight">
                    {FEATURED.title}
                  </h2>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    {FEATURED.excerpt}
                  </p>
                </div>
                <div className="bg-background border border-border rounded-card p-6 relative">
                  <Quote size={18} className="text-primary/20 absolute top-4 right-4" />
                  <p className="text-foreground font-serif italic text-lg leading-relaxed">
                    &ldquo;{FEATURED.quote}&rdquo;
                  </p>
                  <p className="text-muted-foreground text-sm font-semibold mt-3">
                    — {FEATURED.adopter}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-foreground text-xs font-semibold tracking-wider uppercase font-condensed">Rescue Timeline</p>
                  <div className="flex flex-col gap-2.5">
                    {FEATURED.timeline.map((t, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="flex flex-col items-center gap-0.5">
                          <div className={`w-2.5 h-2.5 rounded-full ${i === 0 ? "bg-emergency" : i === FEATURED.timeline.length - 1 ? "bg-primary" : "bg-border"}`} />
                          {i < FEATURED.timeline.length - 1 && <div className="w-px h-5 bg-border" />}
                        </div>
                        <div className="flex flex-col gap-0.5 pb-2">
                          <span className="text-muted-foreground text-xs font-mono">{t.date}</span>
                          <span className="text-foreground text-sm">{t.event}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section></Reveal>

        <Reveal><Section bg="default">
          <div className="flex flex-col gap-12">
            <h2 className="text-foreground font-serif font-bold text-2xl lg:text-3xl leading-tight tracking-tight">More Happy Tails</h2>
            <StaggerGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-grid-md">
              {STORIES.map((s) => (
                <StaggerItem key={s.animal}>
                  <StoryCard {...s} />
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </Section></Reveal>

        <Reveal><Section bg="card" containerWidth="narrow">
          <div className="text-center flex flex-col gap-6 items-center">
            <h2 className="text-foreground font-serif font-bold text-3xl lg:text-4xl leading-tight tracking-tight">Have a story to share?</h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              If you adopted through PawGuard and would like to share your experience, we would love to hear from you. Your story may inspire another family.
            </p>
            <Button variant="secondary" size="md" asLink={{ href: "/contact" }}>
              Share Your Story <ArrowRight size={14} />
            </Button>
          </div>
        </Section></Reveal>

        <Reveal><Section bg="default">
          <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-foreground font-serif font-bold text-xl lg:text-2xl">Ready to write your own story?</h2>
              <p className="text-muted-foreground text-base">Browse dogs currently available for adoption.</p>
            </div>
            <Button variant="primary" size="md" asLink={{ href: "/adopt" }}>
              Browse Dogs
            </Button>
          </div>
        </Section></Reveal>
      </main>
    </PageShell>
  );
}
