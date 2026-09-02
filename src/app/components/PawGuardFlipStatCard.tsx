"use client";

import { useState } from "react";
import { useCountUp } from "../../motion/hooks/use-count-up";
import { duration, delay, stagger } from "../../motion/motion.config";
import { cn } from "./ui/utils";

export type StatCardAccent = "green" | "navy" | "amber" | "community";

export interface PawGuardFlipStatCardProps {
  /** Front side icon element */
  icon: React.ReactNode;
  /** Front side main statistic value (e.g. "501(c)(3)", "4,200+", "<12 min", "800+") */
  stat: string;
  /** Optional numeric value for count-up animation */
  statNum?: number;
  /** Front side label/title (e.g. "Verified Nonprofit", "Dogs Rescued") */
  title: string;
  /** Front side short description/tagline */
  tagline: string;
  /** Back side category badge text (e.g. "TRANSPARENCY", "RESCUE IMPACT") */
  backBadge: string;
  /** Back side title (e.g. "Verified & Accountable") */
  backTitle: string;
  /** Back side detailed description */
  backDescription: string;
  /** Index for count-up delay calculation */
  index?: number;
  /** Color accent theme variant for the front face */
  accentVariant?: StatCardAccent;
}

interface AccentTheme {
  badgeContainer: string;
  metricColor: string;
  dividerBg: string;
  sublabelColor: string;
  hoverBorder: string;
  pawOpacity: string;
  waveColor: string;
}

const ACCENT_MAP: Record<StatCardAccent, AccentTheme> = {
  green: {
    badgeContainer: "bg-emerald-50 text-emerald-600 border-emerald-200/80 shadow-emerald-900/5",
    metricColor: "text-slate-900",
    dividerBg: "bg-emerald-500",
    sublabelColor: "text-emerald-700",
    hoverBorder: "group-hover:border-emerald-300",
    pawOpacity: "text-emerald-600/10",
    waveColor: "text-emerald-500/15",
  },
  navy: {
    badgeContainer: "bg-blue-50 text-[#1E3A8A] border-blue-200/80 shadow-blue-900/5",
    metricColor: "text-[#1E3A8A]",
    dividerBg: "bg-[#1E3A8A]",
    sublabelColor: "text-blue-900",
    hoverBorder: "group-hover:border-blue-300",
    pawOpacity: "text-blue-900/10",
    waveColor: "text-blue-900/15",
  },
  amber: {
    badgeContainer: "bg-amber-50 text-amber-600 border-amber-200/80 shadow-amber-900/5",
    metricColor: "text-slate-900",
    dividerBg: "bg-amber-500",
    sublabelColor: "text-amber-800",
    hoverBorder: "group-hover:border-amber-300",
    pawOpacity: "text-amber-600/10",
    waveColor: "text-amber-500/15",
  },
  community: {
    badgeContainer: "bg-indigo-50 text-[#1E3A8A] border-indigo-200/80 shadow-indigo-900/5",
    metricColor: "text-[#1E3A8A]",
    dividerBg: "bg-emerald-500",
    sublabelColor: "text-indigo-900",
    hoverBorder: "group-hover:border-indigo-300",
    pawOpacity: "text-indigo-900/10",
    waveColor: "text-emerald-500/15",
  },
};

export function PawGuardFlipStatCard({
  icon,
  stat,
  statNum = 0,
  title,
  tagline,
  backBadge,
  backTitle,
  backDescription,
  index = 0,
  accentVariant,
}: PawGuardFlipStatCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Auto-resolve accent theme if not explicitly provided
  const resolvedAccent: StatCardAccent =
    accentVariant ??
    (index === 0 ? "green" : index === 1 ? "navy" : index === 2 ? "amber" : "community");

  const accent = ACCENT_MAP[resolvedAccent];

  const { display, triggerRef } = useCountUp(stat, {
    delay: delay.short / 1000 + index * stagger.slow,
    duration: duration.deliberate / 1000,
  });

  const handleToggleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsFlipped((prev) => !prev);
    }
  };

  return (
    <div
      className={`pg-flip-card h-[320px] select-none cursor-pointer rounded-2xl ${
        isFlipped ? "is-flipped" : ""
      }`}
      tabIndex={0}
      role="button"
      aria-label={`${title}: ${stat}. ${tagline}. Press or tap to flip card for details.`}
      aria-expanded={isFlipped}
      onClick={handleToggleFlip}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => {
        if (!isFocused) setIsFlipped(false);
      }}
      onFocus={() => {
        setIsFocused(true);
        setIsFlipped(true);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsFocused(false);
          setIsFlipped(false);
        }
      }}
    >
      <div className="pg-flip-card-inner shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
        {/* ── FRONT SIDE ─────────────────────────────────────────────── */}
        <div
          className={cn(
            "pg-flip-card-front bg-white border border-slate-200/90 rounded-2xl flex flex-col items-center text-center p-6 justify-between relative overflow-hidden transition-colors duration-300 group",
            accent.hoverBorder
          )}
        >
          {/* Subtle Paw-Print Watermark (Top Right) */}
          <svg
            className={cn(
              "pointer-events-none absolute -right-3 -top-3 w-28 h-28 transition-transform duration-500 ease-out group-hover:scale-110",
              accent.pawOpacity
            )}
            viewBox="0 0 100 100"
            fill="currentColor"
            aria-hidden="true"
          >
            <circle cx="30" cy="25" r="9" />
            <circle cx="70" cy="25" r="9" />
            <circle cx="16" cy="50" r="7.5" />
            <circle cx="84" cy="50" r="7.5" />
            <path d="M50 42 c-16 0 -28 12 -28 26 c0 12 10 18 28 18 c18 0 28 -6 28 -18 c0 -14 -12 -26 -28 -26 z" />
          </svg>

          {/* Subtle Lower Wave Pattern */}
          <svg
            className={cn(
              "pointer-events-none absolute bottom-0 left-0 right-0 w-full h-10 transition-opacity duration-300",
              accent.waveColor
            )}
            viewBox="0 0 400 40"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0 25 C 100 10, 200 35, 300 15 C 350 5, 380 20, 400 15 L 400 40 L 0 40 Z"
              fill="currentColor"
            />
          </svg>

          {/* Main Content Area */}
          <div className="relative z-10 flex flex-col items-center gap-2.5 mt-1 w-full">
            {/* Soft Circular Icon Badge */}
            <div
              className={cn(
                "w-12 h-12 rounded-full border flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-sm",
                accent.badgeContainer
              )}
            >
              {icon}
            </div>

            {/* Metric Number & Hierarchy */}
            <div className="flex flex-col items-center gap-1 w-full mt-1">
              <span
                ref={statNum > 0 ? triggerRef : undefined}
                className={cn(
                  "font-mono font-bold text-3xl lg:text-4xl leading-none tracking-tight tabular-nums",
                  accent.metricColor
                )}
              >
                {statNum > 0 ? display : stat}
              </span>

              <span
                className={cn(
                  "font-condensed font-bold text-sm uppercase tracking-wider mt-1.5",
                  accent.sublabelColor
                )}
              >
                {title}
              </span>

              <p className="text-xs text-slate-500 font-normal leading-relaxed max-w-[210px] mt-0.5">
                {tagline}
              </p>

              {/* Accent Divider Line */}
              <div className={cn("h-0.5 w-10 rounded-full mt-2.5 mb-0.5 opacity-80", accent.dividerBg)} />
            </div>
          </div>

          {/* Bottom Flip Interaction Hint */}
          <div className="relative z-10 w-full pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-500 group-hover:text-slate-900 transition-colors">
            <span>Flip for details</span>
            <span className="text-xs transition-transform duration-300 group-hover:translate-x-0.5">⤾</span>
          </div>
        </div>

        {/* ── BACK SIDE (Untouched & Preserved) ───────────────────────── */}
        <div className="pg-flip-card-back bg-gradient-to-br from-[#1E3A8A] via-[#172554] to-[#0F172A] text-white border border-primary/30 flex flex-col items-center text-center p-6 justify-between shadow-lg">
          <div className="flex flex-col items-center gap-2.5 mt-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-white/10 text-amber-300 border border-white/15">
              {backBadge}
            </span>
            <h3 className="font-serif font-bold text-xl text-white tracking-tight mt-1">
              {backTitle}
            </h3>
            <p className="text-xs text-slate-200/90 leading-relaxed max-w-[240px]">
              {backDescription}
            </p>
          </div>

          <div className="w-full pt-3 border-t border-white/15 flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-300/80">
            <span>Tap to flip back</span>
            <span className="text-xs">⤿</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PawGuardFlipStatCard;
