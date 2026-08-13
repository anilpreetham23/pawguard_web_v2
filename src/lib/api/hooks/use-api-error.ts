"use client";

import { useMemo } from "react";
import { getErrorMessage } from "../errors";

/**
 * Resolve an unknown error (react-query's `error`, a caught value, etc.)
 * to a stable, human-friendly message for rendering in the UI.
 */
export function useApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string | null {
  return useMemo(
    () => (error === null || error === undefined ? null : getErrorMessage(error, fallback)),
    [error, fallback]
  );
}
