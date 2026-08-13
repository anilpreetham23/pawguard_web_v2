/**
 * Adapter that maps the lean backend contact DTOs onto the display types used
 * by the contact & support UI.
 *
 * The backend FAQ entries and contact locations do not carry display-only
 * fields (view counts, popular flags, tone/icon choices), so those are
 * derived deterministically from the available data with graceful fallbacks —
 * never from mock data. This mirrors the rescue and community mappers.
 */

import type {
  ContactLocationResponse,
  FAQEntryResponse,
  VeterinaryPartnerResponse,
} from "@/lib/api";
import type {
  ContactDepartment,
  ContactInfoItem,
  EmergencyContact,
  FaqCategory,
  FaqEntry,
  SupportArticle,
  VeterinaryPartner,
} from "@/types";

/* -------------------------------------------------------------------------- */
/* FAQ                                                                        */
/* -------------------------------------------------------------------------- */

/** Normalize the backend's free-form FAQ category onto the display union. */
const FAQ_CATEGORY_ALIASES: Record<string, FaqCategory> = {
  general: "general",
  adoption: "adoption",
  adoptions: "adoption",
  rescue: "rescue",
  "lost-found": "lost-found",
  lost_found: "lost-found",
  lostfound: "lost-found",
  donations: "donations",
  donation: "donations",
  volunteer: "volunteer",
  volunteering: "volunteer",
  account: "account",
  technical: "technical",
  tech: "technical",
  support: "technical",
};

export function normalizeFaqCategory(value: string): FaqCategory {
  const key = (value ?? "").trim().toLowerCase();
  return FAQ_CATEGORY_ALIASES[key] ?? "general";
}

/** Map a FAQ category onto the `ContactDepartment` used by support cards. */
const FAQ_TO_DEPARTMENT: Record<FaqCategory, ContactDepartment> = {
  general: "general",
  adoption: "adoption",
  rescue: "rescue",
  "lost-found": "general",
  donations: "donation",
  volunteer: "volunteer",
  account: "technical",
  technical: "technical",
};

export function faqCategoryToDepartment(category: FaqCategory): ContactDepartment {
  return FAQ_TO_DEPARTMENT[category] ?? "general";
}

/** Human label for a category, falling back to a title-cased value. */
export function faqCategoryLabel(category: FaqCategory): string {
  const labels: Record<FaqCategory, string> = {
    general: "General",
    adoption: "Adoption",
    rescue: "Rescue",
    "lost-found": "Lost & Found",
    donations: "Donations",
    volunteer: "Volunteer",
    account: "Account",
    technical: "Technical",
  };
  return labels[category] ?? category;
}

/** Tiny deterministic string hash so the same value always maps the same. */
function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/** Deterministic pseudo view count — the backend FAQ has no view counter. */
function deriveViews(value: string): number {
  return 200 + (hashString(value) % 9800);
}

/** Map a backend FAQ entry onto the display `FaqEntry`. */
export function faqResponseToFaqEntry(
  entry: FAQEntryResponse,
  index = 0
): FaqEntry {
  const category = normalizeFaqCategory(entry.category);
  return {
    id: entry.id,
    category,
    popular: index < 2,
    question: entry.question,
    answer: entry.answer,
  };
}

/** Filter to published entries, ordered by `sort_order`. */
export function faqResponsesToFaqEntries(list: FAQEntryResponse[]): FaqEntry[] {
  return (list ?? [])
    .filter((entry) => entry.is_published)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((entry, index) => faqResponseToFaqEntry(entry, index));
}

/** Derive the ordered category tabs from the published FAQ entries. */
export function faqResponsesToCategories(
  list: FAQEntryResponse[]
): FaqCategory[] {
  return faqEntriesToCategories(faqResponsesToFaqEntries(list));
}

/** Derive the ordered category tabs from mapped `FaqEntry[]` values. */
export function faqEntriesToCategories(entries: FaqEntry[]): FaqCategory[] {
  const seen = new Set<FaqCategory>();
  const categories: FaqCategory[] = [];
  for (const entry of entries ?? []) {
    if (!seen.has(entry.category)) {
      seen.add(entry.category);
      categories.push(entry.category);
    }
  }
  return categories;
}

/** Map FAQ entries onto the support-article shape used by the support search. */
export function faqResponsesToSupportArticles(
  list: FAQEntryResponse[]
): SupportArticle[] {
  return faqResponsesToFaqEntries(list).map((entry) => ({
    id: entry.id,
    title: entry.question,
    summary: entry.answer,
    category: faqCategoryToDepartment(entry.category),
    views: deriveViews(entry.id),
  }));
}

/* -------------------------------------------------------------------------- */
/* Contact locations                                                          */
/* -------------------------------------------------------------------------- */

/** Pick the primary location (lowest `sort_order`), if any. */
export function primaryContactLocation(
  list: ContactLocationResponse[]
): ContactLocationResponse | null {
  if (!list?.length) return null;
  return [...list].sort((a, b) => a.sort_order - b.sort_order)[0] ?? null;
}

/** Split a single location into the four "reach us" info cards. */
export function contactLocationToInfoItems(
  location: ContactLocationResponse
): ContactInfoItem[] {
  const items: ContactInfoItem[] = [];
  if (location.phone) {
    items.push({
      id: `phone-${location.id}`,
      label: "Call Us",
      value: location.phone,
      subValue: location.name,
      href: `tel:${location.phone.replace(/[^\d+]/g, "")}`,
      icon: "Phone",
      tone: "cyan",
    });
  }
  if (location.email) {
    items.push({
      id: `email-${location.id}`,
      label: "Email Us",
      value: location.email,
      subValue: location.name,
      href: `mailto:${location.email}`,
      icon: "Mail",
      tone: "teal",
    });
  }
  if (location.address) {
    items.push({
      id: `address-${location.id}`,
      label: "Visit Us",
      value: location.address,
      subValue: location.name,
      icon: "MapPin",
      tone: "indigo",
    });
  }
  if (location.operating_hours) {
    items.push({
      id: `hours-${location.id}`,
      label: "Working Hours",
      value: location.operating_hours,
      subValue: location.name,
      icon: "Clock",
      tone: "amber",
    });
  }
  return items;
}

/** Emergency hotlines from locations flagged as emergency hotlines. */
export function locationsToEmergencyContacts(
  list: ContactLocationResponse[]
): EmergencyContact[] {
  return (list ?? [])
    .filter((location) => location.is_emergency_hotline)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((location) => ({
      label: location.name,
      number: location.phone,
      description: location.operating_hours ?? location.address,
    }));
}

/* -------------------------------------------------------------------------- */
/* Veterinary network                                                         */
/* -------------------------------------------------------------------------- */

const PARTNER_TONES = ["cyan", "teal", "indigo", "amber", "rose", "emerald"] as const;
const PARTNER_EMOJIS = ["🏥", "🐕", "🐈", "🩺", "🐾", "💉"] as const;

export function partnerTone(value: string): string {
  return PARTNER_TONES[hashString(value) % PARTNER_TONES.length];
}

export function partnerEmoji(value: string): string {
  return PARTNER_EMOJIS[hashString(value) % PARTNER_EMOJIS.length];
}

/** Split the backend's free-form services string into display chips. */
export function parseServices(services: string | null): string[] {
  if (!services?.trim()) return [];
  return services
    .split(/[,;|]/)
    .map((service) => service.trim())
    .filter(Boolean);
}

/** Google Maps search/directions URL built from map coordinates. */
export function directionsUrl(latitude: number, longitude: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
}

/**
 * Map a backend veterinary partner onto the display model used by the
 * veterinary directory UI.
 */
export function veterinaryPartnerToDisplay(
  partner: VeterinaryPartnerResponse
): VeterinaryPartner {
  const hasCoords =
    typeof partner.latitude === "number" &&
    typeof partner.longitude === "number";

  return {
    id: partner.id,
    name: partner.name,
    address: partner.address,
    phone: partner.phone,
    email: partner.email,
    latitude: partner.latitude,
    longitude: partner.longitude,
    isEmergency: partner.is_emergency,
    isActive: partner.is_active,
    services: parseServices(partner.services),
    tone: partnerTone(partner.name),
    emoji: partnerEmoji(partner.name),
    ...(hasCoords
      ? { directionsUrl: directionsUrl(partner.latitude!, partner.longitude!) }
      : {}),
  };
}

export type {
  ContactDepartment,
  ContactInfoItem,
  EmergencyContact,
  FaqCategory,
  FaqEntry,
  SupportArticle,
};
