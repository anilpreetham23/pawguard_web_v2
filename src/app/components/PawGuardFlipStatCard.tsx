"use client";

import { useState } from "react";
import { useCountUp } from "../../motion/hooks/use-count-up";
import { duration, delay, stagger } from "../../motion/motion.config";

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
}

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
}: PawGuardFlipStatCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

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
      className={`pg-flip-card h-[320px] select-none cursor-pointer rounded-card ${
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
      <div className="pg-flip-card-inner shadow-sm hover:shadow-card-hover transition-shadow duration-300">
        {/* ── FRONT SIDE ─────────────────────────────────────────────── */}
        <div className="pg-flip-card-front bg-card border border-border flex flex-col items-center text-center p-6 justify-between">
          <div className="flex flex-col items-center gap-3 mt-2">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
              {icon}
            </div>
            <div className="flex flex-col items-center gap-1">
              <span
                ref={statNum > 0 ? triggerRef : undefined}
                className="font-mono font-bold text-3xl lg:text-3xl text-foreground leading-none tracking-tight tabular-nums"
              >
                {statNum > 0 ? display : stat}
              </span>
              <span className="font-semibold text-base text-foreground mt-1">
                {title}
              </span>
              <span className="text-xs text-muted-foreground leading-relaxed max-w-[220px]">
                {tagline}
              </span>
            </div>
          </div>

          <div className="w-full pt-3 border-t border-border/60 flex items-center justify-center gap-1.5 text-[11px] font-medium text-primary/80 group-hover:text-primary transition-colors">
            <span>Flip for details</span>
            <span className="text-xs">⤾</span>
          </div>
        </div>

        {/* ── BACK SIDE ──────────────────────────────────────────────── */}
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
