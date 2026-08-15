"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Plus } from "lucide-react";
import { Button } from "./pawguard/Button";
import { useApiMutation, QUERY_KEYS, getErrorMessage } from "@/lib/api";
import { queryClient } from "@/lib/react-query";
import { companionPetsService } from "@/services/api/pets";
import { useMyPets } from "../hooks/useMyPets";

interface AddCompanionPetButtonProps {
  /** Optional adoption application UUID for backend linking. */
  applicationId?: string;
  /** Optional original dog profile UUID for deduplication. */
  dogId?: string;
  /** Pet display name copied into the new pet profile. */
  petName: string;
  breed?: string | null;
  sex?: string | null;
  species?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "light";
  className?: string;
  /** Called with the new companion pet's id once created. */
  onAdded?: (petId: string) => void;
}

/** Normalize a pet name so duplicates are matched case/whitespace-insensitively. */
function normalizeName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Creates/links a pet profile directly from an approved adoption application
 * via `POST /companion-pets/from-adoption/{application_id}` (or `POST /companion-pets`),
 * then invalidates pets, applications, and appointments query caches.
 *
 * Duplicate protection: before rendering the action, it reads the user's real
 * companion pets (`GET /companion-pets`). If a pet linked to `applicationId`,
 * `dogId`, or matching name is already present, it renders "Already in My Pets"
 * and prevents double submission.
 */
export function AddCompanionPetButton({
  applicationId,
  dogId,
  petName,
  breed,
  sex,
  species = "dog",
  size = "sm",
  variant = "primary",
  className,
  onAdded,
}: AddCompanionPetButtonProps) {
  const [addedPetId, setAddedPetId] = useState<string | null>(null);
  const { pets, isLoading: petsLoading } = useMyPets();

  const alreadyAdded = useMemo(() => {
    const target = normalizeName(petName);
    return pets.some((p) => {
      if (applicationId && p.adoption_application_id === applicationId) return true;
      if (dogId && p.original_dog_id === dogId) return true;
      return normalizeName(p.name) === target;
    });
  }, [pets, petName, applicationId, dogId]);

  const mutation = useApiMutation<{ id: string }, void>({
    mutationFn: () => {
      if (applicationId) {
        return companionPetsService.createPetFromAdoption(applicationId);
      }
      return companionPetsService.createPet({
        name: petName.trim(),
        breed: breed || null,
        sex: sex || null,
        species,
      });
    },
    onSuccess: async (pet) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.companionPets.pets }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adoption.applications }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.companionPets.appointments }),
      ]);
      setAddedPetId(pet.id);
      onAdded?.(pet.id);
    },
  });

  if (alreadyAdded || addedPetId) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 text-xs font-semibold tracking-wider uppercase px-3 py-1.5 ${className ?? ""}`}
        role="status"
      >
        <CheckCircle2 size={14} />
        {addedPetId ? "Added to My Pets" : "Already in My Pets"}
      </span>
    );
  }

  const error = mutation.error ? getErrorMessage(mutation.error) : null;

  return (
    <span className={`inline-flex flex-col items-start gap-1 ${className ?? ""}`}>
      <Button
        variant={variant}
        size={size}
        type="button"
        isLoading={mutation.isPending}
        disabled={mutation.isPending || petsLoading}
        onClick={() => mutation.mutate()}
      >
        <Plus size={14} />
        Add to My Pets
      </Button>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </span>
  );
}
