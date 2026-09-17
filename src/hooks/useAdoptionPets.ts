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
  const initialPage = initialDogs
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

  return useApiQuery<Page<DogProfileResponse>, Pet[]>({
    queryKey: [QUERY_KEYS.adoption.pets, params],
    queryFn: () =>
      adoptionService.listDogs({ is_adoptable: true, page_size: 24, ...params }),
    initialData: initialPage,
    select: (page: Page<DogProfileResponse>) =>
      page.items
        .map(dogProfileToPet)
        .filter((pet: Pet) => pet.adoptionBadge !== "adopted"),
  });
}

export type { Pet };