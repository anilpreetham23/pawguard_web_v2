import Link from "next/link";
import { BookOpen, ShieldCheck, Heart, Stethoscope, AlertTriangle, ArrowRight } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { PageShell, Section, Card, Reveal, StaggerGrid, StaggerItem, Button } from "@/components/ui/pawguard";
import { fetchServerCachedBlogPosts } from "@/lib/api/server-public-data";
import type { BlogPostResponse } from "@/lib/api/types";

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
    readTime: "4 min read",
    summary: "Understanding Rabies, DHPP, Leptospirosis, and Kennel Cough boosters to protect your dog.",
    description: "Vaccinations protect your pet against fatal viral and bacterial infections. Follow this essential core booster schedule.",
    sections: [
      {
        heading: "1. Core vs Non-Core Vaccines",
        content: "Core vaccines (Rabies, Parvovirus, Distemper, Adenovirus) are mandatory. Non-core vaccines (Lepto, Bordetella) depend on your location and lifestyle."
      },
      {
        heading: "2. Puppy Booster Timeline",
        content: "Puppies require initial vaccinations starting at 6-8 weeks, with booster shots administered every 3-4 weeks until 16 weeks of age."
      }
    ]
  },
  {
    slug: "stray-animal-protocol",
    title: "What to Do If You Find an Injured Stray",
    category: "Emergency Protocol",
    icon: AlertTriangle,
    readTime: "6 min read",
    summary: "Step-by-step emergency instructions for approaching, securing, and notifying PawGuard's priority dispatch.",
    description: "Encountering an injured or distressed animal requires calm, immediate action. Follow PawGuard's emergency protocol.",
    sections: [
      {
        heading: "1. Approach with Caution",
        content: "An injured animal may bite out of pain or fear. Speak softly, avoid direct eye contact, and assess whether the animal can be approached safely."
      },
      {
        heading: "2. File an Immediate PawGuard Emergency Report",
        content: "Use PawGuard's emergency portal or hotline to share your exact GPS location, animal condition, and photos for priority vet dispatch."
      }
    ]
  }
];

export default async function EducationPage({ initialPosts }: { initialPosts?: BlogPostResponse[] }) {
  const remotePosts = initialPosts ?? (await fetchServerCachedBlogPosts());

  const remoteGuides = remotePosts.map((post) => ({
    slug: post.slug,
    title: post.title,
    category: post.category ? post.category.replace("-", " ").toUpperCase() : "GUIDE",
    icon: BookOpen,
    readTime: "5 min read",
    summary: post.excerpt || (post.body ? post.body.slice(0, 140) : "Read our comprehensive guide."),
    description: post.excerpt || post.body || "",
    sections: [
      {
        heading: post.title,
        content: post.body || "",
      },
    ],
  }));

  const allGuides = remoteGuides.length > 0 ? remoteGuides : GUIDES;

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <PageHeader
          eyebrow="Community & Knowledge"
          title="Pet Care & Emergency Guides"
          subtitle="Resource guides written by veterinarians and rescue coordinators to help you protect, care for, and respond to animal emergencies."
        />

        <Section bg="default">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
            <div className="flex flex-col gap-2">
              <span className="text-2xs font-semibold tracking-wider text-muted-foreground uppercase font-condensed">
                Resource Library
              </span>
              <h2 className="text-foreground font-serif font-bold text-2xl lg:text-3xl">
                Featured Guides &amp; Protocols
              </h2>
            </div>

            <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-grid-md">
              {allGuides.map((guide) => {
                const Icon = guide.icon;
                return (
                  <StaggerItem key={guide.slug}>
                    <Card variant="elevated" className="h-full flex flex-col justify-between p-6 gap-6">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-2xs font-bold uppercase tracking-wider bg-primary/10 text-primary">
                            <Icon size={13} />
                            {guide.category}
                          </span>
                          <span className="text-2xs font-semibold text-muted-foreground">
                            {guide.readTime}
                          </span>
                        </div>

                        <h3 className="font-serif font-bold text-xl text-foreground leading-snug">
                          {guide.title}
                        </h3>

                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {guide.summary}
                        </p>
                      </div>

                      <Link href={`/education/${guide.slug}`}>
                        <Button variant="outline" size="sm" className="w-full justify-between">
                          Read Guide <ArrowRight size={14} />
                        </Button>
                      </Link>
                    </Card>
                  </StaggerItem>
                );
              })}
            </StaggerGrid>
          </div>
        </Section>

        <Reveal>
          <Section bg="card" containerWidth="narrow">
            <div className="text-center flex flex-col gap-6 items-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-foreground font-serif font-bold text-3xl lg:text-4xl leading-tight tracking-tight">
                Verified Medical Guidance
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                All health and medical information on PawGuard is reviewed by licensed veterinary professionals. For active emergencies, contact our 24/7 hotline immediately.
              </p>
              <Link href="/emergency">
                <Button variant="primary" size="md">
                  Emergency Dispatch Hotline
                </Button>
              </Link>
            </div>
          </Section>
        </Reveal>
      </main>
    </PageShell>
  );
}
