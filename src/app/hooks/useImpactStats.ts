"use client";

import { useApiQuery, QUERY_KEYS } from "@/lib/api";
import { communityService } from "@/services/api/community";

export interface ImpactStatDisplay {
  value: string;
  label: string;
}

export function useImpactStats(): ImpactStatDisplay[] {
  const { data } = useApiQuery({
    queryKey: QUERY_KEYS.community.transparency,
    queryFn: () => communityService.getTransparencyStats(),
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