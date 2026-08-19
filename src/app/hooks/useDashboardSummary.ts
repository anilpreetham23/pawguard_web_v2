"use client";

import { QUERY_KEYS, useApiQuery } from "@/lib/api";
import { communityService } from "@/services/api/community";
import { useAuth } from "../providers/auth-provider";
import type { UserDashboardSummary } from "@/lib/api";

export interface DashboardSummaryResult {
  summary: UserDashboardSummary | null;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
}

/**
 * The signed-in user's activity summary from `GET /portal/me/dashboard` —
 * counts of adoption applications, rescue cases, donations, lost/found
 * reports, plus volunteer/foster profile status. Gated on an active session.
 */
export function useDashboardSummary(): DashboardSummaryResult {
  const { isAuthenticated, status } = useAuth();
  const enabled = isAuthenticated && status === "authenticated";

  const query = useApiQuery({
    queryKey: QUERY_KEYS.community.meDashboard,
    enabled,
    queryFn: () => communityService.getMyDashboard(),
  });

  return {
    summary: query.data ?? null,
    isLoading: enabled ? query.isLoading : false,
    isError: query.isError,
    error: query.error,
    refetch: () => {
      void query.refetch();
    },
  };
}
