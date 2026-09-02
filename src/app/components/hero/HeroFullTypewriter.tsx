"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionStore } from "../../../motion/motion-store";
import { cn } from "../ui/utils";
import {
  HERO_HEADLINE_TOP,
  HERO_HEADLINE_MIDDLE,
  HERO_HEADLINE_HIGHLIGHT,
  HERO_DECK,
  HERO_SUPPORT,
} from "./data/heroData";

const HEADLINE_CLS =
  "hero-headline-line block font-serif font-normal text-[2.75rem] sm:text-5xl lg:text-6xl xl:text-[4.25rem] leading-[1.06] tracking-tight text-white";

const SEGMENTS = [
  { text: HERO_HEADLINE_TOP, className: HEADLINE_CLS },
  { text: HERO_HEADLINE_MIDDLE, className: HEADLINE_CLS },
  {
    text: HERO_HEADLINE_HIGHLIGHT,
    className: cn(HEADLINE_CLS, "italic text-amber-200"),
    accent: true,
  },
  {
    text: HERO_DECK,
    className:
      "hero-deck mt-5 lg:mt-6 font-serif text-lg lg:text-xl italic text-white/70 max-w-[52ch] font-normal leading-relaxed",
  },
  {
    text: HERO_SUPPORT,
    className:
      "hero-support text-lg lg:text-xl leading-relaxed text-white/65 max-w-[44ch] font-normal text-pretty mt-4 lg:mt-5",
  },
];

const TYPE_MS = 30;
const HOLD_MS = 3600;
const DELETE_MS = 14;
const RESTART_PAUSE_MS = 900;

export function HeroFullTypewriter({ className }: { className?: string }) {
  const ready = useMotionStore((s) => s.ready);
  const motionTier = useMotionStore((s) => s.motionTier);
  const enabled = ready && motionTier === "full";

  const [activeSegment, setActiveSegment] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const segRef = useRef(0);
  const charRef = useRef(0);
  const deletingRef = useRef(false);
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!enabled) return;
    segRef.current = 0;
    charRef.current = 0;
    deletingRef.current = false;
    setActiveSegment(0);

    // Clear all spans
    spanRefs.current.forEach((span) => {
      if (span) span.textContent = "";
    });

    let paused = false;
    let done = false;
    let timeout: number | undefined;

    const stopTimer = () => {
      if (timeout !== undefined) {
        window.clearTimeout(timeout);
        timeout = undefined;
      }
    };

    const tick = () => {
      timeout = undefined;
      if (paused || done) return;

      const seg = SEGMENTS[segRef.current];
      const span = spanRefs.current[segRef.current];

      if (!deletingRef.current) {
        charRef.current += 1;
        if (charRef.current <= seg.text.length && span) {
          span.textContent = seg.text.slice(0, charRef.current);
        }
        if (charRef.current >= seg.text.length) {
          deletingRef.current = true;
          timeout = window.setTimeout(tick, HOLD_MS);
        } else {
          timeout = window.setTimeout(tick, TYPE_MS);
        }
      } else {
        if (span) {
          span.textContent = seg.text.slice(0, charRef.current);
        }

        if (charRef.current === 0) {
          deletingRef.current = false;
          if (segRef.current + 1 < SEGMENTS.length) {
            segRef.current += 1;
            setActiveSegment(segRef.current);
            timeout = window.setTimeout(tick, 180);
          } else {
            segRef.current = 0;
            setActiveSegment(0);
            timeout = window.setTimeout(tick, RESTART_PAUSE_MS);
          }
        } else {
          charRef.current -= 1;
          timeout = window.setTimeout(tick, DELETE_MS);
        }
      }
    };

    const resume = () => {
      if (paused || done) return;
      if (timeout === undefined) timeout = window.setTimeout(tick, 0);
    };

    const setPaused = (value: boolean) => {
      if (paused === value) return;
      paused = value;
      if (paused) stopTimer();
      else resume();
    };

    const io = new IntersectionObserver(([entry]) => setPaused(!entry.isIntersecting), {
      rootMargin: "60px 0px",
    });
    if (containerRef.current) io.observe(containerRef.current);

    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    const start = window.setTimeout(tick, 1500);

    return () => {
      done = true;
      stopTimer();
      window.clearTimeout(start);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled]);

  if (!enabled) {
    return (
      <div className={cn("hero-full-typewriter flex flex-col", className)}>
        <span className={HEADLINE_CLS}>{HERO_HEADLINE_TOP}</span>
        <span className={HEADLINE_CLS}>{HERO_HEADLINE_MIDDLE}</span>
        <span className={cn(HEADLINE_CLS, "italic text-amber-200")}>
          {HERO_HEADLINE_HIGHLIGHT}
        </span>
        <p className="hero-deck mt-5 lg:mt-6 font-serif text-lg lg:text-xl italic text-white/70 max-w-[52ch] font-normal leading-relaxed">
          {HERO_DECK}
        </p>
        <p className="hero-support text-lg lg:text-xl leading-relaxed text-white/65 max-w-[44ch] font-normal text-pretty mt-4 lg:mt-5">
          {HERO_SUPPORT}
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn("hero-full-typewriter flex flex-col", className)}>
      {SEGMENTS.map((seg, i) => {
        if (!seg.text) return null;
        const isActive = i === activeSegment;
        return (
          <span key={i} className={cn("relative", seg.className)}>
            <span ref={(el) => { spanRefs.current[i] = el; }} />
            {isActive && (
              <span
                aria-hidden="true"
                className="inline-block w-[2ch] align-baseline text-amber-200 animate-hero-caret"
              />
            )}
          </span>
        );
      })}
    </div>
  );
}
