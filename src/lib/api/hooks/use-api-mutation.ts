"use client";

import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { normalizeError, type ApiError } from "../errors";

/**
 * Thin wrapper over `useMutation` that normalizes every failure to an
 * `ApiError`. Future forms call this instead of raw `useMutation` so they
 * always get typed, normalized errors.
 */
export function useApiMutation<
  TData,
  TVariables = void,
  TContext = unknown,
>(
  options: UseMutationOptions<TData, ApiError, TVariables, TContext>
): UseMutationResult<TData, ApiError, TVariables, TContext> {
  const { mutationFn, ...rest } = options;

  return useMutation<TData, ApiError, TVariables, TContext>({
    ...rest,
    mutationFn: async (variables, context) => {
      try {
        return await mutationFn!(variables, context);
      } catch (error) {
        throw normalizeError(error);
      }
    },
  });
}
