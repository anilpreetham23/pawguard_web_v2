"use client";

import { useApiQuery, QUERY_KEYS } from "@/lib/api";
import { settingsService, type PublicContentResponse } from "@/services/api/settings";

export function usePublicContent(): {
  data: PublicContentResponse | null;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
} {
  const { data, isLoading, isError, error, refetch } = useApiQuery({
    queryKey: QUERY_KEYS.settings.publicContent,
    queryFn: () => settingsService.getPublicContent(),
  });

  return {
    data: data ?? null,
    isLoading,
    isError,
    error,
    refetch,
  };
}
