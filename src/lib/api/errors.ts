/**
 * Centralized API error model and helpers.
 *
 * Every error produced by the HTTP client is normalized to an `ApiError`
 * with a `kind`, a numeric `status` (when available), and structured field
 * errors for 422 validation responses. UI code can rely on `getErrorMessage`
 * to render a human-friendly message without inspecting raw axios errors.
 */

import { isAxiosError } from "axios";
import type { ApiErrorDetail, FieldValidationError } from "./types";

export type ApiErrorKind =
  | "network"
  | "timeout"
  | "http"
  | "validation"
  | "unknown";

interface ApiErrorOptions {
  message: string;
  kind?: ApiErrorKind;
  status?: number | null;
  code?: string;
  detail?: ApiErrorDetail;
  fieldErrors?: FieldValidationError[];
  originalError?: unknown;
}

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status: number | null;
  readonly code: string;
  readonly detail: ApiErrorDetail;
  readonly fieldErrors: FieldValidationError[];
  readonly originalError?: unknown;

  constructor(options: ApiErrorOptions) {
    super(options.message);
    this.name = "ApiError";
    this.kind = options.kind ?? "http";
    this.status = options.status ?? null;
    this.code = options.code ?? "";
    this.detail = options.detail ?? null;
    this.fieldErrors = options.fieldErrors ?? [];
    if (options.originalError !== undefined) {
      this.originalError = options.originalError;
    }
  }

  /** 401 — unauthenticated. */
  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  /** 403 — authenticated but not allowed. */
  get isForbidden(): boolean {
    return this.status === 403;
  }

  /** 404 — resource not found. */
  get isNotFound(): boolean {
    return this.status === 404;
  }

  /** 422 — request body/query failed validation. */
  get isValidationError(): boolean {
    return this.kind === "validation" || this.status === 422;
  }

  /** 5xx — server-side failure. */
  get isServerError(): boolean {
    return this.status !== null && this.status >= 500;
  }

  /** Connection dropped before a response arrived. */
  get isNetworkError(): boolean {
    return this.kind === "network";
  }

  /** Request exceeded the configured timeout. */
  get isTimeoutError(): boolean {
    return this.kind === "timeout";
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/* -------------------------------------------------------------------------- */
/* Normalization                                                              */
/* -------------------------------------------------------------------------- */

const TIMEOUT_CODES = new Set(["ECONNABORTED", "ETIMEDOUT"]);

function isValidationDetail(detail: unknown): detail is FieldValidationError[] {
  return (
    Array.isArray(detail) &&
    detail.length > 0 &&
    typeof detail[0] === "object" &&
    detail[0] !== null &&
    "msg" in detail[0]
  );
}

/** Extract a human message from a raw error/response body. */
function messageFromDetail(detail: unknown, status: number | null): string {
  if (typeof detail === "string" && detail.trim()) return detail;
  if (isValidationDetail(detail)) {
    return detail[0]?.msg ?? "Please review your input and try again.";
  }
  if (detail && typeof detail === "object" && "message" in detail) {
    const message = (detail as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  const httpMessages: Record<number, string> = {
    400: "The request was invalid. Please try again.",
    401: "You need to sign in to continue.",
    403: "You don't have permission to do that.",
    404: "The requested resource could not be found.",
    409: "The request conflicts with the current state. Please try again.",
    422: "Please review your input and try again.",
    429: "Too many requests. Please wait a moment and try again.",
    500: "Something went wrong on our end. Please try again later.",
  };
  if (status !== null && httpMessages[status]) return httpMessages[status];
  return "Something went wrong. Please try again.";
}

/**
 * Convert any thrown value into an `ApiError`. Handles axios errors
 * (timeout / network / HTTP with response body), envelope-level failures,
 * and unexpected values.
 */
export function normalizeError(error: unknown): ApiError {
  if (isApiError(error)) return error;

  if (isAxiosError(error)) {
    const status = error.response?.status ?? null;
    const body = error.response?.data;

    // Timeout (request aborted or exceeded the configured timeout).
    if (TIMEOUT_CODES.has(error.code ?? "")) {
      return new ApiError({
        kind: "timeout",
        status: null,
        code: "TIMEOUT",
        message: "The request took too long to complete. Please try again.",
        originalError: error,
      });
    }

    // Request was sent but no response received (network failure).
    if (error.request && status === null) {
      return new ApiError({
        kind: "network",
        status: null,
        code: "NETWORK_ERROR",
        message:
          "We couldn't reach our servers. Check your connection and try again.",
        originalError: error,
      });
    }

    // HTTP error with a response body.
    const detail =
      body !== undefined && body !== null
        ? extractDetail(body)
        : null;
    const isValidation = isValidationDetail(detail) || status === 422;
    return new ApiError({
      kind: isValidation ? "validation" : "http",
      status,
      code: extractErrorCode(body) ?? `HTTP_${status ?? "UNKNOWN"}`,
      message: messageFromDetail(detail, status),
      detail,
      fieldErrors: isValidationDetail(detail) ? detail : [],
      originalError: error,
    });
  }

  if (typeof error === "string") {
    return new ApiError({
      kind: "unknown",
      message: error,
    });
  }

  if (error instanceof Error) {
    return new ApiError({
      kind: "unknown",
      message: error.message || "Something went wrong. Please try again.",
      originalError: error,
    });
  }

  return new ApiError({
    kind: "unknown",
    message: "An unexpected error occurred. Please try again.",
    originalError: error,
  });
}

/** Pull a `detail`-style payload out of an axios response body. */
function extractDetail(body: unknown): ApiErrorDetail {
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;

    // Backend error envelope: `{ success: false, error: { code, message, details } }`.
    const error = record.error;
    if (error && typeof error === "object" && !Array.isArray(error)) {
      const errorRecord = error as Record<string, unknown>;
      const details = errorRecord.details;
      // 422 validation failures carry the field errors in `error.details`.
      if (Array.isArray(details) && isValidationDetail(details)) {
        return details;
      }
      if (typeof errorRecord.message === "string") {
        return {
          message: errorRecord.message,
          code: typeof errorRecord.code === "string" ? errorRecord.code : undefined,
          details: details ?? null,
        };
      }
      return errorRecord;
    }

    if ("detail" in body) return (body as { detail: ApiErrorDetail }).detail;
    if ("message" in body) return (body as { message: string }).message;
    if ("data" in body) {
      const data = (body as { data: unknown }).data;
      if (
        data &&
        typeof data === "object" &&
        "message" in data &&
        (data as { message: unknown }).message !== null
      ) {
        return { message: (data as { message: unknown }).message as string };
      }
    }
    return record;
  }
  return null;
}

/** Extract the backend's error code (e.g. `INVALID_CREDENTIALS`), if present. */
function extractErrorCode(body: unknown): string | undefined {
  if (body && typeof body === "object") {
    const error = (body as { error?: unknown }).error;
    if (error && typeof error === "object") {
      const code = (error as { code?: unknown }).code;
      if (typeof code === "string") return code;
    }
  }
  return undefined;
}

/* -------------------------------------------------------------------------- */
/* Read helpers                                                               */
/* -------------------------------------------------------------------------- */

/** User-friendly message for any error, with a safe fallback. */
export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  const normalized = normalizeError(error);
  return normalized.message?.trim() ? normalized.message : fallback;
}

/** Field-level validation errors (from 422 responses), if any. */
export function getFieldErrors(error: unknown): FieldValidationError[] {
  return normalizeError(error).fieldErrors;
}

/** True when the error is any of the "user can retry" categories. */
export function isRetryableError(error: unknown): boolean {
  const normalized = normalizeError(error);
  return (
    normalized.isNetworkError ||
    normalized.isTimeoutError ||
    normalized.isServerError ||
    normalized.status === 429
  );
}
