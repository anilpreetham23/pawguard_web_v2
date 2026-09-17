/**
 * Server-only cached data fetcher for safe, public read-only content.
 * Uses Next.js native fetch caching ({ next: { revalidate: N } }).
 *
 * CACHING RULES:
 * - Public blog posts & education guides: revalidate every 3600 seconds (1 hour).
 * - Public success stories: revalidate every 1800 seconds (30 minutes).
 * - Public hero & impact statistics: revalidate every 600 seconds (10 minutes).
 * - Public adoptable dogs list: revalidate every 1800 seconds (30 minutes).
 * - NEVER use for authenticated, user, appointment, or application endpoints.
 */

import { apiConfig } from "./config";
import type { BlogPostResponse, DogProfileResponse, PublicHeroStats, SuccessStoryResponse } from "./types";

export async function fetchServerCachedBlogPosts(): Promise<BlogPostResponse[]> {
  try {
    const res = await fetch(`${apiConfig.baseURL}/portal/blog`, {
      next: { revalidate: 3600, tags: ["public-blog"] },
    });
    if (!res.ok) return [];
    const envelope = await res.json();
    return envelope?.data ?? envelope ?? [];
  } catch (err) {
    console.warn("[Server Fetch Cache Warning] Failed to fetch public blog posts:", err);
    return [];
  }
}

export async function fetchServerCachedBlogPostBySlug(slug: string): Promise<BlogPostResponse | null> {
  try {
    const posts = await fetchServerCachedBlogPosts();
    return posts.find((p) => p.slug === slug) ?? null;
  } catch (err) {
    console.warn(`[Server Fetch Cache Warning] Failed to fetch blog post for slug ${slug}:`, err);
    return null;
  }
}

export async function fetchServerCachedSuccessStories(): Promise<SuccessStoryResponse[]> {
  try {
    const res = await fetch(`${apiConfig.baseURL}/portal/success-stories`, {
      next: { revalidate: 1800, tags: ["public-stories"] },
    });
    if (!res.ok) return [];
    const envelope = await res.json();
    return envelope?.data ?? envelope ?? [];
  } catch (err) {
    console.warn("[Server Fetch Cache Warning] Failed to fetch public success stories:", err);
    return [];
  }
}

export async function fetchServerCachedSuccessStoryById(id: string): Promise<SuccessStoryResponse | null> {
  try {
    const stories = await fetchServerCachedSuccessStories();
    return stories.find((s) => s.id === id || s.slug === id) ?? null;
  } catch (err) {
    console.warn(`[Server Fetch Cache Warning] Failed to fetch success story for id ${id}:`, err);
    return null;
  }
}

export async function fetchServerCachedPublicStats(): Promise<PublicHeroStats | null> {
  try {
    const res = await fetch(`${apiConfig.baseURL}/portal/stats`, {
      next: { revalidate: 600, tags: ["public-stats"] },
    });
    if (!res.ok) return null;
    const envelope = await res.json();
    return envelope?.data ?? envelope ?? null;
  } catch (err) {
    console.warn("[Server Fetch Cache Warning] Failed to fetch public stats:", err);
    return null;
  }
}

export async function fetchServerCachedAdoptableDogs(): Promise<DogProfileResponse[]> {
  try {
    const res = await fetch(`${apiConfig.baseURL}/dogs?is_adoptable=true&page_size=100`, {
      next: { revalidate: 1800, tags: ["public-dogs"] },
    });
    if (!res.ok) return [];
    const envelope = await res.json();
    const data = envelope?.data;
    return Array.isArray(data) ? data : data?.items ?? [];
  } catch (err) {
    console.warn("[Server Fetch Cache Warning] Failed to fetch public adoptable dogs:", err);
    return [];
  }
}
