"use client";

import { useApiQuery, QUERY_KEYS } from "@/lib/api";
import { rescueService, type SuccessStoryResponse } from "@/services/api/rescue";

export function useSuccessStories(): {
  data: SuccessStoryResponse[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
} {
  const { data, isLoading, isError, error, refetch } = useApiQuery({
    queryKey: QUERY_KEYS.community.successStory("all"),
    queryFn: () => rescueService.getSuccessStories(),
  });

  return {
    data: data ?? [],
    isLoading,
    isError,
    error,
    refetch,
  };
}
