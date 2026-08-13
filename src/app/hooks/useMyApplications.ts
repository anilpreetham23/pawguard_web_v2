"use client";

import { QUERY_KEYS, useApiQuery } from "@/lib/api";
import { adoptionService } from "@/services/api/adoption";
import type { AdoptionApplicationResponse, AdoptionStatus } from "@/lib/api";
import { useAuth } from "../providers/auth-provider";

export interface MyApplicationsResult {
  applications: AdoptionApplicationResponse[];
  total: number;
  totalPages: number;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
}

export const ADOPTION_STATUS_ORDER: AdoptionStatus[] = [
  "submitted",
  "screening",
  "vetting",
  "interview",
  "home_check",
  "approved",
  "completed",
];

export const ADOPTION_STATUS_LABEL: Record<AdoptionStatus, string> = {
  submitted: "Submitted",
  screening: "Screening",
  vetting: "Vetting",
  interview: "Interview",
  home_check: "Home Check",
  approved: "Approved",
  completed: "Completed",
  rejected: "Rejected",
};

/** Position in the pipeline (1..7). Rejected applications sit outside the pipeline. */
export function adoptionStatusStep(status: AdoptionStatus): number {
  const index = ADOPTION_STATUS_ORDER.indexOf(status);
  return index === -1 ? 0 : index + 1;
}

/**
 * The signed-in user's adoption applications, sorted newest-first. Gated on an
 * active session — signed-out visitors get an empty result.
 */
export function useMyApplications(page = 1, pageSize = 10): MyApplicationsResult {
  const { isAuthenticated, status } = useAuth();
  const enabled = isAuthenticated && status === "authenticated";

  const query = useApiQuery({
    queryKey: [QUERY_KEYS.adoption.applications, "my", page, pageSize],
    enabled,
    queryFn: () =>
      adoptionService.listMyApplications({ page, page_size: pageSize }),
  });

  return {
    applications: query.data?.items ?? [],
    total: query.data?.meta.total ?? 0,
    totalPages: query.data?.meta.total_pages ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: () => {
      void query.refetch();
    },
  };
}
