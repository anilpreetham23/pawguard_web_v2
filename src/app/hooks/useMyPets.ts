"use client";

import { useApiQuery, QUERY_KEYS } from "@/lib/api";
import { companionPetsService } from "@/services/api/pets";
import type { CompanionPetResponse } from "@/lib/api";

export interface MyPetsResult {
  pets: CompanionPetResponse[];
  total: number;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
}

/** Authenticated user's companion pets (`GET /companion-pets`). */
export function useMyPets(enabled = true): MyPetsResult {
  const { data, isLoading, isError, error, refetch } = useApiQuery({
    queryKey: QUERY_KEYS.companionPets.pets,
    queryFn: () =>
      companionPetsService.listPets({ page_size: 50, sort_order: "desc" }),
    enabled,
  });

  return {
    pets: data?.items ?? [],
    total: data?.meta.total ?? 0,
    isLoading,
    isError,
    error,
    refetch,
  };
}
