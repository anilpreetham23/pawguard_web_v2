"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Plus } from "lucide-react";
import { Button } from "./pawguard/Button";
import { useApiMutation, QUERY_KEYS, getErrorMessage } from "@/lib/api";
import { queryClient } from "@/lib/react-query";
import { companionPetsService } from "@/services/api/pets";
import { useMyPets } from "../hooks/useMyPets";

interface AddCompanionPetButtonProps {
  /** Pet display name copied into the new companion-pet profile. */
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
 * Creates a real companion-pet profile via `POST /companion-pets` with the
 * adopted dog's details, then invalidates the companion-pets cache so the My
 * Pets / booking surfaces update immediately. No fake/local records are ever
 * created — this is a genuine backend write gated behind an approved adoption.
 *
 * Duplicate protection: before rendering the create action it reads the user's
 * real companion pets (`GET /companion-pets`). If a pet with the same name is
 * already present it renders "Already in My Companion Pets" and never POSTs
 * again. The button is also disabled while the companion list is loading so a
 * duplicate cannot slip through before the check resolves, and while a POST is
 * pending so rapid double-clicks cannot create two records.
 */
export function AddCompanionPetButton({
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
  // Real backend read of the current user's companion pets (deduped by
  // react-query across every instance on the page).
  const { pets, isLoading: petsLoading } = useMyPets();

  const alreadyAdded = useMemo(() => {
    const target = normalizeName(petName);
    return pets.some((p) => normalizeName(p.name) === target);
  }, [pets, petName]);

  const mutation = useApiMutation<{ id: string }, void>({
    mutationFn: () =>
      companionPetsService.createPet({
        name: petName.trim(),
        breed: breed || null,
        sex: sex || null,
        species,
      }),
    onSuccess: async (pet) => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.companionPets.pets });
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
        {addedPetId ? "Added to companion pets" : "Already in My Companion Pets"}
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
        Add to My Companion Pets
      </Button>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </span>
  );
}
