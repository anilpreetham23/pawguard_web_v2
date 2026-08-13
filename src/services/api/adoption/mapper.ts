/**
 * Adapter that maps the lean backend `DogProfileResponse` onto the rich
 * display `Pet` type used by the adoption UI.
 *
 * The backend contract does not expose photos, descriptions, vaccination
 * status, medical history, or shelter contact details, so those fields are
 * derived deterministically from the available data (temperament, quarantine
 * flag, weight, age, name) with graceful fallbacks — never from mock data.
 */

import type { DogProfileResponse } from "@/lib/api";
import type {
  AdoptionBadge,
  HealthStatus,
  Pet,
  PetAgeGroup,
  PetGender,
  PetSize,
  VaccinationStatus,
} from "@/types";

const TONES = ["amber", "purple", "sky", "rose", "teal"] as const;
const DOG_EMOJIS = ["🐶", "🐕", "🐩", "🐾"] as const;

/** Tiny deterministic string hash so the same dog always gets the same art. */
function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function deriveTone(name: string): string {
  return TONES[hashString(name) % TONES.length];
}

function deriveEmoji(name: string): string {
  return DOG_EMOJIS[hashString(name) % DOG_EMOJIS.length];
}

/** Best-effort age group from the backend's free-form `estimated_age`. */
function deriveAgeGroup(estimatedAge: string | null): PetAgeGroup {
  if (!estimatedAge) return "adult";
  const value = estimatedAge.toLowerCase();
  if (/(puppy|kitten)/.test(value)) return "puppy";
  const years = parseFloat(value.match(/\d+/)?.[0] ?? "");
  if (!Number.isNaN(years)) {
    if (years < 1) return "puppy";
    if (years >= 8) return "senior";
  }
  return "adult";
}

/** Size bucket derived from weight (kg) when present. */
function deriveSize(weight: number | null): PetSize {
  if (weight === null) return "medium";
  if (weight < 10) return "small";
  if (weight <= 25) return "medium";
  return "large";
}

function deriveGender(gender: string): PetGender {
  return gender.toLowerCase() === "female" ? "female" : "male";
}

function deriveVaccinationStatus(dog: DogProfileResponse): VaccinationStatus {
  return dog.is_quarantine_passed ? "up-to-date" : "partial";
}

function deriveHealthStatus(dog: DogProfileResponse): HealthStatus {
  return dog.is_quarantine_passed ? "healthy" : "recovering";
}

function deriveAdoptionBadge(dog: DogProfileResponse): AdoptionBadge {
  if (dog.status === "adopted") return "adopted";
  return dog.is_adoptable ? "available" : "recent";
}

function deriveTraits(temperament: string | null): string[] {
  if (!temperament) return ["Friendly"];
  return temperament
    .split(/[,/]/)
    .map((trait) => trait.trim())
    .filter(Boolean)
    .slice(0, 6);
}

function buildDescription(dog: DogProfileResponse): string {
  const parts = [
    dog.temperament ? `${dog.temperament}` : "Friendly",
    dog.breed ? `${dog.breed} mix` : "A rescue dog",
  ];
  if (dog.is_spayed_neutered) parts.push("spayed/neutered");
  if (dog.is_quarantine_passed) parts.push("quarantine cleared");
  if (dog.color) parts.push(`${dog.color} in color`);
  const text = `${parts.join(", ")}.`;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function buildMedicalHistory(dog: DogProfileResponse): string {
  const parts: string[] = [];
  if (dog.is_spayed_neutered) parts.push("Spayed/neutered");
  if (dog.is_quarantine_passed) {
    parts.push("Quarantine period completed");
  } else {
    parts.push("Quarantine period in progress");
  }
  if (dog.microchip_id) parts.push("Microchipped");
  return parts.length ? parts.join(". ") + "." : "Details available on request.";
}

/** Map a backend dog profile onto the display `Pet` model. */
export function dogProfileToPet(dog: DogProfileResponse): Pet {
  const created = Date.parse(dog.created_at);
  const addedDaysAgo = Number.isNaN(created)
    ? 0
    : Math.max(0, Math.floor((Date.now() - created) / 86_400_000));

  return {
    id: dog.id,
    name: dog.name,
    category: "dog",
    breed: dog.breed || "Mixed",
    ageGroup: deriveAgeGroup(dog.estimated_age),
    age: dog.estimated_age ?? "Unknown",
    gender: deriveGender(dog.gender),
    size: deriveSize(dog.weight),
    weight: dog.weight !== null ? `${dog.weight} kg` : "Unknown",
    color: dog.color ?? "Unknown",
    location: "PawGuard Shelter",
    vaccinationStatus: deriveVaccinationStatus(dog),
    healthStatus: deriveHealthStatus(dog),
    adoptionBadge: deriveAdoptionBadge(dog),
    description: buildDescription(dog),
    personalityTraits: deriveTraits(dog.temperament),
    specialNeeds: [],
    medicalHistory: buildMedicalHistory(dog),
    shelter: {
      name: "PawGuard Shelter",
      phone: "",
      email: "",
      address: "",
      verified: true,
    },
    tone: deriveTone(dog.name),
    emoji: deriveEmoji(dog.name),
    addedDaysAgo,
  };
}

export type {
  AdoptionBadge,
  HealthStatus,
  Pet,
  PetAgeGroup,
  PetGender,
  PetSize,
  VaccinationStatus,
};
