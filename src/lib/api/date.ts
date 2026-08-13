/**
 * Date helpers for API I/O. The backend accepts ISO-8601 strings and
 * returns timestamps in ISO format, so these helpers normalize between
 * `Date`, ISO strings, and date-only strings used in forms.
 */

const DEFAULT_FORMAT: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

/** Format an API date value (ISO string or Date) for display. */
export function formatApiDate(
  value: string | Date | null | undefined,
  options: Intl.DateTimeFormatOptions = DEFAULT_FORMAT,
  locale = "en-US"
): string {
  if (value === null || value === undefined || value === "") return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(locale, options);
}

/** Convert a Date to a `yyyy-mm-dd` string suitable for date inputs. */
export function toApiDate(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Convert a Date to an ISO-8601 string for sending to the API. */
export function toApiDateTime(value: Date): string {
  return value.toISOString();
}

/** Parse an API date value into a `Date`, returning `null` on failure. */
export function parseApiDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
