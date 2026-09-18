"use client";

import { QUERY_KEYS, getEmptyPaginationMeta } from "@/lib/api";
import { useApiMutation, useApiQuery } from "@/lib/api/hooks";
import { lostFoundService } from "@/services/api/lost-found";
import { reportToCase } from "@/services/api/lost-found/mapper";
import type { LostFoundQueryParams, ReportMatchResponse, OwnershipClaimSubmit, LostFoundReportResponse, Page } from "@/lib/api";
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
  params?: LostFoundQueryParams,
  initialCases?: LostFoundCase[]
): LostFoundListResult {
  const initialData: Page<LostFoundCase> | undefined = initialCases
    ? {
        items: initialCases,
        meta: {
          total: initialCases.length,
          page: 1,
          page_size: initialCases.length,
          total_pages: 1,
        },
      }
    : undefined;

  const { data, isLoading, isError, error, refetch } = useApiQuery({
    queryKey: [QUERY_KEYS.lostFound.reports, kind, params],
    queryFn: () => lostFoundService.getReports(kind, params),
    initialData,
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
export function useLostFoundReport(
  id: string,
  kind?: LostFoundKind,
  initialReport?: LostFoundReportResponse | null
): LostFoundDetailResult {
  const initialCase = initialReport ? reportToCase(initialReport) : undefined;
  const { data, isLoading, isError, error, refetch } = useApiQuery({
    queryKey: [...QUERY_KEYS.lostFound.report(id), kind],
    queryFn: () => lostFoundService.getReportById(id, kind),
    initialData: initialCase,
  });

  return {
    case: data ?? null,
    isLoading: isLoading && !data,
    isError,
    error,
    refetch,
  };
}

/** Related cases of the given kind excluding `currentId`. */
export function useRelatedLostFoundCases(
  currentId: string,
  kind: LostFoundKind,
  limit = 3,
  enabled = true
): { cases: LostFoundCase[]; isLoading: boolean } {
  const { data, isLoading } = useApiQuery({
    queryKey: [QUERY_KEYS.lostFound.reports, "related", currentId, kind, limit],
    queryFn: () => lostFoundService.getReports(kind, { page: 1, page_size: limit + 1 }),
    enabled,
  });

  const cases = (data?.items ?? []).filter((c) => c.id !== currentId).slice(0, limit);
  return { cases, isLoading };
}

export function useReportMatches(
  reportId: string,
  kind?: LostFoundKind,
  enabled = true
): {
  matches: ReportMatchResponse[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
} {
  const { data, isLoading, isError, error, refetch } = useApiQuery<Page<ReportMatchResponse>, ReportMatchResponse[]>({
    queryKey: [...QUERY_KEYS.lostFound.matches(reportId), kind],
    queryFn: () =>
      kind === "found"
        ? lostFoundService.getFoundMatches(reportId)
        : lostFoundService.getMatches(reportId),
    enabled: enabled && Boolean(reportId),
    select: (page: Page<ReportMatchResponse>) => page.items ?? [],
  });

  return {
    matches: data ?? [],
    isLoading,
    isError,
    error,
    refetch,
  };
}

export function useSubmitOwnershipClaim(reportId: string) {
  return useApiMutation<ReportMatchResponse, { matchId: string; data: OwnershipClaimSubmit }>({
    mutationFn: ({ matchId, data }: { matchId: string; data: OwnershipClaimSubmit }) =>
      lostFoundService.claimMatch(matchId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lostFound.report(reportId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lostFound.matches(reportId) });
    },
  });
}