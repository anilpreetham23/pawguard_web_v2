"use client";

import { useApiQuery, QUERY_KEYS } from "@/lib/api";
import { adoptionService } from "@/services/api/adoption";
import type { AdoptionApplicationResponse } from "@/lib/api";
import { useAuth } from "../providers/auth-provider";

export interface AdoptionApplicationsAllResult {
  /** The signed-in user's adoption applications, newest first (up to 100). */
  applications: AdoptionApplicationResponse[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
}

/**
 * Every adoption application for the signed-in user (`GET /adoptions/my`),
 * fetched as a single uncapped page. Gated on an active session — signed-out
 * visitors get an empty result.
 *
 * This is intentionally a distinct query key from the paginated applications
 * list that `MyApplicationsPage` uses, so both surfaces stay in sync without
 * sharing page state.
 */
export function useAdoptionApplicationsAll(enabled = true): AdoptionApplicationsAllResult {
  const { isAuthenticated, status } = useAuth();

  const query = useApiQuery({
    queryKey: [...QUERY_KEYS.adoption.applications, "all"],
    enabled: enabled && isAuthenticated && status === "authenticated",
    queryFn: () =>
      adoptionService.listMyApplications({
        page_size: 100,
      }),
  });

  return {
    applications: query.data?.items ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: () => {
      void query.refetch();
    },
  };
}
