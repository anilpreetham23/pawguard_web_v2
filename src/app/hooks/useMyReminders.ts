"use client";

import { useApiQuery, QUERY_KEYS } from "@/lib/api";
import { remindersService } from "@/services/api/reminders";
import type { CompanionPetResponse, PetReminderResponse } from "@/lib/api";

/** A reminder joined with its pet's display name. */
export interface PetReminderWithPet extends PetReminderResponse {
  petName: string;
}

export interface MyRemindersResult {
  reminders: PetReminderWithPet[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
}

/**
 * Every reminder across the owner's companion pets
 * (`GET /companion-pets/{pet_id}/reminders` per pet, fetched in parallel and
 * denormalized with each pet's name). The backend auto-creates reminders from
 * clinic medical records, so this surface shows both manual and clinic-driven
 * items.
 */
export function useMyReminders(
  pets: CompanionPetResponse[],
  enabled = true
): MyRemindersResult {
  const petIds = pets.map((p) => p.id).sort().join("|");
  const { data, isLoading, isError, error, refetch } = useApiQuery({
    queryKey: [...QUERY_KEYS.companionPets.reminders("all"), petIds] as const,
    queryFn: async () => {
      const results = await Promise.all(
        pets.map(async (pet) => {
          const items = await remindersService.listReminders(pet.id);
          return items.map((item) => ({ ...item, petName: pet.name }));
        })
      );
      return results.flat();
    },
    enabled: enabled && pets.length > 0,
  });

  const sorted = (data ?? []).sort(
    (a, b) => new Date(a.due_at).getTime() - new Date(b.due_at).getTime()
  );

  return {
    reminders: sorted,
    isLoading,
    isError,
    error,
    refetch,
  };
}