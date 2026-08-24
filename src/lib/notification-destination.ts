import type { NotificationResponse } from "@/lib/api";

/**
 * Notification → destination mapper for the public website.
 *
 * The backend supplies an `action_url` on notifications, but those URLs are
 * aimed at surfaces that may not exist on the public site (e.g. admin or
 * detail routes), which previously sent users to the custom 404 page. The
 * notification payload exposes no reliable entity id, only `notification_type`,
 * `title`, `body`, and `action_url`.
 *
 * This helper therefore maps each notification to an EXISTING public route by
 * (1) type, then (2) a light title/body heuristic. `action_url` is only
 * honoured when it exactly matches a known public page — never crafted by
 * concatenating unknown ids. The returned path is always a live route, so
 * "View details" can never 404.
 */

/** Static public pages that exist on the public site (verified against the build). */
const EXACT_PUBLIC_ROUTES = new Set<string>([
  "/",
  "/about",
  "/account",
  "/account/pets",
  "/adopt",
  "/applications",
  "/appointments",
  "/appointments/book",
  "/contact",
  "/donate",
  "/emergency",
  "/lost-found",
  "/notifications",
  "/reminders",
  "/scan",
  "/stories",
  "/veterinary",
  "/volunteer",
]);

/** Best existing page for a notification, keyed by (normalized) type. */
const TYPE_DESTINATION: Record<string, string> = {
  adoption: "/applications",
  application: "/applications",
  appointment: "/appointments",
  reminder: "/reminders",
  donation: "/account",
  rescue: "/lost-found",
  emergency: "/lost-found",
  emergency_rescue: "/lost-found",
  lost_pet: "/lost-found",
  lost_found: "/lost-found",
  lostfound: "/lost-found",
  found: "/lost-found",
  foster: "/account",
  volunteer: "/volunteer",
  system: "/account",
  broadcast: "/",
  account: "/account",
  pets: "/account/pets",
  companion: "/account/pets",
};

function normalizeType(type: string | null): string {
  return (type ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

/**
 * A relative, exact public route or verified dynamic public path is the only
 * trustworthy action_url form.
 */
function sanitizeActionUrl(actionUrl: string | null): string | null {
  if (!actionUrl) return null;
  const path = actionUrl.split(/[?#]/)[0];
  if (!path.startsWith("/")) return null;

  // Exact static public routes
  if (EXACT_PUBLIC_ROUTES.has(path)) return path;

  // Lost & Found dynamic report routes: /lost-found/lost/*, /lost-found/found/*, /lost-found/*
  if (/^\/lost-found\/(?:lost\/|found\/)?[a-zA-Z0-9_-]+$/.test(path)) {
    return path;
  }

  return null;
}

/**
 * Resolve a notification to a guaranteed-existing public route.
 */
export function getNotificationDestination(
  notification: Pick<NotificationResponse, "notification_type" | "title" | "body" | "action_url">
): string {
  const fromAction = sanitizeActionUrl(notification.action_url);
  if (fromAction) return fromAction;

  const type = normalizeType(notification.notification_type);
  if (type && TYPE_DESTINATION[type]) return TYPE_DESTINATION[type];

  // Light title/body fallback so an unknown type still lands somewhere useful.
  const haystack = `${notification.title ?? ""} ${notification.body ?? ""}`.toLowerCase();
  if (/\bcompanion\b|\badd .*\bpet/.test(haystack)) return "/account/pets";
  if (/\badoption\b/.test(haystack)) return "/applications";
  if (/\bappointment\b/.test(haystack)) return "/appointments";
  if (/\breminder\b/.test(haystack)) return "/reminders";
  if (/\blost\b|\bfound\b|\bemergency\b|\brescue\b/.test(haystack)) return "/lost-found";

  return "/account";
}
