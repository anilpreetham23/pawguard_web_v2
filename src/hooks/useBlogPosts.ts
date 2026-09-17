"use client";

import { QUERY_KEYS } from "@/lib/api";
import { useApiQuery } from "@/lib/api/hooks";
import { communityService, type BlogPost } from "@/services/api/community";

export function useBlogPosts(): {
  data: BlogPost[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
} {
  const { data, isLoading, isError, error, refetch } = useApiQuery({
    queryKey: QUERY_KEYS.community.blog,
    queryFn: () => communityService.getBlogPosts(),
  });

  return {
    data: data ?? [],
    isLoading,
    isError,
    error,
    refetch,
  };
}
