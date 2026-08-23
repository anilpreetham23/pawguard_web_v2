"use client";

import Link from "next/link";
import { ArrowLeft, Calendar, Heart } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { PageShell, Section, Card, Button } from "../components/pawguard";
import { useSuccessStory } from "../hooks/useSuccessStory";

export default function SuccessStoryDetailPage({ id }: { id: string }) {
  const { data: story, isLoading, isError } = useSuccessStory(id);

  if (isLoading) {
    return (
      <PageShell>
        <main id="main-content" className="flex-1 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(var(--header-height)+3rem)] text-center">
          <p className="text-muted-foreground">Loading success story...</p>
        </main>
      </PageShell>
    );
  }

  if (!story || isError) {
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

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(var(--header-height)+1.5rem)]">
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-primary transition-colors duration-fast group mb-6"
          >
            <ArrowLeft size={15} className="transition-transform duration-fast group-hover:-translate-x-0.5" />
            Back to Success Stories
          </Link>
        </div>

        <PageHeader
          eyebrow="Happy Tails"
          title={story.title}
          subtitle={story.summary}
        />

        <Section bg="default">
          <div className="max-w-[800px] mx-auto flex flex-col gap-8">
            {story.hero_image_url && (
              <div className="aspect-[16/9] rounded-img overflow-hidden shadow-lg">
                <img
                  src={story.hero_image_url}
                  alt={story.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex items-center justify-between border-b border-border pb-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 font-semibold text-primary">
                <Heart size={16} />
                Rescue Success Story
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Calendar size={14} />
                {publishedDate}
              </span>
            </div>

            <Card variant="default" className="p-6 text-foreground leading-relaxed whitespace-pre-line text-base">
              {story.body}
            </Card>

            <div className="border-t border-border pt-6 flex items-center justify-between">
              <Link href="/stories">
                <Button variant="outline" size="sm">
                  ← More Stories
                </Button>
              </Link>
              <Link href="/adopt">
                <Button variant="primary" size="sm">
                  Adopt a Rescue Dog
                </Button>
              </Link>
            </div>
          </div>
        </Section>
      </main>
    </PageShell>
  );
}
