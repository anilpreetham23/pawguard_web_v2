"use client";

import { QUERY_KEYS } from "@/lib/api";
import { useApiQuery } from "@/lib/api/hooks";
import { adoptionService } from "@/services/api/adoption";
import {
  dogProfileToPet,
  type Pet,
} from "@/services/api/adoption/mapper";
import type { DogProfileResponse, Page } from "@/lib/api";

/**
 * Adoptable dogs from the live backend, mapped onto the display `Pet` model.
 * Fetched once and cached (stale-time default), so client-side filters stay
 * instant — the backend has no age-group/size facets, only estimated age and
 * weight, which the mapper buckets into `ageGroup`/`size` locally.
 */
export function useAdoptionPets(
  params?: Parameters<typeof adoptionService.listDogs>[0],
  initialDogs?: DogProfileResponse[]
) {
  const initialData: Page<DogProfileResponse> | undefined = initialDogs
    ? {
        items: initialDogs,
        meta: {
          total: initialDogs.length,
          page: 1,
          page_size: initialDogs.length,
          total_pages: 1,
        },
      }
    : undefined;

  const { data, isLoading, isError, error, refetch } = useApiQuery<Page<DogProfileResponse>>({
    queryKey: [QUERY_KEYS.adoption.pets, params],
    queryFn: () =>
      adoptionService.listDogs({ is_adoptable: true, page_size: 9, ...params }),
    initialData,
  });

  const pets = (data?.items ?? []).map(dogProfileToPet);

  return {
    pets,
    meta: data?.meta ?? { total: pets.length, page: 1, page_size: 9, total_pages: 1 },
    isLoading,
    isError,
    error,
    refetch,
  };
}

export type { Pet };