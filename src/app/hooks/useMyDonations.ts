"use client";

import { useApiQuery, QUERY_KEYS } from "@/lib/api";
import { donationService } from "@/services/api/donation";
import type { DonationResponse } from "@/lib/api";

export interface MyDonationsResult {
  donations: DonationResponse[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
}

/**
 * Hook to retrieve the authenticated user's donation history (`GET /api/v1/donations/history`).
 */
export function useMyDonations(enabled = true): MyDonationsResult {
  const { data, isLoading, isError, error, refetch } = useApiQuery({
    queryKey: QUERY_KEYS.donation.history,
    queryFn: () => donationService.getDonationHistory(),
    enabled,
  });

  return {
    donations: Array.isArray(data) ? data : [],
    isLoading,
    isError,
    error,
    refetch,
  };
}
