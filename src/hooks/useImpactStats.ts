"use client";

import { QUERY_KEYS } from "@/lib/api";
import { useApiQuery } from "@/lib/api/hooks";
import { communityService } from "@/services/api/community";
import type { PublicHeroStats, TransparencyStats } from "@/lib/api";

export interface ImpactStatDisplay {
  value: string;
  label: string;
}

export function useImpactStats(initialStats?: PublicHeroStats | null): ImpactStatDisplay[] {
  const initialData: TransparencyStats | undefined = initialStats
    ? {
        total_rescues_completed: initialStats.total_rescued,
        successful_adoptions: initialStats.successful_adoptions,
        active_volunteers: 450,
        total_funds_raised: 500000,
        total_donations: 1200,
        active_foster_homes: 85,
        veterinary_partners: 42,
        dogs_in_care: initialStats.active_care_count ?? 150,
      }
    : undefined;

  const { data } = useApiQuery({
    queryKey: QUERY_KEYS.community.transparency,
    queryFn: () => communityService.getTransparencyStats(),
    initialData,
  });

  const rescuedCount = data?.total_rescues_completed;
  const adoptionsCount = data?.successful_adoptions;
  const volunteersCount = data?.active_volunteers;

  const rescuedValue =
    typeof rescuedCount === "number" && !Number.isNaN(rescuedCount)
      ? `${rescuedCount.toLocaleString()}+`
      : "—";

  const adoptionsValue =
    typeof adoptionsCount === "number" && !Number.isNaN(adoptionsCount)
      ? `${adoptionsCount.toLocaleString()}+`
      : "—";

  const volunteersValue =
    typeof volunteersCount === "number" && !Number.isNaN(volunteersCount)
      ? `${volunteersCount.toLocaleString()}+`
      : "—";

  return [
    { value: rescuedValue, label: "Dogs Rescued" },
    { value: adoptionsValue, label: "Successful Adoptions" },
    { value: volunteersValue, label: "Active Volunteers" },
    { value: "24/7", label: "Emergency Response" },
  ];
}