"use client";

import { useApiQuery, QUERY_KEYS } from "@/lib/api";
import { adoptionService } from "@/services/api/adoption";
import {
  dogProfileToPet,
  type Pet,
} from "@/services/api/adoption/mapper";

/**
 * Adoptable dogs from the live backend, mapped onto the display `Pet` model.
 * Fetched once and cached (stale-time default), so client-side filters stay
 * instant — the backend has no age-group/size facets, only estimated age and
 * weight, which the mapper buckets into `ageGroup`/`size` locally.
 */
export function useAdoptionPets() {
  return useApiQuery({
    queryKey: QUERY_KEYS.adoption.pets,
    queryFn: () =>
      adoptionService.listDogs({ is_adoptable: true, page_size: 100 }),
    select: (page) => page.items.map(dogProfileToPet),
  });
}

export type { Pet };