/**
 * Adapter that maps the lean backend lost/found report responses onto the
 * rich display `LostFoundCase` type used by the lost-found UI.
 *
 * The backend contract does not expose gender, size, age, condition, reward,
 * distinctive marks, or a direct reporter phone number, so those fields are
 * derived deterministically from the available data (species, breed, colors,
 * location, timestamps) with graceful fallbacks — never from mock data.
 */

import type {
  FoundReportResponse,
  LostFoundReportStatus,
  LostReportResponse,
  Species,
} from "@/lib/api";
import type {
  LostFoundCase,
  LostFoundKind,
  LostFoundTimelineEvent,
  PetCategory,
  PetCondition,
  PetGender,
  PetSize,
} from "@/types";

const TONES = ["amber", "sky", "rose", "teal", "violet", "indigo"] as const;
const SPECIES_EMOJIS: Record<Species, string> = {
  dog: "🐕",
  cat: "🐈",
  bird: "🐦",
  rabbit: "🐇",
  other: "🐾",
};

/** Tiny deterministic string hash so the same report always gets the same art. */
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

function deriveEmoji(species: Species): string {
  return SPECIES_EMOJIS[species];
}

/** Uppercased first six hex chars of the uuid, used for a stable case number. */
function shortId(id: string): string {
  return id.replace(/-/g, "").slice(0, 6).toUpperCase();
}

function deriveDaysAgo(value: string): number {
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return 0;
  return Math.max(0, Math.floor((Date.now() - parsed) / 86_400_000));
}

/** Split an ISO datetime into readable display date and time. */
function splitDateTime(value: string): { date: string; time: string } {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return { date: "Not specified", time: "" };
  }
  const date = parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const time = parsed.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return { date, time };
}

/** Fields the backend does not collect — deterministic, graceful fallbacks. */
function deriveFallbacks(): {
  age: string;
  gender: PetGender | "unknown";
  size: PetSize;
  condition: PetCondition;
  reward: string;
  distinctiveMarks: string;
} {
  return {
    age: "Unknown",
    gender: "unknown",
    size: "medium",
    condition: "unknown",
    reward: "",
    distinctiveMarks: "",
  };
}

function buildTimeline(
  kind: LostFoundKind,
  createdAt: string,
  eventAt: string,
  status: LostFoundReportStatus
): LostFoundTimelineEvent[] {
  const events: LostFoundTimelineEvent[] = [
    {
      title: "Report received",
      description:
        kind === "lost"
          ? "The missing pet was reported to PawGuard."
          : "The roaming animal was reported to PawGuard.",
      date: createdAt,
    },
    {
      title: kind === "lost" ? "Pet reported missing" : "Animal found",
      description:
        kind === "lost"
          ? "The pet was last seen at the reported location."
          : "The animal was found at the reported location.",
      date: eventAt,
    },
  ];

  if (status === "resolved") {
    events.push({
      title: "Marked resolved",
      description: "This report was resolved and the case is now closed.",
      date: createdAt,
    });
  } else if (status === "expired") {
    events.push({
      title: "Marked expired",
      description: "This report has expired after its active window.",
      date: createdAt,
    });
  }

  return events;
}

function buildDescription(
  kind: LostFoundKind,
  petName: string,
  breed: string,
  color: string,
  location: string
): string {
  const colorClause = color ? ` It has ${color} markings.` : "";
  return kind === "lost"
    ? `${petName || "A pet"}, a ${breed || "pet"}, was reported missing near ${location}.${colorClause}`
    : `A ${breed || "pet"} was found near ${location}.${colorClause}`;
}

import type { ReportMediaResponse } from "@/lib/api";

function extractMediaInfo(report: {
  photo_url?: string | null;
  media?: ReportMediaResponse[];
}): {
  primaryPhotoUrl: string | null;
  videoUrl: string | null;
  galleryPhotoUrls: string[];
  mediaItems: ReportMediaResponse[];
} {
  const mediaItems = report.media ? [...report.media].sort((a, b) => a.display_order - b.display_order) : [];

  const videoItem = mediaItems.find((m) => m.media_type === "video");
  const videoUrl = videoItem?.url || null;

  const photoItems = mediaItems.filter((m) => m.media_type === "photo");
  const primaryItem = photoItems.find((m) => m.is_primary) || photoItems[0];

  const primaryPhotoUrl =
    primaryItem?.url ||
    report.photo_url ||
    (report as Record<string, any>).image_url ||
    (report as Record<string, any>).photo ||
    (report as Record<string, any>).image ||
    null;

  const galleryPhotoUrls: string[] = [];
  photoItems.forEach((m) => {
    if (m.url) galleryPhotoUrls.push(m.url);
  });

  if (galleryPhotoUrls.length === 0 && primaryPhotoUrl) {
    galleryPhotoUrls.push(primaryPhotoUrl);
  }

  return {
    primaryPhotoUrl,
    videoUrl,
    galleryPhotoUrls,
    mediaItems,
  };
}

/** Map a backend lost-pet report onto the display `LostFoundCase` model. */
export function lostReportToCase(report: LostReportResponse): LostFoundCase {
  const fallbacks = deriveFallbacks();
  const { date, time } = splitDateTime(report.lost_at);
  const mediaInfo = extractMediaInfo(report);

  return {
    id: report.id,
    caseNumber: `LST-${shortId(report.id)}`,
    kind: "lost",
    petName: report.pet_name,
    animalType: report.species as PetCategory,
    breed: report.breed,
    age: fallbacks.age,
    gender: fallbacks.gender,
    color: report.color,
    size: fallbacks.size,
    distinctiveMarks: fallbacks.distinctiveMarks,
    condition: fallbacks.condition,
    date,
    time,
    location: report.location_address,
    reward: fallbacks.reward,
    description: buildDescription(
      "lost",
      report.pet_name,
      report.breed,
      report.color,
      report.location_address
    ),
    status: report.status,
    reporterName: report.user?.full_name || "PawGuard Member",
    contactNumber: "",
    email: report.user?.email || "",
    reportedAt: report.created_at,
    reportedDaysAgo: deriveDaysAgo(report.created_at),
    timeline: buildTimeline("lost", report.created_at, report.lost_at, report.status),
    tone: deriveTone(report.id),
    emoji: deriveEmoji(report.species),
    photosCount: mediaInfo.galleryPhotoUrls.length,
    photoUrl: mediaInfo.primaryPhotoUrl,
    videoUrl: mediaInfo.videoUrl,
    galleryPhotoUrls: mediaInfo.galleryPhotoUrls,
    mediaItems: mediaInfo.mediaItems,
    latitude: report.latitude,
    longitude: report.longitude,
    microchipId: report.microchip_id,
    userId: report.user_id || report.user?.id,
  };
}

/** Map a backend found-animal report onto the display `LostFoundCase` model. */
export function foundReportToCase(report: FoundReportResponse): LostFoundCase {
  const fallbacks = deriveFallbacks();
  const { date, time } = splitDateTime(report.found_at);
  const mediaInfo = extractMediaInfo(report);

  return {
    id: report.id,
    caseNumber: `FND-${shortId(report.id)}`,
    kind: "found",
    petName: "Unidentified Pet",
    animalType: report.species as PetCategory,
    breed: report.breed_observed,
    age: fallbacks.age,
    gender: fallbacks.gender,
    color: report.color_observed,
    size: fallbacks.size,
    distinctiveMarks: fallbacks.distinctiveMarks,
    condition: fallbacks.condition,
    date,
    time,
    location: report.location_address,
    reward: fallbacks.reward,
    description: buildDescription(
      "found",
      "",
      report.breed_observed,
      report.color_observed,
      report.location_address
    ),
    status: report.status,
    reporterName: report.user?.full_name || "PawGuard Member",
    contactNumber: "",
    email: report.user?.email || "",
    reportedAt: report.created_at,
    reportedDaysAgo: deriveDaysAgo(report.created_at),
    timeline: buildTimeline(
      "found",
      report.created_at,
      report.found_at,
      report.status
    ),
    tone: deriveTone(report.id),
    emoji: deriveEmoji(report.species),
    photosCount: mediaInfo.galleryPhotoUrls.length,
    photoUrl: mediaInfo.primaryPhotoUrl,
    videoUrl: mediaInfo.videoUrl,
    galleryPhotoUrls: mediaInfo.galleryPhotoUrls,
    mediaItems: mediaInfo.mediaItems,
    latitude: report.latitude,
    longitude: report.longitude,
    userId: report.user_id || report.user?.id,
  };
}

export type {
  LostFoundCase,
  LostFoundKind,
  LostFoundReportStatus,
  PetCategory,
  PetCondition,
  PetGender,
  PetSize,
  Species,
};
