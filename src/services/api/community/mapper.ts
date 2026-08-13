/**
 * Adapter that maps the lean backend DTOs onto the rich display types used by
 * the community UI.
 *
 * The backend `BlogPostResponse` does not expose an author, tags, read time,
 * featured flag, or cover art, so those fields are derived deterministically
 * from the available data (title, body, category) with graceful fallbacks —
 * never from mock data. This mirrors the rescue module's `mapper.ts`.
 */

import { blogCategoryLabels } from "@/constants/community";
import type { BlogPostResponse, PublicHeroStats } from "@/lib/api";
import type {
  BlogAuthor,
  BlogCategory,
  BlogPost,
  BlogSection,
  ImpactStat,
} from "@/types";

const TONES = ["amber", "purple", "sky", "rose", "teal"] as const;
const BLOG_EMOJIS = ["🐾", "🐕", "🐈", "🦮", "🐩", "🐕"] as const;

/** Tiny deterministic string hash so the same post always gets the same art. */
function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function deriveTone(value: string): string {
  return TONES[hashString(value) % TONES.length];
}

function deriveEmoji(value: string): string {
  return BLOG_EMOJIS[hashString(value) % BLOG_EMOJIS.length];
}

/** Normalize the backend's free-form category onto the display `BlogCategory`. */
const CATEGORY_ALIASES: Record<string, BlogCategory> = {
  "rescue-stories": "rescue-stories",
  rescue_stories: "rescue-stories",
  "pet-care": "pet-care",
  pet_care: "pet-care",
  adoption: "adoption",
  volunteering: "volunteering",
  "animal-welfare": "animal-welfare",
  animal_welfare: "animal-welfare",
  awareness: "animal-welfare",
  "community-news": "community-news",
  community_news: "community-news",
};

/** Map the backend category string onto a valid display category. */
export function deriveBlogCategory(value: string): BlogCategory {
  const key = (value ?? "").trim().toLowerCase();
  return CATEGORY_ALIASES[key] ?? "community-news";
}

/** Deterministic author — the backend does not expose an author. */
function deriveAuthor(post: BlogPostResponse): BlogAuthor {
  return {
    name: "PawGuard Editorial",
    role: "Community Team",
    initials: "PG",
    tone: deriveTone(post.title),
  };
}

/** Approximate reading time from the body word count (~200 wpm). */
function deriveReadTime(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Split the plain-text body into display sections with headings. */
export function parseBlogSections(body: string): BlogSection[] {
  const lines = body.split(/\r?\n/);
  const sections: BlogSection[] = [];
  let current: BlogSection | null = null;
  let buffer: string[] = [];

  const flush = () => {
    const paragraph = buffer.map((line) => line.trim()).filter(Boolean).join(" ");
    if (paragraph) {
      if (!current) {
        current = { heading: "Overview", paragraphs: [] };
        sections.push(current);
      }
      current.paragraphs.push(paragraph);
    }
    buffer = [];
  };

  for (const line of lines) {
    const heading = line.match(/^#{1,4}\s+(.+)$/);
    if (heading) {
      flush();
      current = { heading: heading[1].trim(), paragraphs: [] };
      sections.push(current);
    } else {
      buffer.push(line);
    }
  }
  flush();

  if (sections.length === 0) {
    const text = body.trim();
    sections.push({
      heading: "Overview",
      paragraphs: [text || "This article is coming soon."],
    });
  }
  return sections;
}

/** Derive stable tags from the category label + meaningful title keywords. */
function deriveTags(post: BlogPostResponse, category: BlogCategory): string[] {
  const words = post.title
    .split(/\s+/)
    .map((word) => word.toLowerCase().replace(/[^a-z]/g, ""))
    .filter((word) => word.length > 4);
  const fromTitle = [...new Set(words)].slice(0, 3);
  return [...new Set([blogCategoryLabels[category], ...fromTitle])];
}

/** Short description from the excerpt, falling back to the body's first line. */
function deriveShortDescription(post: BlogPostResponse): string {
  if (post.excerpt?.trim()) return post.excerpt.trim();
  const firstParagraph = post.body.trim().split(/\n\s*\n/)[0] ?? "";
  const clean = firstParagraph.replace(/#{1,4}\s+/g, "").trim();
  if (!clean) return "Read the latest from the PawGuard community.";
  return clean.length > 160 ? `${clean.slice(0, 157).trimEnd()}…` : clean;
}

/**
 * Map a backend blog post onto the display `BlogPost` model. `index` marks
 * the first post in a list as featured (the backend has no featured flag).
 */
export function blogPostResponseToBlogPost(
  post: BlogPostResponse,
  index = 0
): BlogPost {
  const category = deriveBlogCategory(post.category);
  return {
    slug: post.slug,
    title: post.title,
    category,
    shortDescription: deriveShortDescription(post),
    author: deriveAuthor(post),
    publishedAt: (post.published_at ?? post.created_at).slice(0, 10),
    readTimeMinutes: deriveReadTime(post.body),
    featured: index === 0,
    coverTone: deriveTone(post.title),
    coverEmoji: deriveEmoji(post.title),
    tags: deriveTags(post, category),
    sections: parseBlogSections(post.body),
    quote: null,
    gallery: [],
    commentsCount: 0,
  };
}

/** Map the backend hero stats onto the display `ImpactStat[]` tiles. */
export function heroStatsToImpactStats(stats: PublicHeroStats): ImpactStat[] {
  return [
    { value: stats.total_rescued, label: "Animals Rescued" },
    { value: stats.active_care_count, label: "Currently in Care" },
    { value: stats.successful_adoptions, label: "Successful Adoptions" },
    { value: stats.urgent_rescue_count, label: "Urgent Rescues" },
  ];
}

export type {
  BlogAuthor,
  BlogCategory,
  BlogPost,
  BlogSection,
  ImpactStat,
};
