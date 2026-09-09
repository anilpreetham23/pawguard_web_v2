"use client";

import { useApiQuery, QUERY_KEYS } from "@/lib/api";
import { rescueService } from "@/services/api/rescue";
import type { SuccessStoryResponse, SuccessStoryQueryParams, PaginationMeta } from "@/lib/api";

export interface MyStoriesResult {
  stories: SuccessStoryResponse[];
  meta: PaginationMeta;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
}

const DEFAULT_META: PaginationMeta = {
  total: 0,
  page: 1,
  page_size: 10,
  total_pages: 0,
};

/**
 * Hook to retrieve the authenticated user's submitted success stories (`GET /portal/stories/me`).
 */
export function useMyStories(params?: SuccessStoryQueryParams, enabled = true): MyStoriesResult {
  const { data, isLoading, isError, error, refetch } = useApiQuery({
    queryKey: QUERY_KEYS.community.myStories(params),
    queryFn: () => rescueService.getMyStories(params),
    enabled,
  });

  return {
    stories: data?.items ?? [],
    meta: data?.meta ?? DEFAULT_META,
    isLoading,
    isError,
    error,
    refetch,
  };
}
