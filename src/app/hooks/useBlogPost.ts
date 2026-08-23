"use client";

import { useApiQuery, QUERY_KEYS } from "@/lib/api";
import { communityService, type BlogPost } from "@/services/api/community";

export function useBlogPost(slug: string): {
  data: BlogPost | null;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
} {
  const { data, isLoading, isError, error, refetch } = useApiQuery({
    queryKey: QUERY_KEYS.community.blogPost(slug),
    queryFn: () => communityService.getBlogPostBySlug(slug),
    enabled: Boolean(slug),
  });

  return {
    data: data ?? null,
    isLoading,
    isError,
    error,
    refetch,
  };
}
