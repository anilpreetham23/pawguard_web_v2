"use client";

import { useApiMutation, useApiQuery, QUERY_KEYS, getEmptyPaginationMeta } from "@/lib/api";
import { lostFoundService } from "@/services/api/lost-found";
import type { LostFoundQueryParams, ReportMatchResponse, OwnershipClaimSubmit } from "@/lib/api";
import type { LostFoundCase, LostFoundKind } from "@/types";
import { queryClient } from "@/lib/react-query";

export interface LostFoundListResult {
  cases: LostFoundCase[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
}

/** Paginated list of display-ready lost/found cases for the given kind. */
export function useLostFoundReports(
  kind: LostFoundKind,
  params?: LostFoundQueryParams
): LostFoundListResult {
  const { data, isLoading, isError, error, refetch } = useApiQuery({
    queryKey: [QUERY_KEYS.lostFound.reports, kind, params],
    queryFn: () => lostFoundService.getReports(kind, params),
  });

  return {
    cases: data?.items ?? [],
    total: data?.meta.total ?? 0,
    totalPages: data?.meta.total_pages ?? 0,
    page: data?.meta.page ?? 1,
    pageSize: data?.meta.page_size ?? 0,
    isLoading,
    isError,
    error,
    refetch,
  };
}

export interface LostFoundDetailResult {
  case: LostFoundCase | null;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
}

/** Single report resolved through its direct detail endpoint. */
export function useLostFoundReport(id: string): LostFoundDetailResult {
  const { data, isLoading, isError, error, refetch } = useApiQuery({
    queryKey: QUERY_KEYS.lostFound.report(id),
    queryFn: () => lostFoundService.getReportById(id),
  });

  return {
    case: data ?? null,
    isLoading,
    isError,
    error,
    refetch,
  };
}

export interface RelatedCasesResult {
  cases: LostFoundCase[];
  isLoading: boolean;
}

/** Latest cases of the same kind, used as related entries on the detail page. */
export function useRelatedLostFoundCases(
  id: string,
  kind: LostFoundKind,
  limit = 3,
  enabled = true
): RelatedCasesResult {
  const { data, isLoading } = useApiQuery({
    queryKey: [...QUERY_KEYS.lostFound.reports, "related", id, kind, limit],
    enabled,
    queryFn: () =>
      lostFoundService.getRelatedCases(id, kind, limit).then((items) => ({
        items,
        meta: getEmptyPaginationMeta(),
      })),
  });

  return {
    cases: data?.items ?? [],
    isLoading,
  };
}

export interface MatchesResult {
  matches: ReportMatchResponse[];
  total: number;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
  claim: (matchId: string, data: OwnershipClaimSubmit) => Promise<ReportMatchResponse>;
  claimPending: boolean;
  confirmedCount: number;
  pendingCount: number;
}

/** Potential matching reports for a lost/found case, via the live match endpoints. */
export function useReportMatches(
  id: string,
  kind: LostFoundKind,
  enabled = true
): MatchesResult {
  const query = useApiQuery({
    queryKey: QUERY_KEYS.lostFound.matches(id),
    enabled,
    queryFn: () =>
      kind === "lost"
        ? lostFoundService.getMatches(id, { page_size: 20 })
        : lostFoundService.getFoundMatches(id, { page_size: 20 }),
  });

  const claimMutation = useApiMutation<ReportMatchResponse, { matchId: string; data: OwnershipClaimSubmit }>({
    mutationFn: ({ matchId, data }) => lostFoundService.claimMatch(matchId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lostFound.matches(id) });
    },
  });

  const matches = query.data?.items ?? [];

  return {
    matches,
    total: query.data?.meta.total ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: () => {
      void query.refetch();
    },
    claim: async (matchId, data) => {
      return claimMutation.mutateAsync({ matchId, data });
    },
    claimPending: claimMutation.isPending,
    confirmedCount: matches.filter((m) => m.status === "confirmed").length,
    pendingCount: matches.filter((m) => m.status === "pending").length,
  };
}