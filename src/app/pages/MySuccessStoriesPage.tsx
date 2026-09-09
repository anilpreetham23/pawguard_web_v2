"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Heart,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Plus,
  ExternalLink,
  Calendar,
  Lock,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import {
  PageShell,
  Section,
  Card,
  Button,
  Badge,
  EmptyState,
  Alert,
  Skeleton,
  Reveal,
  StaggerGrid,
  StaggerItem,
} from "../components/pawguard";
import { useAuth } from "../providers/auth-provider";
import { useMyStories } from "../hooks/useMyStories";
import type { SuccessStoryResponse, SuccessStoryStatus } from "@/lib/api";
import { getErrorMessage } from "@/lib/api";

type FilterTab = "all" | SuccessStoryStatus;

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: SuccessStoryStatus }) {
  switch (status) {
    case "pending_review":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 border border-amber-500/25">
          <Clock size={13} className="text-amber-600" />
          Under Review
        </span>
      );
    case "published":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/25">
          <CheckCircle2 size={13} className="text-emerald-600" />
          Published
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/25">
          <AlertCircle size={13} className="text-destructive" />
          Revision Needed
        </span>
      );
    case "draft":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
          <FileText size={13} />
          Draft
        </span>
      );
  }
}

function StoryCard({ story }: { story: SuccessStoryResponse }) {
  return (
    <Card className="p-6 flex flex-col gap-4 border border-border transition-all duration-fast hover:shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex gap-4 min-w-0">
          {story.hero_image_url ? (
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0 border border-border shadow-xs">
              <img
                src={story.hero_image_url}
                alt={story.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Heart size={28} />
            </div>
          )}

          <div className="flex flex-col gap-1 min-w-0">
            <h3 className="text-foreground font-bold text-lg leading-snug line-clamp-1">
              {story.title}
            </h3>
            <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed">
              {story.summary}
            </p>
            <div className="flex items-center gap-3 text-2xs text-muted-foreground font-mono mt-1">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                Submitted {formatDate(story.created_at)}
              </span>
            </div>
          </div>
        </div>

        <div className="self-start shrink-0">
          <StatusBadge status={story.status} />
        </div>
      </div>

      {/* Full Body Excerpt */}
      <div className="bg-muted/30 rounded-card p-3.5 text-xs text-muted-foreground leading-relaxed line-clamp-3">
        {story.body}
      </div>

      {/* Rejection Reason Display (Only for rejected stories) */}
      {story.status === "rejected" && story.rejection_reason && (
        <div className="bg-destructive/5 border border-destructive/20 rounded-card p-4 flex items-start gap-3">
          <AlertCircle size={16} className="text-destructive shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="text-destructive font-bold text-xs uppercase tracking-wider font-condensed">
              Revision Reason / Reviewer Notes
            </span>
            <p className="text-xs text-foreground leading-relaxed">
              {story.rejection_reason}
            </p>
          </div>
        </div>
      )}

      {/* Card Actions */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-border">
        {story.status === "published" ? (
          <Link
            href={`/stories/${story.slug || story.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            View Live Story <ExternalLink size={13} />
          </Link>
        ) : (
          <span className="text-2xs text-muted-foreground">
            {story.status === "pending_review"
              ? "Under review by our team"
              : story.status === "rejected"
              ? "Revisions requested"
              : "Draft story"}
          </span>
        )}

        <span className="text-2xs text-muted-foreground font-mono">
          Last updated {formatDate(story.updated_at)}
        </span>
      </div>
    </Card>
  );
}

export default function MySuccessStoriesPage() {
  const { isAuthenticated, status: authStatus, openAuthDialog } = useAuth();
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");

  const queryParams = useMemo(() => {
    return activeFilter === "all" ? undefined : { status: activeFilter };
  }, [activeFilter]);

  const { stories, isLoading, isError, error, refetch } = useMyStories(
    queryParams,
    isAuthenticated
  );

  // Unauthenticated Guard
  if (authStatus === "loading") {
    return (
      <PageShell>
        <main id="main-content" className="flex-1 max-w-[1280px] mx-auto px-4 py-20">
          <Skeleton className="h-10 w-1/3 mb-4" />
          <Skeleton className="h-4 w-1/4 mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-48 rounded-card" />
            <Skeleton className="h-48 rounded-card" />
          </div>
        </main>
      </PageShell>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageShell>
        <main id="main-content" className="flex-1">
          <PageHeader
            eyebrow="My Account"
            title="My Success Stories"
            subtitle="Track the stories you have submitted about your adopted pets."
          />
          <Section bg="default" containerWidth="narrow">
            <Card className="p-8 sm:p-10 text-center flex flex-col items-center gap-6 border-dashed border-2">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Lock size={28} />
              </div>
              <div className="max-w-md flex flex-col gap-2">
                <h2 className="text-foreground font-bold text-2xl">Sign In Required</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Please sign in to view and track your submitted success stories.
                </p>
              </div>
              <Button variant="primary" size="lg" onClick={() => openAuthDialog("sign-in")}>
                Sign In to View Stories
              </Button>
            </Card>
          </Section>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <PageHeader
          eyebrow="My Account"
          title="My Success Stories"
          subtitle="Track the status of your submitted adoption journeys and reflections."
        />

        <Section bg="default">
          <div className="max-w-[1280px] mx-auto flex flex-col gap-8">
            {/* Action Bar & Filter Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {(
                  [
                    { key: "all", label: "All Stories" },
                    { key: "pending_review", label: "Under Review" },
                    { key: "published", label: "Published" },
                    { key: "rejected", label: "Revision Needed" },
                    { key: "draft", label: "Drafts" },
                  ] as const
                ).map((tab) => {
                  const isActive = activeFilter === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveFilter(tab.key)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider font-condensed transition-all duration-fast shrink-0 ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "bg-card border border-border text-foreground hover:border-primary/40 hover:text-primary"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <Button
                variant="primary"
                size="md"
                asLink={{ href: "/stories/share" }}
                className="shrink-0 self-start sm:self-auto gap-1.5"
              >
                <Plus size={16} />
                Share Another Story
              </Button>
            </div>

            {/* Error Alert */}
            {isError && (
              <Alert variant="error" title="Couldn't load your stories">
                {getErrorMessage(error) || "Please try refreshing the page."}{" "}
                <button
                  onClick={() => refetch()}
                  className="font-semibold underline underline-offset-2 hover:opacity-80"
                >
                  Retry
                </button>
              </Alert>
            )}

            {/* Loading Skeletons */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[0, 1].map((i) => (
                  <Skeleton key={i} className="h-52 rounded-card" />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !isError && stories.length === 0 && (
              <EmptyState
                icon="heart"
                title={
                  activeFilter === "all"
                    ? "No stories submitted yet"
                    : `No stories in "${activeFilter.replace("_", " ")}"`
                }
                description={
                  activeFilter === "all"
                    ? "Have you adopted a furry companion through PawGuard? Share your adoption story and inspire others!"
                    : "No stories match this filter right now."
                }
                action={
                  activeFilter === "all"
                    ? {
                        label: "Share Your First Story",
                        to: "/stories/share",
                      }
                    : undefined
                }
              />
            )}

            {/* Stories Grid */}
            {!isLoading && !isError && stories.length > 0 && (
              <Reveal>
                <StaggerGrid className="grid-cols-1 lg:grid-cols-2 gap-6" staggerDelay={0.06}>
                  {stories.map((story) => (
                    <StaggerItem key={story.id}>
                      <StoryCard story={story} />
                    </StaggerItem>
                  ))}
                </StaggerGrid>
              </Reveal>
            )}
          </div>
        </Section>
      </main>
    </PageShell>
  );
}
