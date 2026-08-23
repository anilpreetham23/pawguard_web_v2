"use client";

import { useApiQuery, QUERY_KEYS } from "@/lib/api";
import { communityService, type UrgentAlertResponse } from "@/services/api/community";

export function useUrgentAlerts(): {
  data: UrgentAlertResponse[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
} {
  const { data, isLoading, isError, error, refetch } = useApiQuery({
    queryKey: QUERY_KEYS.community.urgentAlerts,
    queryFn: () => communityService.getUrgentAlerts(),
  });

  return {
    data: data ?? [],
    isLoading,
    isError,
    error,
    refetch,
  };
}
