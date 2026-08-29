import type { LucideIcon } from "lucide-react";
import { Siren, Heart, Stethoscope, Home } from "lucide-react";

export type QuadrantId = "emergency" | "adoption" | "veterinary" | "foster";

export type ActivityEventType = "rescue" | "adoption" | "foster" | "treatment";
export type ActivityStatus = "completed" | "ongoing";

/** Structured for future API / WebSocket consumption — swap mock data for live feed without refactoring */
export interface Activity {
  id: string;
  dogName: string;
  dogImage?: string;
  eventType: ActivityEventType;
  location: string;
  /** ISO string or relative label */
  time: string;
  /** Minutes ago — used for display; recalculated on live data */
  minutesAgo: number;
  status: ActivityStatus;
}

export interface ServiceColor {
  text: string;
  soft: string;
  tint: string;
  border: string;
  glow: string;
}

export interface ServiceStat {
  value: string;
  label: string;
}

export interface WorkflowStep {
  label: string;
  detail: string;
}

/**
 * X-axis position metadata for the connection line SVG.
 * All coordinates are in the 0–100 viewBox of the circle container.
 * Center is always (50, 50).
 */
export interface ConnectionMeta {
  /** End-point of the animated line (service node center in viewBox units) */
  lineEndX: number;
  lineEndY: number;
}

export interface ServiceData {
  id: QuadrantId;
  title: string;
  short: string;
  badge: string;
  subtitle: string;
  description: string;
  features: string[];
  /** Animated step-by-step workflow shown in the story panel */
  workflow: WorkflowStep[];
  /** Legacy flat timeline labels kept for backward compat */
  timeline: string[];
  stats: ServiceStat[];
  metric: string;
  metricLabel: string;
  /** Stat shown in the center hub when this service is active */
  centerStat: string;
  centerLabel: string;
  icon: LucideIcon;
  color: ServiceColor;
  /** SVG connection line metadata */
  connection: ConnectionMeta;
  primaryCta: { label: string; to: string };
  secondaryCta?: { label: string; to: string };
}

/**
 * PHASE 2 — X-shaped layout geometry.
 *
 * X arrangement (top-left, top-right, bottom-left, bottom-right):
 *
 *   veterinary (TL)    emergency (TR)
 *          PawGuard (center)
 *   foster (BL)        adoption (BR)
 *
 * Each button occupies a 50 % × 50 % corner of the container.
 * anchorX / anchorY place the label at the diagonal bisector (~35 % from the outer corner).
 */
export interface QuadrantGeometry {
  top: string;
  left: string;
  path: string;
  anchorX: string;
  anchorY: string;
  origin: string;
}

/**
 * X layout — all 4 sectors share the full 100x100 viewBox.
 * Dividers are the two diagonals: top-left↔bottom-right and top-right↔bottom-left.
 * Each sector is a pie slice: center(50,50) → two diagonal corners → arc.
 *
 *   veterinary (top)   emergency (right)
 *   foster (left)      adoption (bottom)
 */
export const QUADRANT_LAYOUT: Record<QuadrantId, QuadrantGeometry> = {
  /** Top sector — between TL and TR corners */
  veterinary: {
    top: "0%",
    left: "0%",
    path: "M50,50 L0,0 A70.71,70.71 0 0,1 100,0 Z",
    anchorX: "50%",
    anchorY: "20%",
    origin: "50% 50%",
  },
  /** Right sector — between TR and BR corners */
  emergency: {
    top: "0%",
    left: "0%",
    path: "M50,50 L100,0 A70.71,70.71 0 0,1 100,100 Z",
    anchorX: "80%",
    anchorY: "50%",
    origin: "50% 50%",
  },
  /** Bottom sector — between BR and BL corners */
  adoption: {
    top: "0%",
    left: "0%",
    path: "M50,50 L100,100 A70.71,70.71 0 0,1 0,100 Z",
    anchorX: "50%",
    anchorY: "80%",
    origin: "50% 50%",
  },
  /** Left sector — between BL and TL corners */
  foster: {
    top: "0%",
    left: "0%",
    path: "M50,50 L0,100 A70.71,70.71 0 0,1 0,0 Z",
    anchorX: "20%",
    anchorY: "50%",
    origin: "50% 50%",
  },
};

export const SERVICES: ServiceData[] = [
  {
    id: "emergency",
    title: "Emergency Rescue",
    short: "Rescue",
    badge: "24/7 · Critical Response",
    subtitle: "Rapid, coordinated rescue for dogs in immediate danger.",
    description:
      "PawGuard's emergency rescue network is built around a single promise: when a dog's life is at risk, help arrives in minutes, not hours. Every report is routed to the nearest available unit through GPS-coordinated dispatch, so responders know where they are going before they leave the station. Each team carries specialized equipment for roadways, rooftops, waterways, and tight crawl spaces. The person who made the report receives live updates and a real-time ETA throughout the response, because transparency in a crisis is part of the protocol.",
    features: [
      "GPS-coordinated dispatch",
      "24/7 emergency hotline",
      "Live volunteer tracking",
      "Veterinary coordination",
      "Regional shelter network",
      "Real-time ETA updates",
    ],
    workflow: [
      { label: "Report", detail: "Emergency logged with GPS & photos" },
      { label: "Dispatch", detail: "Nearest unit alerted in seconds" },
      { label: "Locate", detail: "Real-time navigation to dog" },
      { label: "Rescue", detail: "Specialized team on the ground" },
      { label: "Treatment", detail: "Immediate veterinary triage" },
      { label: "Recovery", detail: "Safe placement & monitoring" },
    ],
    timeline: ["Report", "Dispatch", "On the Way", "Rescue", "Recovery"],
    stats: [
      { value: "11", label: "Avg. response (min)" },
      { value: "4,200+", label: "Dogs rescued" },
      { value: "98%", label: "Arrival success" },
      { value: "24/7", label: "Coverage" },
    ],
    metric: "11 min",
    metricLabel: "Avg dispatch",
    centerStat: "2,351",
    centerLabel: "Dogs Rescued",
    icon: Siren,
    color: {
      text: "#DC2626",
      soft: "rgba(220,38,38,0.16)",
      tint: "rgba(220,38,38,0.05)",
      border: "rgba(220,38,38,0.35)",
      glow: "rgba(220,38,38,0.28)",
    },
    /** Top-right corner → line goes to ~(78, 22) in viewBox */
    connection: { lineEndX: 78, lineEndY: 22 },
    primaryCta: { label: "Report an Emergency", to: "/emergency" },
    secondaryCta: { label: "How reporting works", to: "/about" },
  },
  {
    id: "adoption",
    title: "Adoption Services",
    short: "Adoption",
    badge: "Rehoming · Life Match",
    subtitle: "A rigorous matching process that finds the right home for every dog.",
    description:
      "Adoption at PawGuard is a matching process, not a hand-off. Every dog spends time with our behavioral team before applications open, so we understand its energy, comfort zones, and the environment where it will thrive. Families work with an adoption counselor through a home evaluation, a supervised meet-and-greet, and a follow-up period that continues after the paperwork is signed. We match on temperament, household routine, and lifestyle, because a successful adoption lasts a lifetime.",
    features: [
      "Behavioral assessment",
      "Home environment evaluation",
      "Adoption counselor support",
      "Post-adoption follow-up",
      "Lifetime return policy",
      "Community adoption events",
    ],
    workflow: [
      { label: "Application", detail: "Family submits adoption request" },
      { label: "Matching", detail: "Counselor reviews temperament fit" },
      { label: "Meet", detail: "Supervised meet-and-greet session" },
      { label: "Approval", detail: "Home evaluation completed" },
      { label: "Forever Home", detail: "Adoption finalized with support" },
    ],
    timeline: ["Apply", "Screen", "Meet", "Adopt", "Forever"],
    stats: [
      { value: "1,850+", label: "Adoptions" },
      { value: "98%", label: "Match success" },
      { value: "5", label: "Days to match" },
      { value: "100%", label: "Return policy" },
    ],
    metric: "1,850+",
    metricLabel: "Happy adoptions",
    centerStat: "1,980",
    centerLabel: "Successful Adoptions",
    icon: Heart,
    color: {
      text: "#b45309",
      soft: "rgba(180,83,9,0.16)",
      tint: "rgba(180,83,9,0.05)",
      border: "rgba(180,83,9,0.35)",
      glow: "rgba(180,83,9,0.28)",
    },
    /** Bottom-right corner → line goes to ~(78, 78) */
    connection: { lineEndX: 78, lineEndY: 78 },
    primaryCta: { label: "Start the Adoption Process", to: "/adopt" },
    secondaryCta: { label: "Read success stories", to: "/stories" },
  },
  {
    id: "veterinary",
    title: "Veterinary Care",
    short: "Veterinary",
    badge: "Medical · Partner Network",
    subtitle: "Triage, treatment, and preventive medicine for every rescued dog.",
    description:
      "Behind every rescue is a medical journey. PawGuard's veterinary care program ensures no dog reaches its next chapter without a full health assessment first. Every rescued dog receives emergency triage, vaccinations, and parasite prevention on arrival, with spay and neuter scheduled before rehoming. For serious cases, our partner clinics provide specialist surgery, imaging, and round-the-clock critical care.",
    features: [
      "24/7 emergency triage",
      "Vaccination programs",
      "Spay & neuter services",
      "Microchipping",
      "15+ specialist partner clinics",
      "Community prevention clinics",
    ],
    workflow: [
      { label: "Diagnosis", detail: "Full health assessment on arrival" },
      { label: "Treatment", detail: "Vaccinations, surgery, medication" },
      { label: "Recovery", detail: "Round-the-clock critical care" },
      { label: "Monitoring", detail: "Daily progress tracking" },
    ],
    timeline: ["Assess", "Treat", "Stabilize", "Recover", "Release"],
    stats: [
      { value: "15+", label: "Partner clinics" },
      { value: "5,000+", label: "Vaccinations" },
      { value: "1,200+", label: "Spay & neuter" },
      { value: "24/7", label: "Critical care" },
    ],
    metric: "24/7",
    metricLabel: "Vet care",
    centerStat: "4,120",
    centerLabel: "Dogs Treated",
    icon: Stethoscope,
    color: {
      text: "#1d4ed8",
      soft: "rgba(29,78,216,0.14)",
      tint: "rgba(29,78,216,0.04)",
      border: "rgba(29,78,216,0.35)",
      glow: "rgba(29,78,216,0.26)",
    },
    /** Top-left corner → line goes to ~(22, 22) */
    connection: { lineEndX: 22, lineEndY: 22 },
    primaryCta: { label: "Meet Our Vet Partners", to: "/about" },
    secondaryCta: { label: "Contact the medical team", to: "/contact" },
  },
  {
    id: "foster",
    title: "Foster Care",
    short: "Foster",
    badge: "Community · Placement",
    subtitle: "Trained homes that care for dogs while they recover — or wait for forever.",
    description:
      "Not every dog needs a shelter — many need a safe, quiet home while they heal. PawGuard's foster network places rescued dogs with trained volunteer families for fourteen to ninety days, easing the pressure on shelters and giving each dog a stable, low-stress environment. Families are carefully screened and fully trained before their first placement, and PawGuard covers every medical expense, supplies food and enrichment, and keeps a 24/7 support line open.",
    features: [
      "Family screening & training",
      "All medical costs covered",
      "Food and supplies provided",
      "24/7 foster support line",
      "Flexible 14–90 day placements",
      "Rescue-to-adoption pipeline",
    ],
    workflow: [
      { label: "Application", detail: "Family screening & background check" },
      { label: "Training", detail: "Orientation & care certification" },
      { label: "Placement", detail: "Dog matched to family" },
      { label: "Care", detail: "Daily support & vet coordination" },
      { label: "Adoption", detail: "Permanent home found" },
    ],
    timeline: ["Apply", "Train", "Place", "Care", "Adopt"],
    stats: [
      { value: "800+", label: "Volunteers" },
      { value: "250+", label: "Foster homes" },
      { value: "90", label: "Max days" },
      { value: "100%", label: "Costs covered" },
    ],
    metric: "800+",
    metricLabel: "Foster volunteers",
    centerStat: "820",
    centerLabel: "Foster Families",
    icon: Home,
    color: {
      text: "#15803d",
      soft: "rgba(21,128,61,0.14)",
      tint: "rgba(21,128,61,0.04)",
      border: "rgba(21,128,61,0.35)",
      glow: "rgba(21,128,61,0.26)",
    },
    /** Bottom-left corner → line goes to ~(22, 78) */
    connection: { lineEndX: 22, lineEndY: 78 },
    primaryCta: { label: "Apply to Foster", to: "/volunteer" },
    secondaryCta: { label: "Support a foster family", to: "/donate" },
  },
];

export const DEFAULT_CENTER = {
  title: "PawGuard",
  stat: "4,200+",
  sub: "Lives Protected",
};

export const INTRO_STATS: ServiceStat[] = [
  { value: "4,200+", label: "Dogs Rescued" },
  { value: "1,850+", label: "Successful Adoptions" },
  { value: "800+", label: "Active Volunteers" },
  { value: "24/7", label: "Emergency Coordination" },
];

/** Mock activity data — structured for future API/WebSocket swap without refactoring */
export const MOCK_ACTIVITIES: Activity[] = [
  { id: "a1",  dogName: "Bruno",  eventType: "rescue",    location: "Hyderabad", time: "2 min ago",  minutesAgo: 2,  status: "completed" },
  { id: "a2",  dogName: "Bella",  eventType: "adoption",  location: "Bangalore", time: "5 min ago",  minutesAgo: 5,  status: "completed" },
  { id: "a3",  dogName: "Rocky",  eventType: "treatment", location: "Kurnool",   time: "8 min ago",  minutesAgo: 8,  status: "completed" },
  { id: "a4",  dogName: "Max",    eventType: "foster",    location: "Chennai",   time: "11 min ago", minutesAgo: 11, status: "completed" },
  { id: "a5",  dogName: "Luna",   eventType: "rescue",    location: "Pune",      time: "14 min ago", minutesAgo: 14, status: "ongoing"   },
  { id: "a6",  dogName: "Coco",   eventType: "adoption",  location: "Mumbai",    time: "18 min ago", minutesAgo: 18, status: "completed" },
  { id: "a7",  dogName: "Simba",  eventType: "treatment", location: "Delhi",     time: "22 min ago", minutesAgo: 22, status: "completed" },
  { id: "a8",  dogName: "Daisy",  eventType: "foster",    location: "Kolkata",   time: "27 min ago", minutesAgo: 27, status: "completed" },
  { id: "a9",  dogName: "Tiger",  eventType: "rescue",    location: "Vizag",     time: "31 min ago", minutesAgo: 31, status: "completed" },
  { id: "a10", dogName: "Milo",   eventType: "adoption",  location: "Jaipur",    time: "35 min ago", minutesAgo: 35, status: "completed" },
];

export const ACTIVITY_META: Record<ActivityEventType, { emoji: string; label: string; color: string }> = {
  rescue:    { emoji: "🐶", label: "Rescued",           color: "#DC2626" },
  adoption:  { emoji: "❤️", label: "Adopted",           color: "#b45309" },
  treatment: { emoji: "🏥", label: "Received Treatment", color: "#1E3A8A" },
  foster:    { emoji: "🏠", label: "Entered Foster Care", color: "#16A34A" },
};
