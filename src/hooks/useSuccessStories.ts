"use client";

import { QUERY_KEYS } from "@/lib/api";
import { useApiQuery } from "@/lib/api/hooks";
import { rescueService, type SuccessStoryResponse } from "@/services/api/rescue";

export function useSuccessStories(initialStories?: SuccessStoryResponse[]): {
  data: SuccessStoryResponse[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
} {
  const { data, isLoading, isError, error, refetch } = useApiQuery({
    queryKey: QUERY_KEYS.community.successStory("all"),
    queryFn: () => rescueService.getSuccessStories(),
    initialData: initialStories,
  });

  return {
    data: data ?? [],
    isLoading: isLoading && !data,
    isError,
    error,
    refetch,
  };
}
