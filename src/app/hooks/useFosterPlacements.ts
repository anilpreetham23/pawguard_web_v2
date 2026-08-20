"use client";

import { QUERY_KEYS, useApiQuery } from "@/lib/api";
import { fosterService } from "@/services/api/foster";
import { useAuth } from "../providers/auth-provider";
import type { FosterPlacementResponse } from "@/lib/api";

export interface FosterPlacementsResult {
  placements: FosterPlacementResponse[];
  activePlacement: FosterPlacementResponse | null;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
}

/**
 * Retrieves the current authenticated user's active foster placements
 * from `GET /api/v1/fosters/me/placements`.
 */
export function useFosterPlacements(): FosterPlacementsResult {
  const { isAuthenticated, status } = useAuth();
  const enabled = isAuthenticated && status === "authenticated";

  const query = useApiQuery({
    queryKey: QUERY_KEYS.foster.myPlacements,
    enabled,
    queryFn: () => fosterService.getMyPlacements(),
  });

  const placements = query.data ?? [];
  const activePlacement =
    placements.find((p) => p.status === "active") ?? placements[0] ?? null;

  return {
    placements,
    activePlacement,
    isLoading: enabled ? query.isLoading : false,
    isError: query.isError,
    error: query.error,
    refetch: () => {
      void query.refetch();
    },
  };
}
