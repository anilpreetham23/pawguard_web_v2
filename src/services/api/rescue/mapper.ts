/**
 * Adapter that maps the lean backend `RescueRequestResponse` onto the rich
 * display `RescueCase` type used by the rescue UI.
 *
 * The backend contract does not expose animal type/breed, a priority, photo
 * URLs, a responder's identity, or an assigned shelter, so those fields are
 * derived deterministically from the available data (physical condition,
 * behavioral indicators, dispatch timestamps, field reports) with graceful
 * fallbacks — never from mock data.
 */

import type {
  RescueReportResponse,
  RescueRequestResponse,
  RescueStatus,
  SuccessStoryResponse,
} from "@/lib/api";
import type {
  PetCategory,
  RescueCase,
  RescueCaseLocation,
  RescueCaseReporter,
  RescueCaseUpdate,
  RescueCondition,
  RescuePriority,
  RescueTimelineEvent,
  SuccessStory,
} from "@/types";

const TONES = ["amber", "purple", "sky", "rose", "teal"] as const;
const RESCUE_EMOJIS = ["🐾", "🐕", "🐈", "🐕"] as const;

/** Tiny deterministic string hash so the same ticket always gets the same art. */
function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function deriveTone(value: string): string {
  return TONES[hashString(value) % TONES.length];
}

function deriveEmoji(value: string): string {
  return RESCUE_EMOJIS[hashString(value) % RESCUE_EMOJIS.length];
}

/** Best-effort display condition from the backend's free-form condition text. */
function deriveCondition(text: string): RescueCondition {
  const value = text.toLowerCase();
  if (/(injured|bleed|wound|fracture|hurt)/.test(value)) return "injured";
  if (/(trapped|stuck|entangled|locked)/.test(value)) return "trapped";
  if (/(abandoned|neglected|left behind)/.test(value)) return "abandoned";
  if (/(lost|stray|wander|roam)/.test(value)) return "lost";
  return "other";
}

function deriveConditionLabel(text: string): string {
  const value = text.toLowerCase();
  if (/(injured|bleed|wound|fracture|hurt)/.test(value)) return "Injured";
  if (/(trapped|stuck|entangled|locked)/.test(value)) return "Trapped";
  if (/(abandoned|neglected|left behind)/.test(value)) return "Abandoned";
  if (/(lost|stray|wander|roam)/.test(value)) return "Lost";
  return "Distressed";
}

/** Display priority derived from severity hints in the report text. */
function derivePriority(req: RescueRequestResponse): RescuePriority {
  const text = `${req.physical_condition} ${req.behavioral_indicators ?? ""}`.toLowerCase();
  if (
    /(bleed|unconscious|unresponsive|seizure|not breathing|critical)/.test(text)
  ) {
    return "critical";
  }
  if (/(fracture|trapped|stuck|traffic|hit by|severe)/.test(text)) {
    return "high";
  }
  if (/(injured|abandoned|neglected|limping)/.test(text)) return "medium";
  return "low";
}

/** Animal type is not collected by the backend — fall back to "other". */
function deriveAnimalType(): PetCategory {
  return "other";
}

/** Last segment of the address is used as the area label. */
function deriveArea(req: RescueRequestResponse): string {
  const address = req.location_address.trim();
  if (!address) return "Location not specified";
  const parts = address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  return parts[parts.length - 1] ?? address;
}

function deriveLocation(req: RescueRequestResponse): RescueCaseLocation {
  const hasCoordinates =
    req.latitude !== null && req.longitude !== null;
  return {
    area: deriveArea(req),
    address: req.location_address.trim() || "Location not specified",
    landmark: req.location_landmark ?? undefined,
    coordinates:
      hasCoordinates
        ? `${(req.latitude as number).toFixed(5)}, ${(req.longitude as number).toFixed(5)}`
        : "Not shared",
  };
}

function deriveReporter(req: RescueRequestResponse): RescueCaseReporter {
  return {
    name: req.is_anonymous ? "Anonymous Reporter" : req.reporter_name || "Anonymous Reporter",
    contactNumber: req.reporter_phone,
  };
}

function deriveSituation(req: RescueRequestResponse): string {
  const parts: string[] = [];
  if (req.behavioral_indicators) parts.push(req.behavioral_indicators.trim());
  parts.push(`Reported condition: ${req.physical_condition}.`);
  return parts.join(" ");
}

function deriveDaysAgo(createdAt: string): number {
  const created = Date.parse(createdAt);
  if (Number.isNaN(created)) return 0;
  return Math.max(0, Math.floor((Date.now() - created) / 86_400_000));
}

function countPhotos(reports: RescueReportResponse[]): number {
  return reports.reduce((sum, report) => sum + (report.photos?.length ?? 0), 0);
}

function shortId(id: string): string {
  return id.replace(/-/g, "").slice(0, 6).toUpperCase();
}

function buildTitle(req: RescueRequestResponse): string {
  const condition = deriveConditionLabel(req.physical_condition);
  return `${condition} animal needs rescue near ${deriveArea(req)}`;
}

function buildTimeline(req: RescueRequestResponse): RescueTimelineEvent[] {
  const events: RescueTimelineEvent[] = [
    {
      title: "Report received",
      description: `${req.reporter_name || "A reporter"} submitted this incident.`,
      date: req.created_at,
    },
  ];

  const dispatch = req.dispatch;
  if (dispatch) {
    if (dispatch.dispatched_at) {
      events.push({
        title: "Responder dispatched",
        description:
          dispatch.notes ?? `Dispatched to ${req.location_address || "the reported location"}.`,
        date: dispatch.dispatched_at,
      });
    }
    if (dispatch.located_at) {
      events.push({
        title: "Animal located",
        description: "The responder reached the reported location.",
        date: dispatch.located_at,
      });
    }
    if (dispatch.rescued_at) {
      events.push({
        title: "Animal rescued",
        description: "The animal was safely brought under care.",
        date: dispatch.rescued_at,
      });
    }
    if (dispatch.admitted_at) {
      events.push({
        title: "Admitted to care",
        description: "The animal is now receiving care.",
        date: dispatch.admitted_at,
      });
    }
    if (dispatch.failed_at) {
      events.push({
        title: "Rescue marked failed",
        description: dispatch.failure_reason ?? "The rescue could not be completed.",
        date: dispatch.failed_at,
      });
    }
  }

  if (req.status === "rejected" && req.rejection_rationale) {
    events.push({
      title: "Request rejected",
      description: req.rejection_rationale,
      date: req.updated_at,
    });
  }

  return events;
}

function buildUpdates(req: RescueRequestResponse): RescueCaseUpdate[] {
  return req.reports.map((report) => ({
    title: "Field update",
    description: report.notes ?? "Update from the rescue team.",
    date: report.created_at,
    author: `Responder ${shortId(report.agent_id)}`,
  }));
}

/** Map a backend rescue request onto the display `RescueCase` model. */
export function rescueRequestToCase(req: RescueRequestResponse): RescueCase {
  return {
    id: req.id,
    caseNumber: req.ticket_number,
    title: buildTitle(req),
    animalType: deriveAnimalType(),
    breed: "Unknown",
    condition: deriveCondition(req.physical_condition),
    numberOfAnimals: req.animal_count,
    priority: derivePriority(req),
    status: req.status as RescueStatus,
    description: deriveSituation(req),
    location: deriveLocation(req),
    reporter: deriveReporter(req),
    reportedAt: req.created_at,
    reportedDaysAgo: deriveDaysAgo(req.created_at),
    timeline: buildTimeline(req),
    updates: buildUpdates(req),
    assignedVolunteer: null,
    assignedShelter: null,
    tone: deriveTone(req.ticket_number),
    emoji: deriveEmoji(req.ticket_number),
    photosCount: countPhotos(req.reports),
  };
}

/** Best-effort animal name from a story title (e.g. "Max's Great Escape"). */
function deriveAnimalName(title: string): string {
  const trimmed = title.trim();
  if (!trimmed) return "Rescue Hero";
  const apostrophe = trimmed.split("'")[0].trim();
  if (apostrophe) return apostrophe;
  return trimmed.split(/\s+/)[0] ?? "Rescue Hero";
}

/** Map a backend success story onto the display `SuccessStory` model. */
export function successStoryToStory(
  story: SuccessStoryResponse
): SuccessStory {
  const published = story.published_at ?? story.created_at;
  return {
    id: story.id,
    animalName: deriveAnimalName(story.title),
    animalType: "other",
    location: "PawGuard Network",
    rescuedDate: published,
    title: story.title,
    excerpt: story.summary || story.body || "A life saved by the PawGuard community.",
    tone: deriveTone(story.id),
    emoji: deriveEmoji(story.id),
    volunteerNames: [],
  };
}

export type {
  PetCategory,
  RescueCase,
  RescueCondition,
  RescuePriority,
  RescueStatus,
  SuccessStory,
};
