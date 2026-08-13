"use client";

import { useApiQuery, QUERY_KEYS } from "@/lib/api";
import { safetyTagService } from "@/services/api/safety-tag";
import type { SafetyTagResponse } from "@/lib/api";

export interface UseSafetyTagResult {
  data: SafetyTagResponse | null;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
}

/**
 * Authenticated fetch of a companion pet's safety-tag metadata
 * (`GET /companion-pets/{petId}/safety-tag`).
 */
export function useSafetyTag(petId: string | undefined, enabled = true): UseSafetyTagResult {
  const { data, isLoading, isError, error, refetch } = useApiQuery({
    queryKey: QUERY_KEYS.safetyTag.petTag(petId ?? ""),
    queryFn: () => safetyTagService.getSafetyTag(petId!),
    enabled: enabled && Boolean(petId),
  });

  return {
    data: data ?? null,
    isLoading,
    isError,
    error,
    refetch,
  };
}
