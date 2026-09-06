"use client";

import { QUERY_KEYS, useApiQuery } from "@/lib/api";
import { fosterService } from "@/services/api/foster";
import { useAuth } from "../providers/auth-provider";
import { useDashboardSummary } from "./useDashboardSummary";
import type { FosterProfileResponse } from "@/lib/api";

export type FosterLifecycleStatus =
  | "NOT_APPLIED"
  | "APPLIED"
  | "APPROVED"
  | "REJECTED"
  | "INACTIVE";

export interface FosterStatusResult {
  fosterProfile: FosterProfileResponse | null;
  status: FosterLifecycleStatus;
  canApply: boolean;
  isApproved: boolean;
  isPending: boolean;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
}

/**
 * Authoritative foster lifecycle status from GET /api/v1/fosters/me with fallback to user's dashboard summary (`GET /portal/me/dashboard`).
 * Returns typed foster profile, status enum, canApply flag, and helper booleans.
 */
export function useFosterStatus(): FosterStatusResult {
  const { summary, isLoading: summaryLoading, isError: summaryIsError, error: summaryError, refetch: refetchSummary } = useDashboardSummary();
  const { isAuthenticated, status: authStatus } = useAuth();
  const enabled = isAuthenticated && authStatus === "authenticated";

  const profileQuery = useApiQuery({
    queryKey: QUERY_KEYS.foster.me,
    enabled,
    queryFn: () => fosterService.getMyProfile(),
  });

  const rawProfile = profileQuery.data ?? (summary?.foster_profile as FosterProfileResponse | null) ?? null;
  const fosterProfile = rawProfile as FosterProfileResponse | null;

  let status: FosterLifecycleStatus = "NOT_APPLIED";
  if (fosterProfile) {
    switch (fosterProfile.status) {
      case "applied":
        status = "APPLIED";
        break;
      case "approved":
        status = "APPROVED";
        break;
      case "rejected":
        status = "REJECTED";
        break;
      case "inactive":
        status = "INACTIVE";
        break;
      default:
        status = "APPLIED";
    }
  }

  const canApply =
    !fosterProfile ||
    status === "NOT_APPLIED" ||
    status === "REJECTED" ||
    status === "INACTIVE";
  const isApproved = status === "APPROVED";
  const isPending = status === "APPLIED";

  const isLoading = summaryLoading || (enabled && profileQuery.isLoading && !summary?.foster_profile);
  const isError = summaryIsError || profileQuery.isError;
  const error = profileQuery.error ?? summaryError;

  const refetch = () => {
    void refetchSummary();
    void profileQuery.refetch();
  };

  return {
    fosterProfile,
    status,
    canApply,
    isApproved,
    isPending,
    isLoading,
    isError,
    error,
    refetch,
  };
}
