"use client";

import { Clock, Heart, HeartPulse, MapPin } from "lucide-react";
import {
  HERO_EYEBROW,
  HERO_TRUST_BADGES,
} from "./data/heroData";
import { HeroFullTypewriter } from "./HeroFullTypewriter";
import { HeroTypewriter } from "./HeroTypewriter";
import { cn } from "../ui/utils";

const TRUST_ICONS = { clock: Clock, heartpulse: HeartPulse, mappin: MapPin } as const;

interface HeroContentProps {
  className?: string;
}

/**
 * Editorial lockup — the hero reads like the opening spread of a magazine.
 *
 * The narrative (headline → deck → support) is typed live by
 * HeroFullTypewriter in a continuous loop, preserving the magazine hierarchy:
 *
 *   kicker   → live rescue eyebrow (static pill)
 *   story    → typed editorial narrative (three-line serif lockup, deck, support)
 *   live     → human rescue feed
 *   trust    → quiet credibility pills
 *
 * The GSAP reveal animates the outer `.hero-full-typewriter` container while
 * individual `.hero-headline-line` / `.hero-deck` / `.hero-support` segments
 * appear as the typewriter types them.
 */
export function HeroContent({ className }: HeroContentProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {/* ── Eyebrow kicker (static pill) ── */}
      <div className="hero-eyebrow flex items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/75 font-condensed backdrop-blur-sm">
          <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 animate-hero-live-dot" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          {HERO_EYEBROW}
        </span>
      </div>

      {/* ── Typed Editorial Narrative (headline + deck + support) ── */}
      <HeroFullTypewriter className="mt-6 lg:mt-7" />

      {/* ── Live Rescue Feed ── */}
      <HeroTypewriter className="mt-4" />

      {/* ── Trust Indicators (quiet credibility) ── */}
      <div className="hero-trust-badges flex flex-wrap items-center gap-3 mt-5 lg:mt-6">
        {HERO_TRUST_BADGES.map((badge) => {
          const Icon = TRUST_ICONS[badge.icon];
          return (
            <span
              key={badge.label}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[0.7rem] font-medium text-white/65 backdrop-blur-sm"
            >
              <Icon size={13} className="text-amber-200/70" aria-hidden="true" />
              {badge.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}