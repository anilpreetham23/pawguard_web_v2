import Link from "next/link";
import Image from "next/image";
import StoryCard from "@/features/success-stories/StoryCard";
import { ArrowRight, Quote } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { PageShell, Section, Button, Reveal, StaggerGrid, StaggerItem } from "@/components/ui/pawguard";
import { fetchServerCachedSuccessStories } from "@/lib/api/server-public-data";
import type { SuccessStoryResponse } from "@/lib/api/types";

const FEATURED = {
  id: "featured-static",
  title: "From the Streets of Millbrook to His Forever Home",
  animal: "Bruno — Golden Retriever Mix",
  type: "Bruno — Golden Retriever Mix · March 2024",
  date: "March 2024",
  excerpt: "Bruno was found severely malnourished and unable to walk following a road accident near the Millbrook interchange. PawGuard's emergency team reached the scene with priority dispatch.",
  quote: "The gentlest, most grateful dog we've ever known.",
  img: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=500&fit=crop&auto=format",
  adopter: "Helena & Stefan Lindqvist",
  timeline: [
    { label: "Reported", value: "Mar 2, 2024" },
    { label: "Rescued", value: "18 mins" },
    { label: "Surgeries", value: "2 completed" },
    { label: "Adopted", value: "Apr 14, 2024" },
  ],
};

const STORIES = [
  {
    id: "1",
    animal: "Luna — Border Collie",
    type: "Luna — Border Collie · Feb 2024",
    headline: "Overcoming Fear: Luna's Journey to Trust",
    excerpt: "Found abandoned in an industrial lot, Luna would tremble at any sudden movement. Three months of patient fostering transformed her into a confident, loving companion.",
    img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=280&fit=crop&auto=format",
    adopter: "David & Maya Chen",
  },
  {
    id: "2",
    animal: "Milo — Beagle Mix",
    type: "Milo — Beagle Mix · Jan 2024",
    headline: "Senior Dog Milo Finds His Peaceful Retirement",
    excerpt: "At 10 years old, Milo lost his owner and ended up in municipal care. PawGuard placed him in a specialized senior-foster home where he captured his new family's heart.",
    img: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400&h=280&fit=crop&auto=format",
    adopter: "Arthur & Evelyn Ross",
  },
];

export default async function SuccessStoriesPage({ initialStories }: { initialStories?: SuccessStoryResponse[] }) {
  const remoteStories = initialStories ?? (await fetchServerCachedSuccessStories());

  const featuredStory = remoteStories && remoteStories.length > 0
    ? {
        id: remoteStories[0].id,
        title: remoteStories[0].title,
        animal: remoteStories[0].title,
        type: `Featured Story · ${remoteStories[0].published_at ? remoteStories[0].published_at.slice(0, 10) : "Recent"}`,
        date: remoteStories[0].published_at ? remoteStories[0].published_at.slice(0, 10) : "Recent",
        excerpt: remoteStories[0].summary || (remoteStories[0].body ? remoteStories[0].body.slice(0, 180) : FEATURED.excerpt),
        quote: "A story of rescue, restoration, and second chances.",
        img: remoteStories[0].hero_image_url || remoteStories[0].cover_image_url || FEATURED.img,
        adopter: "PawGuard Rescue Family",
        timeline: FEATURED.timeline,
      }
    : FEATURED;

  const storiesList = remoteStories && remoteStories.length > 1
    ? remoteStories.slice(1).map((s) => ({
        id: s.id,
        animal: s.title,
        type: `Rescue Story · ${s.published_at ? s.published_at.slice(0, 10) : "Recent"}`,
        headline: s.title,
        excerpt: s.summary || (s.body ? s.body.slice(0, 120) : ""),
        img: s.hero_image_url || s.cover_image_url || "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=280&fit=crop&auto=format",
        adopter: "PawGuard Family",
      }))
    : STORIES;

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <PageHeader
          eyebrow="Happy Tails"
          title="Success Stories"
          subtitle="Every number in our reports is a name. A personality. A family changed forever. These are their stories."
        />

        <Reveal><Section bg="card">
          <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--space-12)] lg:gap-[var(--space-16)]">
              <div className="lg:col-span-7 relative aspect-[4/3] lg:aspect-[7/5] bg-secondary rounded-img overflow-hidden shadow-lg group">
                <Image
                  src={featuredStory.img}
                  alt={featuredStory.title}
                  fill
                  className="object-cover transition-transform duration-slow group-hover:scale-[1.02]"
                  priority
                />
              </div>

              <div className="lg:col-span-5 flex flex-col justify-center gap-6">
                <span className="text-2xs font-semibold tracking-wider text-muted-foreground uppercase font-condensed">
                  {featuredStory.type}
                </span>

                <h2 className="text-foreground font-serif font-bold text-3xl lg:text-4xl leading-tight tracking-tight">
                  {featuredStory.title}
                </h2>

                <p className="text-muted-foreground text-base leading-relaxed">
                  {featuredStory.excerpt}
                </p>

                <div className="border-l-2 border-primary pl-4 py-1 italic text-foreground text-sm">
                  &ldquo;{featuredStory.quote}&rdquo;
                  <span className="block not-italic text-xs text-muted-foreground mt-1 font-semibold">— {featuredStory.adopter}</span>
                </div>

                <div className="pt-2">
                  <Button variant="primary" size="md" asLink={{ href: `/stories/${featuredStory.id}` }}>
                    Read Full Story <ArrowRight size={14} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Section></Reveal>

        <Reveal><Section bg="default">
          <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto flex flex-col gap-10">
            <div className="flex flex-col gap-2">
              <span className="text-2xs font-semibold tracking-wider text-muted-foreground uppercase font-condensed">More Stories</span>
              <h2 className="text-foreground font-serif font-bold text-2xl lg:text-3xl">Recent Rehoming Journeys</h2>
            </div>

            <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--space-6)] lg:gap-[var(--space-8)]">
              {storiesList.map((story) => (
                <StaggerItem key={story.id}>
                  <StoryCard {...story} />
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
            <Button variant="secondary" size="md" asLink={{ href: "/stories/share" }}>
              Share Your Story <ArrowRight size={14} />
            </Button>
          </div>
        </Section></Reveal>

        <Reveal><Section bg="default">
          <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
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
