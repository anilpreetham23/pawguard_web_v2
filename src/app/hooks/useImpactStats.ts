"use client";

import { useApiQuery, QUERY_KEYS } from "@/lib/api";
import { communityService } from "@/services/api/community";
import { heroStatsToImpactStats } from "@/services/api/community/mapper";

export interface ImpactStatDisplay {
  value: string;
  label: string;
}

const DESIGNER_FALLBACKS: ImpactStatDisplay[] = [
  { value: "4,200+", label: "Dogs Rescued" },
  { value: "1,850+", label: "Successful Adoptions" },
  { value: "800+", label: "Active Volunteers" },
  { value: "24/7", label: "Emergency Response" },
];

export function useImpactStats(): ImpactStatDisplay[] {
  const { data } = useApiQuery({
    queryKey: QUERY_KEYS.community.stats,
    queryFn: () => communityService.getStats(),
    select: (stats) => heroStatsToImpactStats(stats),
  });

  if (!data || data.length === 0) return DESIGNER_FALLBACKS;

  const byLabel = new Map<string, number>(data.map((s) => [s.label, s.value]));

  const pick = (apiKey: string, fallbackIndex: number): string => {
    const n = byLabel.get(apiKey);
    if (n === undefined || Number.isNaN(n)) {
      return DESIGNER_FALLBACKS[fallbackIndex].value;
    }
    return `${n.toLocaleString()}+`;
  };

  return [
    { value: pick("Animals Rescued", 0), label: "Dogs Rescued" },
    { value: pick("Successful Adoptions", 1), label: "Successful Adoptions" },
    DESIGNER_FALLBACKS[2],
    DESIGNER_FALLBACKS[3],
  ];
}