"use client";

import { useApiQuery, QUERY_KEYS } from "@/lib/api";
import { appointmentsService } from "@/services/api/appointments";
import type { PetAppointmentResponse } from "@/lib/api";

export interface MyAppointmentsResult {
  appointments: PetAppointmentResponse[];
  total: number;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
}

/** The authenticated user's veterinary appointments (`GET /companion-pets/appointments`). */
export function useMyAppointments(enabled = true): MyAppointmentsResult {
  const { data, isLoading, isError, error, refetch } = useApiQuery({
    queryKey: QUERY_KEYS.companionPets.appointments,
    queryFn: () =>
      appointmentsService.listAppointments({
        page_size: 50,
        sort_by: "starts_at",
        sort_order: "desc",
      }),
    enabled,
  });

  return {
    appointments: data?.items ?? [],
    total: data?.meta.total ?? 0,
    isLoading,
    isError,
    error,
    refetch,
  };
}
