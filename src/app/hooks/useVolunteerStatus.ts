"use client";

import { QUERY_KEYS, useApiQuery } from "@/lib/api";
import { communityService } from "@/services/api/community";
import { useAuth } from "../providers/auth-provider";
import type { VolunteerMeStatusResponse } from "@/lib/api";

export interface VolunteerStatusResult {
  volunteerStatus: VolunteerMeStatusResponse | null;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
}

/**
 * Authoritative volunteer lifecycle status from `GET /api/v1/volunteers/me/status`.
 * Returns status (NOT_APPLIED | PENDING | ACTIVE | REJECTED | INACTIVE),
 * application, profile, can_apply, and can_reapply flags.
 */
export function useVolunteerStatus(): VolunteerStatusResult {
  const { isAuthenticated, status } = useAuth();
  const enabled = isAuthenticated && status === "authenticated";

  const query = useApiQuery({
    queryKey: QUERY_KEYS.community.volunteerStatus,
    enabled,
    queryFn: () => communityService.getVolunteerStatus(),
  });

  return {
    volunteerStatus: query.data ?? null,
    isLoading: enabled ? query.isLoading : false,
    isError: query.isError,
    error: query.error,
    refetch: () => {
      void query.refetch();
    },
  };
}
