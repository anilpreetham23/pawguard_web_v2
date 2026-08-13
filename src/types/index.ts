/**
 * Shared display/domain types used by the API service mappers.
 *
 * Migrated from the old PawGuard production project (`src/types/index.ts`).
 * Only the types required by `src/services/api/*` mappers were migrated;
 * original definitions and terminology are preserved verbatim.
 */

// ---- Shared ----

export interface ImpactStat {
  value: number;
  suffix?: string;
  label: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

// ---- Adoption ----

export type PetCategory = "dog" | "cat" | "bird" | "rabbit" | "other";
export type PetAgeGroup = "puppy" | "adult" | "senior";
export type PetGender = "male" | "female";
export type PetSize = "small" | "medium" | "large";
export type VaccinationStatus = "up-to-date" | "partial" | "not-vaccinated";
export type HealthStatus = "healthy" | "special-needs" | "recovering";
export type AdoptionBadge = "available" | "adopted" | "recent";

export interface Shelter {
  name: string;
  phone: string;
  email: string;
  address: string;
  verified: boolean;
}

export interface Pet {
  id: string;
  name: string;
  category: PetCategory;
  breed: string;
  ageGroup: PetAgeGroup;
  age: string;
  gender: PetGender;
  size: PetSize;
  weight: string;
  color: string;
  location: string;
  vaccinationStatus: VaccinationStatus;
  healthStatus: HealthStatus;
  adoptionBadge: AdoptionBadge;
  description: string;
  personalityTraits: string[];
  specialNeeds: string[];
  medicalHistory: string;
  shelter: Shelter;
  tone: string;
  emoji: string;
  photosCount?: number;
  /** Days since the profile was added (display helper for "x days ago"). */
  addedDaysAgo?: number;
}

// ---- Rescue ----

export type RescueCondition =
  | "injured"
  | "trapped"
  | "abandoned"
  | "lost"
  | "other";

export type RescuePriority = "low" | "medium" | "high" | "critical";

export type RescueStatus =
  | "reported"
  | "verified"
  | "dispatched"
  | "located"
  | "rescued"
  | "admitted"
  | "rejected";

export interface RescueTimelineEvent {
  title: string;
  description: string;
  date: string;
}

export interface RescueCaseUpdate {
  title: string;
  description: string;
  date: string;
  author: string;
}

export interface RescueVolunteer {
  id: string;
  name: string;
  role: string;
  phone: string;
  location: string;
  rescuesCompleted: number;
  joinedDate: string;
  tone: string;
  emoji: string;
}

export interface RescueCaseLocation {
  area: string;
  address: string;
  landmark?: string;
  coordinates: string;
}

export interface RescueCaseReporter {
  name: string;
  contactNumber: string;
}

export interface RescueCase {
  id: string;
  caseNumber: string;
  title: string;
  animalType: PetCategory;
  breed: string;
  condition: RescueCondition;
  numberOfAnimals: number;
  priority: RescuePriority;
  status: RescueStatus;
  description: string;
  location: RescueCaseLocation;
  reporter: RescueCaseReporter;
  reportedAt: string;
  reportedDaysAgo: number;
  timeline: RescueTimelineEvent[];
  updates: RescueCaseUpdate[];
  assignedVolunteer: RescueVolunteer | null;
  assignedShelter: Shelter | null;
  tone: string;
  emoji: string;
  photosCount: number;
}

export interface SuccessStory {
  id: string;
  animalName: string;
  animalType: PetCategory;
  location: string;
  rescuedDate: string;
  title: string;
  excerpt: string;
  tone: string;
  emoji: string;
  volunteerNames: string[];
}

export interface EmergencyContact {
  label: string;
  number: string;
  description: string;
}

// ---- Lost & Found ----

export type PetCondition = "healthy" | "injured" | "scared" | "unknown";

export type LostFoundKind = "lost" | "found";

/**
 * Lifecycle state of a lost/found report. Mirrors the backend `ReportStatus`
 * enum (`active` | `resolved` | `expired`).
 */
export type LostFoundStatus = "active" | "resolved" | "expired";

export interface LostFoundTimelineEvent {
  title: string;
  description: string;
  date: string;
}

export interface LostFoundCase {
  id: string;
  caseNumber: string;
  kind: LostFoundKind;
  petName: string;
  animalType: PetCategory;
  breed: string;
  age: string;
  gender: PetGender | "unknown";
  color: string;
  size: PetSize;
  distinctiveMarks: string;
  condition: PetCondition;
  date: string;
  time: string;
  location: string;
  reward: string;
  description: string;
  status: LostFoundStatus;
  reporterName: string;
  contactNumber: string;
  email: string;
  reportedAt: string;
  reportedDaysAgo: number;
  timeline: LostFoundTimelineEvent[];
  tone: string;
  emoji: string;
  photosCount: number;
  /** Backend photo URL (rendered when present, falls back to the placeholder). */
  photoUrl?: string | null;
  /** Backend coordinates for the report area (null-safe; renders a directions link when present). */
  latitude?: number | null;
  longitude?: number | null;
  /** Backend microchip identifier for lost-pet reports (may be null). */
  microchipId?: string | null;
}

// ---- Community ----

export type BlogCategory =
  | "rescue-stories"
  | "pet-care"
  | "adoption"
  | "volunteering"
  | "animal-welfare"
  | "community-news";

export interface BlogAuthor {
  name: string;
  role: string;
  initials: string;
  tone: string;
}

export interface BlogSection {
  heading: string;
  paragraphs: string[];
}

export interface BlogGalleryImage {
  tone: string;
  emoji: string;
  caption: string;
}

export interface BlogQuote {
  text: string;
  attribution: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  category: BlogCategory;
  shortDescription: string;
  author: BlogAuthor;
  publishedAt: string;
  readTimeMinutes: number;
  featured: boolean;
  coverTone: string;
  coverEmoji: string;
  tags: string[];
  sections: BlogSection[];
  quote: BlogQuote | null;
  gallery: BlogGalleryImage[];
  commentsCount: number;
}

// ---- Contact & Support ----

export type ContactDepartment =
  | "general"
  | "adoption"
  | "rescue"
  | "donation"
  | "volunteer"
  | "technical";

export interface ContactInfoItem {
  id: string;
  label: string;
  value: string;
  subValue?: string;
  href?: string;
  icon: string;
  tone: string;
}

export interface SupportArticle {
  id: string;
  title: string;
  summary: string;
  category: ContactDepartment;
  views: number;
}

export type FaqCategory =
  | "general"
  | "adoption"
  | "rescue"
  | "lost-found"
  | "donations"
  | "volunteer"
  | "account"
  | "technical";

export interface FaqEntry extends FAQItem {
  id: string;
  category: FaqCategory;
  popular?: boolean;
}

// ---- Veterinary network ----

/**
 * Display model for a partner veterinary clinic (mapped from the public
 * `GET /portal/veterinary-network` payload). Tone/emoji and the directions
 * link are derived deterministically — never mocked.
 */
export interface VeterinaryPartner {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string | null;
  latitude: number | null;
  longitude: number | null;
  isEmergency: boolean;
  isActive: boolean;
  services: string[];
  tone: string;
  emoji: string;
  /** Google Maps directions URL, present only when coordinates are available. */
  directionsUrl?: string;
}