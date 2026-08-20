"use client";

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
 * Authoritative foster lifecycle status from the user's dashboard summary (`GET /portal/me/dashboard`).
 * Returns typed foster profile, status enum, canApply flag, and helper booleans.
 */
export function useFosterStatus(): FosterStatusResult {
  const { summary, isLoading, isError, error, refetch } = useDashboardSummary();

  const rawProfile = summary?.foster_profile ?? null;
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
