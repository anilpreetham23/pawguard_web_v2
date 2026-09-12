"use client";

import { useApiQuery, QUERY_KEYS } from "@/lib/api";
import { remindersService } from "@/services/api/reminders";
import type { DogMedicalRemindersResponse } from "@/lib/api";

export interface UseDogMedicalRemindersResult {
  data: DogMedicalRemindersResponse | null;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
}

/**
 * Authenticated fetch of automated medical reminders for a dog
 * (`GET /api/v1/medical/dogs/{dogId}/reminders`).
 *
 * Backed by backend commit f39277c (PAW-VET-REM-029).
 * Enabled only when a valid dogId is provided.
 */
export function useDogMedicalReminders(
  dogId: string | null | undefined,
  enabled = true
): UseDogMedicalRemindersResult {
  const cleanId = dogId?.trim() ?? "";
  const isEnabled = enabled && cleanId.length > 0;

  const { data, isLoading, isError, error, refetch } = useApiQuery({
    queryKey: QUERY_KEYS.medical.dogReminders(cleanId),
    queryFn: () => remindersService.getDogMedicalReminders(cleanId),
    enabled: isEnabled,
  });

  return {
    data: data ?? null,
    isLoading: isEnabled ? isLoading : false,
    isError: isEnabled ? isError : false,
    error: isEnabled ? error : null,
    refetch,
  };
}
