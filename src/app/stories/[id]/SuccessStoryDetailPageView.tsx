import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { PageShell, Section, Card, Button } from "@/components/ui/pawguard";
import { fetchServerCachedSuccessStoryById } from "@/lib/api/server-public-data";
import type { SuccessStoryResponse } from "@/lib/api/types";

export default async function SuccessStoryDetailPage({ id, initialStory }: { id: string; initialStory?: SuccessStoryResponse | null }) {
  const story = initialStory ?? (await fetchServerCachedSuccessStoryById(id));

  if (!story) {
    return (
      <PageShell>
        <main id="main-content" className="flex-1 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(var(--header-height)+3rem)] text-center">
          <h1 className="text-3xl font-bold text-foreground">Story Not Found</h1>
          <p className="text-muted-foreground mt-2 mb-6">The requested success story could not be found.</p>
          <Link href="/stories">
            <Button variant="primary" size="md">Back to Success Stories</Button>
          </Link>
        </main>
      </PageShell>
    );
  }

  const publishedDate = story.published_at
    ? new Date(story.published_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recent Rescue";

  const heroImage = story.hero_image_url || story.cover_image_url;

  return (
    <PageShell>
      <main id="main-content" className="flex-1 pt-[calc(var(--header-height)+1.5rem)] pb-16">
        <PageHeader
          eyebrow="Success Story"
          title={story.title}
          subtitle="A PawGuard Rescue & Adoption Story"
        />
        <Section className="pt-8">
          <div className="max-w-[800px] mx-auto px-4 sm:px-6">
            <Link
              href="/stories"
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Stories
            </Link>

            {heroImage && (
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-8 shadow-md">
                <Image
                  src={heroImage}
                  alt={story.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground mb-6 uppercase tracking-wider font-condensed">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-primary" />
                {publishedDate}
              </span>
            </div>

            {story.summary && (
              <p className="text-lg font-medium text-foreground leading-relaxed mb-6 border-l-4 border-primary/60 pl-4 py-1 bg-primary/5 rounded-r-lg">
                {story.summary}
              </p>
            )}

            <Card className="p-6 sm:p-8 space-y-6 text-foreground/90 leading-relaxed font-sans text-base">
              {story.body ? (
                <div className="prose max-w-none whitespace-pre-line">{story.body}</div>
              ) : (
                <p>This heartwarming rescue story demonstrates PawGuard&apos;s commitment to safety, shelter coordination, and rehoming vulnerable animals.</p>
              )}
            </Card>
          </div>
        </Section>
      </main>
    </PageShell>
  );
}
