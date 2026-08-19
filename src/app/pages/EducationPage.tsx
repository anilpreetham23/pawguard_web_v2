"use client";

import Link from "next/link";
import { BookOpen, ShieldCheck, Heart, Stethoscope, AlertTriangle, ArrowRight } from "lucide-react";
import PageHeader from "../components/PageHeader";
import SectionHeading from "../components/SectionHeading";
import { PageShell, Section, Card, Reveal, StaggerGrid, StaggerItem, Button } from "../components/pawguard";

export const GUIDES = [
  {
    slug: "responsible-pet-ownership",
    title: "Responsible Pet Ownership Guide",
    category: "Pet Care",
    icon: Heart,
    readTime: "5 min read",
    summary: "Essential guidelines for daily feeding, exercise, microchipping, grooming, and providing a lifelong loving home.",
    description: "Bringing a rescue pet into your home is a rewarding, multi-year commitment. Learn the core principles of feeding, exercise, vaccination, and emotional care.",
    sections: [
      {
        heading: "1. Nutrition & Fresh Water",
        content: "Provide balanced commercial or vet-approved meals tailored to your dog's age, weight, and activity level. Clean, fresh water should always be accessible."
      },
      {
        heading: "2. Daily Exercise & Enrichment",
        content: "Dogs require at least 30–60 minutes of daily physical exercise and mental stimulation to prevent anxiety and behavioral issues."
      },
      {
        heading: "3. Microchipping & Safety Tags",
        content: "Always keep a PawGuard Safety Tag or microchip up-to-date with your current phone number and address so lost pets can be reunited swiftly."
      }
    ]
  },
  {
    slug: "vaccination-guide",
    title: "Core Dog Vaccination Schedule",
    category: "Health & Vet",
    icon: Stethoscope,
    readTime: "6 min read",
    summary: "Understand Rabies, DHPP, Parvovirus, and annual booster requirements to keep your dog immune and healthy.",
    description: "Vaccinations protect your rescue dog and the broader community against fatal diseases. Here is the standard veterinary immunization timeline.",
    sections: [
      {
        heading: "Core Vaccines",
        content: "Rabies and DHPP (Distemper, Hepatitis, Parainfluenza, Parvovirus) are mandatory for all rescue and companion dogs."
      },
      {
        heading: "Puppy Schedule",
        content: "Puppies receive initial doses starting at 6–8 weeks, followed by booster shots every 3–4 weeks until 16 weeks of age."
      },
      {
        heading: "Annual Boosters",
        content: "Adult dogs require annual or triennial booster shots based on local veterinary regulations and risk exposure."
      }
    ]
  },
  {
    slug: "stray-rescue-safety",
    title: "Emergency Stray Rescue & Safety Protocols",
    category: "Rescue Awareness",
    icon: AlertTriangle,
    readTime: "4 min read",
    summary: "How to safely approach, secure, and report an injured or panicked stray dog in immediate distress.",
    description: "Rescuing a stray dog requires caution for both your safety and the animal's wellbeing. Follow these emergency steps when spotting a dog in distress.",
    sections: [
      {
        heading: "1. Assess Body Language",
        content: "Look for signs of fear or aggression: growling, bared teeth, tucked tail, or raised hackles. Avoid direct eye contact or sudden movements."
      },
      {
        heading: "2. Secure the Area",
        content: "If the animal is near traffic, alert drivers or block off the lane safely. Never put yourself in physical danger on highways."
      },
      {
        heading: "3. Submit an Emergency Incident Report",
        content: "Use the PawGuard Emergency Dispatch tool to submit real-time GPS coordinates, photos, and physical conditions so specialized rescue teams can deploy."
      }
    ]
  },
  {
    slug: "pet-first-aid",
    title: "Pet First Aid & Emergency Response",
    category: "First Aid",
    icon: ShieldCheck,
    readTime: "7 min read",
    summary: "First aid procedures for heatstroke, bleeding, poisoning, and transporting an injured dog to a emergency clinic.",
    description: "Knowing immediate first aid can save a dog's life before professional veterinary help arrives.",
    sections: [
      {
        heading: "Heatstroke Response",
        content: "Move the dog to shade immediately, apply cool (not ice-cold) water to footpads and abdomen, and offer small sips of water."
      },
      {
        heading: "Wound & Bleeding Care",
        content: "Apply firm, direct pressure with a clean cloth or gauze. Keep the dog calm and transport immediately to a veterinary partner facility."
      }
    ]
  },
  {
    slug: "adoption-preparation",
    title: "Preparing Your Home for a Rescue Dog",
    category: "Adoption",
    icon: BookOpen,
    readTime: "5 min read",
    summary: "The 3-3-3 rule, puppy-proofing, essential supplies, and helping a rescue dog acclimate peacefully.",
    description: "The 3-3-3 rule outlines what to expect during the first 3 days, 3 weeks, and 3 months after bringing your adopted rescue pet home.",
    sections: [
      {
        heading: "First 3 Days: Decompression",
        content: "The dog may feel overwhelmed or quiet. Provide a safe, quiet space with a bed, crate, and low-stress routine."
      },
      {
        heading: "First 3 Weeks: Building Routine",
        content: "The dog begins feeling comfortable and showing personality traits. Establish consistent feeding, potty, and walking schedules."
      },
      {
        heading: "First 3 Months: Complete Trust",
        content: "Your rescue dog builds true trust, bonding deeply with family members and feeling fully secure in their forever home."
      }
    ]
  }
];

export default function EducationPage() {
  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <PageHeader
          eyebrow="Knowledge & Awareness"
          title="Pet Care & Animal Rescue Guides"
          subtitle="Resource guides on responsible ownership, veterinary health, stray rescue safety, and emergency pet care."
        />

        <Section bg="default">
          <div className="max-w-[1280px] mx-auto flex flex-col gap-10">
            <StaggerGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {GUIDES.map((guide) => {
                const Icon = guide.icon;
                return (
                  <StaggerItem key={guide.slug}>
                    <Card variant="default" className="h-full flex flex-col p-6 hover:border-primary/40 transition-all duration-fast group">
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <Icon size={20} />
                        </span>
                        <span className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground font-condensed">
                          {guide.readTime}
                        </span>
                      </div>

                      <span className="text-2xs font-bold uppercase tracking-wider text-primary font-condensed mb-1">
                        {guide.category}
                      </span>
                      <h2 className="font-serif font-bold text-xl text-foreground group-hover:text-primary transition-colors mb-2">
                        {guide.title}
                      </h2>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                        {guide.summary}
                      </p>

                      <Link
                        href={`/education/${guide.slug}`}
                        className="inline-flex items-center gap-1.5 text-primary font-semibold text-sm hover:underline mt-auto"
                      >
                        Read Full Guide
                        <ArrowRight size={15} />
                      </Link>
                    </Card>
                  </StaggerItem>
                );
              })}
            </StaggerGrid>
          </div>
        </Section>
      </main>
    </PageShell>
  );
}
