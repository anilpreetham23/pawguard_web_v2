"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import {
  API_DEFAULT_RETRY,
  API_RETRY_BASE_DELAY_MS,
  API_RETRY_MAX_DELAY_MS,
  API_STALE_TIME_MS,
} from "../constants";
import {
  isRetryableError,
  normalizeError,
  type ApiError,
} from "../errors";

export interface UseApiQueryOptions<TData, TSelected = TData> {
  /** React-query key — use `QUERY_KEYS` from `src/lib/api/constants.ts`. */
  queryKey: readonly unknown[];
  /** Data fetcher (typically an `apiGet`/`apiGetPage` call). */
  queryFn: () => Promise<TData>;
  /** Disable the query until a condition is met. */
  enabled?: boolean;
  /** Time the data is considered fresh (default 5 minutes). */
  staleTime?: number;
  /** Retry count on failure (default: transient errors only, 3 tries). */
  retry?: number | boolean | ((failureCount: number, error: unknown) => boolean);
  /** Transforms the data after fetching. */
  select?: (data: TData) => TSelected;
  /** Optional auto-refetch interval (ms). `false` disables polling. */
  refetchInterval?: number | false;
}

/**
 * Retry policy: only transient failures (network drop, timeout, 5xx, 429 —
 * e.g. Render free-tier cold starts that return 502) are retried, with an
 * exponential backoff. Non-retryable client errors surface immediately.
 */
function retryPolicy(failureCount: number, error: unknown): boolean {
  if (failureCount >= API_DEFAULT_RETRY) return false;
  return isRetryableError(error);
}

function retryDelay(failureCount: number): number {
  const backoff = API_RETRY_BASE_DELAY_MS * 2 ** failureCount;
  return Math.min(backoff, API_RETRY_MAX_DELAY_MS);
}

/**
 * Thin wrapper over `useQuery` that normalizes every failure to an `ApiError`
 * so `error.isUnauthorized` / `error.isNotFound` etc. are always available.
 * Transient failures are retried with an exponential backoff.
 */
export function useApiQuery<TData, TSelected = TData>(
  options: UseApiQueryOptions<TData, TSelected>
): UseQueryResult<TSelected, ApiError> {
  const {
    queryKey,
    queryFn,
    enabled,
    staleTime = API_STALE_TIME_MS,
    retry = retryPolicy,
    select,
    refetchInterval,
  } = options;

  return useQuery<TData, ApiError, TSelected>({
    queryKey,
    enabled,
    staleTime,
    retry,
    retryDelay,
    select,
    refetchInterval,
    queryFn: async () => {
      try {
        return await queryFn();
      } catch (error) {
        throw normalizeError(error);
      }
    },
  });
}
