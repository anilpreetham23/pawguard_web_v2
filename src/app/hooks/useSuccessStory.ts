"use client";

import { useApiQuery, QUERY_KEYS } from "@/lib/api";
import { rescueService, type SuccessStoryResponse } from "@/services/api/rescue";

export function useSuccessStory(id: string): {
  data: SuccessStoryResponse | null;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
} {
  const { data, isLoading, isError, error, refetch } = useApiQuery({
    queryKey: QUERY_KEYS.community.successStory(id),
    queryFn: () => rescueService.getSuccessStory(id),
    enabled: Boolean(id),
  });

  return {
    data: data ?? null,
    isLoading,
    isError,
    error,
    refetch,
  };
}
