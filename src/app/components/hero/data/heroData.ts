// ─── Narrative Layer Explanations ─────────────────────────────────────────────
// Layer 1 - Emergency Awareness:  The live badge creates immediate urgency
// Layer 2 - Brand Trust:          TrustBar below hero + trust badges
// Layer 3 - Mission Statement:    Headline communicates purpose instantly
// Layer 4 - Supporting Story:     Subtext explains the "how" behind the mission
// Layer 5 - Primary Action:       "Report an Emergency" CTA (destructive)
// Layer 6 - Secondary Actions:    "Adopt a Dog" + "Become a Volunteer"
// Layer 7 - Emotional Visual:     Full-bleed video scene with cinematic lighting
// Layer 8 - Scroll Invitation:    Paw-print scroll indicator

export const HERO_EYEBROW = "Where every rescue starts with a single call";

export const HERO_HEADLINE_TOP = "Every dog deserves";
export const HERO_HEADLINE_MIDDLE = "more than survival";
export const HERO_HEADLINE_HIGHLIGHT = "a second chance.";

export const HERO_DECK =
  "One phone call. One team. One life changed forever.";

export const HERO_SUPPORT =
  "We're the voice on the other end at 3 AM. The team already moving before you hang up. " +
  "The vet waiting at the clinic. The family who said yes. " +
  "Twelve municipalities. One promise: no dog faces it alone.";

// ─── Trust Indicators ────────────────────────────────────────────────────────
// icon maps to a Lucide icon rendered in HeroContent. Presented as quiet,
// glass pills so credibility supports the story instead of shouting over it.
export const HERO_TRUST_BADGES = [
  { icon: "clock", label: "24/7 Response" },
  { icon: "heartpulse", label: "Vet-Approved" },
  { icon: "mappin", label: "12 Municipalities" },
] as const;

// ─── Calls to Action (story resolution) ───────────────────────────────────────
// The hero's emotional arc ends here: empathy → action. Primary is the urgent
// rescue path; the secondary pair opens the door to adoption and community.
export const HERO_PRIMARY_CTA = {
  label: "Report an Emergency",
  to: "/emergency",
  icon: "siren",
} as const;

export const HERO_SECONDARY_CTAS = [
  { label: "Adopt a Dog", to: "/adopt", icon: "pawprint" },
  { label: "Become a Volunteer", to: "/volunteer", icon: "heart" },
] as const;

// ─── Tilt / Parallax Config ──────────────────────────────────────────────────
export const TILT = {
  maxRotate: 2,
  maxTranslate: 6,
  multipliers: { video: 1, hud: 0.8, stats: 0.5, bloom: 0.3, decorations: 0.2 },
} as const;
