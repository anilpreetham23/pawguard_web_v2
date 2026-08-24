"use client";

import { useApiQuery, QUERY_KEYS } from "@/lib/api";
import { appointmentsService } from "@/services/api/appointments";
import type { VetClinicResponse } from "@/lib/api";

export interface VetClinicsResult {
  clinics: VetClinicResponse[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
}

/** Active veterinary clinics that accept bookings (`GET /companion-pets/clinics`). */
export function useVetClinics(enabled = true): VetClinicsResult {
  const { data, isLoading, isError, error, refetch } = useApiQuery({
    queryKey: QUERY_KEYS.companionPets.clinics,
    queryFn: () =>
      appointmentsService.listClinics({
        page_size: 20,
        sort_by: "name",
        sort_order: "asc",
      }),
    enabled,
  });

  return {
    clinics: data?.items ?? [],
    isLoading,
    isError,
    error,
    refetch,
  };
}

export interface VetClinicResult {
  clinic: VetClinicResponse | null;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
}

/** Details for a single veterinary clinic (`GET /companion-pets/clinics/{clinicId}`). */
export function useVetClinic(clinicId: string | null, enabled = true): VetClinicResult {
  const { data, isLoading, isError, error, refetch } = useApiQuery({
    queryKey: [...QUERY_KEYS.companionPets.clinics, clinicId ?? ""] as const,
    queryFn: () => appointmentsService.getClinic(clinicId!),
    enabled: Boolean(enabled && clinicId),
  });

  return {
    clinic: data ?? null,
    isLoading,
    isError,
    error,
    refetch,
  };
}
