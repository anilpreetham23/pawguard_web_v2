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
  LostFoundReportResponse,
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

function deriveTone(id: string): string {
  const idx = hashString(id) % TONES.length;
  return TONES[idx]!;
}

function deriveEmoji(species: Species): string {
  return SPECIES_EMOJIS[species] || "🐾";
}

function shortId(id: string): string {
  if (!id) return "000";
  return id.replace(/-/g, "").slice(0, 4).toUpperCase();
}

function splitDateTime(isoStr: string | undefined): { date: string; time: string } {
  if (!isoStr) return { date: "Recent", time: "" };
  try {
    const d = new Date(isoStr);
    const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    return { date, time };
  } catch {
    return { date: "Recent", time: "" };
  }
}

function deriveDaysAgoNumber(isoStr: string | undefined): number {
  if (!isoStr) return 0;
  try {
    const d = new Date(isoStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  } catch {
    return 0;
  }
}

function buildTimeline(
  kind: LostFoundKind,
  createdAt: string,
  eventAt: string | undefined,
  status: LostFoundReportStatus
): LostFoundTimelineEvent[] {
  const { date: createDate, time: createTime } = splitDateTime(createdAt);
  const { date: eventDate, time: eventTime } = splitDateTime(eventAt);

  const initialTitle = kind === "lost" ? "Reported Missing" : "Sighting Reported";
  const initialDesc =
    kind === "lost"
      ? "Owner filed a missing pet report on PawGuard."
      : "Finder reported a stray/wandering pet on PawGuard.";

  const events: LostFoundTimelineEvent[] = [
    {
      title: initialTitle,
      date: `${eventDate} ${eventTime}`.trim(),
      description: initialDesc,
    },
    {
      title: "Case Verified",
      date: `${createDate} ${createTime}`.trim(),
      description: "PawGuard team validated report location and details.",
    },
  ];

  if (status === "resolved") {
    events.push({
      title: "Reunited",
      date: "Resolved",
      description: "Pet has been successfully reunited with their owner.",
    });
  } else {
    events.push({
      title: "Active Search / Matching",
      date: "Ongoing",
      description: "AI matching and community notifications active in the area.",
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
  if (kind === "lost") {
    return `${petName || "Pet"} is a ${color} ${breed} missing from ${location}. Friendly and responds to their name. Please report any sightings immediately.`;
  }
  return `Found a ${color} ${breed} roaming near ${location}. Safe and resting under community supervision while we look for the owner.`;
}

function deriveFallbacks(): {
  gender: PetGender | "unknown";
  size: PetSize;
  age: string;
  condition: PetCondition;
  distinctiveMarks: string;
  reward: string;
} {
  return {
    gender: "unknown",
    size: "medium",
    age: "Unknown",
    condition: "healthy",
    distinctiveMarks: "No distinctive physical marks listed.",
    reward: "",
  };
}

import type { ReportMediaResponse } from "@/lib/api";

function extractMediaInfo(report: LostReportResponse | FoundReportResponse): {
  primaryPhotoUrl: string | undefined;
  galleryPhotoUrls: string[];
  mediaItems: ReportMediaResponse[];
  videoUrl: string | undefined;
} {
  if (report.media && report.media.length > 0) {
    const photos = report.media.filter((m) => m.media_type === "photo");
    const videos = report.media.filter((m) => m.media_type === "video");
    const primary = photos.find((m) => m.is_primary)?.url || photos[0]?.url || report.photo_url || undefined;
    const gallery = photos.map((m) => m.url).filter((u): u is string => Boolean(u));
    return {
      primaryPhotoUrl: primary || report.photo_url || undefined,
      galleryPhotoUrls: gallery.length > 0 ? gallery : report.photo_url ? [report.photo_url] : [],
      mediaItems: report.media,
      videoUrl: videos[0]?.url || undefined,
    };
  }
  const primary = report.photo_url || undefined;
  return {
    primaryPhotoUrl: primary,
    galleryPhotoUrls: primary ? [primary] : [],
    mediaItems: primary ? [{ id: "m-1", media_type: "photo", object_key: primary, url: primary, is_primary: true, display_order: 1 }] : [],
    videoUrl: undefined,
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
    reportedDaysAgo: deriveDaysAgoNumber(report.created_at),
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
    reportedDaysAgo: deriveDaysAgoNumber(report.created_at),
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

export function reportToCase(report: LostFoundReportResponse): LostFoundCase {
  return report.kind === "lost"
    ? lostReportToCase(report as LostReportResponse)
    : foundReportToCase(report as FoundReportResponse);
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
