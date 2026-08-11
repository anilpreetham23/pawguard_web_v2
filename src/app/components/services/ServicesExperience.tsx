"use client";

/**
 * ServicesExperience — Integration
 *
 * Wires together:
 *   CircleBackdrop   → background rings + particles
 *   ConnectionLine   → circle-internal line (center → service node)
 *   GuidePath        → cross-section Bézier (icon → center → panel)  ← NEW
 *   Quadrant         → X-layout service sectors
 *   CenterHub        → animated stat counter
 *   StoryPanel       → service detail (forwarded ref for GuidePath)
 *   LiveActivityFeed → independent live feed
 *
 * Three refs are maintained:
 *   sectionRef → outer <section>  (GuidePath SVG origin)
 *   circleRef  → circle container (icon + center positions)
 *   panelRef   → story panel div  (path endpoint)
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, MotionConfig, useInView } from "motion/react";
import { EditorialHeading } from "../pawguard/EditorialHeading";
import { SERVICES, type QuadrantId } from "./services-data";
import { Quadrant } from "./Quadrant";
import { CenterHub } from "./CenterHub";
import { CircleBackdrop } from "./CircleBackdrop";
import { GuidePath } from "./GuidePath";
import { StoryPanel } from "./StoryPanel";
import { duration, ease } from "../../../motion";
import { useAmbientPause } from "../../hooks/useAmbientPause";

type Dir = "up" | "down" | "left" | "right";

// X layout: emergency=TR, adoption=BR, veterinary=TL, foster=BL
const NAV_MAP: Record<QuadrantId, Partial<Record<Dir, QuadrantId>>> = {
  emergency:  { left: "veterinary", down: "adoption"   },
  adoption:   { left: "foster",     up:   "emergency"  },
  veterinary: { right: "emergency", down: "foster"     },
  foster:     { right: "adoption",  up:   "veterinary" },
};

const SECTION_RESET_DELAY = 900;

export default function ServicesExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const circleRef  = useRef<HTMLDivElement>(null);
  const panelRef   = useRef<HTMLDivElement>(null);

  const inView = useInView(sectionRef, { once: true, margin: "-60px" });
  useAmbientPause(sectionRef);

  const [activeIndex,   setActiveIndex]   = useState<number | null>(null);
  const [lastIndex,     setLastIndex]     = useState<number | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [focusedIndex,  setFocusedIndex]  = useState(0);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const leaveTimer = useRef<number | null>(null);

  const clearLeaveTimer = useCallback(() => {
    if (leaveTimer.current !== null) {
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  }, []);

  const activate = useCallback((i: number) => {
    setActiveIndex(i);
    setLastIndex(i);
    setHasInteracted(true);
  }, []);

  const resetToIntro = useCallback(() => {
    setActiveIndex(null);
    setLastIndex(null);
    setHasInteracted(false);
  }, []);

  const handleHover = useCallback((i: number) => {
    clearLeaveTimer();
    activate(i);
  }, [activeIndex, activate, clearLeaveTimer]);

  const handleLeave = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const handleSectionLeave = useCallback(() => {
    clearLeaveTimer();
    leaveTimer.current = window.setTimeout(resetToIntro, SECTION_RESET_DELAY);
  }, [clearLeaveTimer, resetToIntro]);

  const handleSectionEnter = useCallback(() => {
    clearLeaveTimer();
  }, [clearLeaveTimer]);

  const handleSelect = useCallback((i: number) => {
    if (activeIndex === i) resetToIntro();
    else activate(i);
  }, [activeIndex, activate, resetToIntro]);

  const handleCircleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const currentId = SERVICES[focusedIndex].id;
    const raw = e.key.startsWith("Arrow") ? e.key.slice(5).toLowerCase() : e.key.toLowerCase();
    const dir = raw as Dir;
    const target = NAV_MAP[currentId]?.[dir];

    if (target) {
      e.preventDefault();
      const idx = SERVICES.findIndex((s) => s.id === target);
      if (idx >= 0) {
        setFocusedIndex(idx);
        activate(idx);
        buttonRefs.current[idx]?.focus();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      resetToIntro();
      buttonRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex, activate, resetToIntro]);

  useEffect(() => clearLeaveTimer, [clearLeaveTimer]);

  const activeService  = activeIndex !== null ? SERVICES[activeIndex] : null;
  const displayService = lastIndex   !== null ? SERVICES[lastIndex]   : null;
  const mode: "intro" | "service" = hasInteracted && displayService ? "service" : "intro";

  const accent = activeService
    ? { text: activeService.color.text, border: activeService.color.border, glow: activeService.color.glow }
    : null;

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={sectionRef}
        aria-label="Our services explorer"
        onMouseLeave={handleSectionLeave}
        onMouseEnter={handleSectionEnter}
        className="relative overflow-hidden bg-card px-6 py-section-md lg:px-8 lg:py-section-lg"
      >
        {/* Background network pattern */}
        <div className="pointer-events-none absolute inset-0 text-border opacity-[0.06]" aria-hidden="true">
          <svg className="h-full w-full">
            <defs>
              <pattern id="pawguard-network" width="96" height="96" patternUnits="userSpaceOnUse">
                <g fill="none" stroke="currentColor" strokeWidth="1">
                  <line x1="0"  y1="0"  x2="48" y2="0"  />
                  <line x1="48" y1="0"  x2="48" y2="48" />
                  <line x1="0"  y1="0"  x2="48" y2="48" />
                  <line x1="0"  y1="48" x2="48" y2="48" />
                  <line x1="48" y1="48" x2="48" y2="96" />
                  <line x1="0"  y1="96" x2="48" y2="96" />
                  <line x1="48" y1="48" x2="96" y2="96" />
                </g>
                <g fill="currentColor">
                  <circle cx="0"  cy="0"  r="1.4" />
                  <circle cx="48" cy="0"  r="1.4" />
                  <circle cx="48" cy="48" r="1.4" />
                  <circle cx="0"  cy="48" r="1.4" />
                  <circle cx="48" cy="96" r="1.4" />
                  <circle cx="96" cy="96" r="1.4" />
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pawguard-network)" />
          </svg>
        </div>

        <GuidePath
          activeService={activeService}
          sectionRef={sectionRef}
          circleRef={circleRef}
          panelRef={panelRef}
        />

        <div className="relative mx-auto max-w-[1280px]">
          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: duration.narrative / 1000, ease: ease.narrative }}
          >
            <EditorialHeading eyebrow="What We Do" align="center">
              Our *Services*
            </EditorialHeading>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted-foreground lg:text-base">
              An interactive guide to PawGuard&rsquo;s rescue ecosystem. Hover or tap a sector to
              explore how each service works.
            </p>
          </motion.div>

          {/* Main grid */}
          <div className="mt-12 grid items-start gap-[var(--space-12)] lg:mt-16 lg:grid-cols-[2fr_3fr] lg:gap-[var(--space-16)]">

            {/* ── Left: Interactive circle ── */}
            <div
              ref={circleRef}
              role="tablist"
              aria-label="PawGuard services — use arrow keys to navigate, Enter to select, Escape to reset"
              onKeyDown={handleCircleKeyDown}
              className="relative mx-auto aspect-square w-full max-w-[500px]"
            >
              {/* Layer 0: background rings + particles */}
              <CircleBackdrop glow={activeService?.color.glow ?? null} />

              {/* Layer 2: service quadrants (X layout) */}
              {SERVICES.map((service, i) => (
                <Quadrant
                  key={service.id}
                  service={service}
                  index={i}
                  isActive={activeIndex === i}
                  isDimmed={activeIndex !== null && activeIndex !== i}
                  isFocused={focusedIndex === i}
                  onHover={() => handleHover(i)}
                  onLeave={handleLeave}
                  onSelect={() => handleSelect(i)}
                  onFocus={() => setFocusedIndex(i)}
                  onBlur={() => {}}
                  registerRef={(el, idx) => { buttonRefs.current[idx] = el; }}
                />
              ))}

              {/* Layer 3: center hub with animated counter */}
              <CenterHub accent={accent} activeService={activeService} />
            </div>

            {/* ── Right: story panel + live feed ── */}
            <div className="flex flex-col gap-10">
              <StoryPanel
                ref={panelRef}
                mode={mode}
                service={displayService}
                isGuideActive={false}
              />
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
