"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Phone, Dog, Heart } from "lucide-react";
import { motion } from "motion/react";
import { gsap } from "gsap";
import { useMotionStore } from "../../motion";
import { duration, ease, stagger, delay } from "../../motion/motion.config";
import { cn } from "./ui/utils";
import { EMERGENCY, SITE_STATS } from "../config/site";

interface TopEmergencyBarProps {
  scrolled: boolean;
}

// Symmetric in-out curve — starts slow, ends slow (no "fast snap" feel)
const STRIP_EASE = [0.65, 0, 0.35, 1] as const;
const STRIP_DURATION = 0.5; // s
const STRIP_CONTENT = "duration-[400ms] ease-[cubic-bezier(0.65,0,0.35,1)] transition-all";

const cardStagger = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.gentle / 1000, ease: ease.gentle },
  },
};

function useCountUpOnMount(value: string) {
  const motionTier = useMotionStore((s) => s.motionTier);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const match = value.match(/[\d,]+/);
    if (!match) return;
    const target = parseInt(match[0].replace(/,/g, ""), 10);
    if (isNaN(target)) return;

    const prefix = value.slice(0, match.index);
    const suffix = value.slice(match.index! + match[0].length);
    const fmt = (n: number) => prefix + n.toLocaleString() + suffix;

    if (motionTier !== "full") {
      setDisplay(value);
      return;
    }

    const obj = { value: 0 };
    const tween = gsap.to(obj, {
      value: target,
      duration: duration.deliberate / 1000,
      delay: delay.medium / 1000,
      ease: "power2.out",
      onUpdate: () => setDisplay(fmt(Math.round(obj.value))),
      onComplete: () => setDisplay(value),
    });
    return () => {
      tween.kill();
    };
  }, [value, motionTier]);

  return display;
}

function EmergencyCard({ compact }: { compact: boolean }) {
  return (
    <motion.div variants={cardStagger} className="relative h-full min-w-0">
      <Link
        href="/emergency"
        className="group relative flex h-full items-center justify-center gap-1 sm:gap-1.5 bg-destructive text-white px-1.5 sm:px-3 min-w-0 overflow-hidden transition-[background-color] duration-fast hover:brightness-110 focus-visible:brightness-110"
        aria-label="Emergency rescue — visit the 24/7 emergency response page"
      >
        <Phone
          aria-hidden="true"
          className={cn(
            "hidden sm:block shrink-0 text-white/90 transition-all duration-[400ms] ease-[cubic-bezier(0.65,0,0.35,1)]",
            compact ? "w-[11px] h-[11px]" : "w-[13px] h-[13px] animate-top-strip-siren",
          )}
        />
        <span className="flex flex-col justify-center leading-tight min-w-0">
          <span
            className={cn(
              "font-condensed font-semibold tracking-widest uppercase text-white/80 text-[8px]",
              "hidden md:block overflow-hidden whitespace-nowrap",
              "transition-[max-height,opacity] duration-[400ms] ease-[cubic-bezier(0.65,0,0.35,1)]",
              compact ? "max-h-0 opacity-0" : "max-h-5 opacity-100",
            )}
          >
            Emergency Rescue
          </span>
          <span
            className={cn(
              "font-bold tracking-tight tabular-nums leading-tight transition-[font-size] duration-[400ms] ease-[cubic-bezier(0.65,0,0.35,1)] truncate",
              compact ? "text-[9px] sm:text-[10px]" : "text-[9px] sm:text-xs lg:text-sm",
            )}
          >
            {EMERGENCY.hotline.display}
          </span>
        </span>
      </Link>
    </motion.div>
  );
}

function StatisticsCard({ compact }: { compact: boolean }) {
  const display = useCountUpOnMount(SITE_STATS.rescuedDogs);

  return (
    <motion.div
      variants={cardStagger}
      className="relative flex h-full items-center justify-center gap-1 sm:gap-1.5 bg-rescue text-white px-1.5 sm:px-3 min-w-0 transition-[background-color] duration-fast"
      aria-hidden="true"
    >
      <Dog
        aria-hidden="true"
        className={cn(
          "shrink-0 hidden sm:block text-white/90",
          "transition-all duration-[400ms] ease-[cubic-bezier(0.65,0,0.35,1)]",
          compact ? "w-[11px] h-[11px]" : "w-[13px] h-[13px]",
        )}
      />
      <span className="flex items-baseline gap-1 min-w-0">
        <span
          className={cn(
            "font-mono font-bold tabular-nums leading-none",
            "transition-[font-size] duration-[400ms] ease-[cubic-bezier(0.65,0,0.35,1)]",
            compact ? "text-xs" : "text-xs sm:text-sm",
          )}
        >
          {display}
        </span>
        <span
          className={cn(
            "hidden md:inline font-medium text-white/70 leading-none truncate text-[9px]",
            "transition-[max-width,opacity] duration-[400ms] ease-[cubic-bezier(0.65,0,0.35,1)]",
            compact ? "max-w-0 opacity-0" : "max-w-28 opacity-100",
          )}
        >
          Dogs Rescued
        </span>
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-5"
        style={{ background: "linear-gradient(to right, transparent, var(--rescue))" }}
      />
    </motion.div>
  );
}

function DonationCard({ compact }: { compact: boolean }) {
  return (
    <motion.div variants={cardStagger} className="relative h-full min-w-0">
      <Link
        href="/donate"
        className="group flex h-full items-center justify-center gap-1 sm:gap-1.5 bg-donate text-white px-1.5 sm:px-3 min-w-0 transition-[background-color] duration-fast hover:brightness-110 focus-visible:brightness-110"
        aria-label="Support a rescue — donate today"
      >
        <Heart
          aria-hidden="true"
          className={cn(
            "shrink-0 hidden sm:block text-white/90",
            "transition-all duration-[400ms] ease-[cubic-bezier(0.65,0,0.35,1)]",
            compact ? "w-[11px] h-[11px]" : "w-[13px] h-[13px]",
          )}
        />
        <span className="relative inline-flex min-h-[1em] items-center overflow-hidden">
          <span
            className={cn(
              "font-condensed font-bold tracking-wider uppercase leading-none whitespace-nowrap",
              STRIP_CONTENT,
              compact ? "translate-y-full opacity-0" : "translate-y-0 opacity-100",
            )}
          >
            Support a Rescue
          </span>
          <span
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 font-condensed font-bold tracking-wider uppercase leading-none whitespace-nowrap",
              STRIP_CONTENT,
              compact ? "translate-y-[-50%] opacity-100" : "translate-y-[150%] opacity-0",
            )}
          >
            Donate
          </span>
        </span>
      </Link>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-5"
        style={{ background: "linear-gradient(to right, transparent, var(--rescue))" }}
      />
    </motion.div>
  );
}

export default function TopEmergencyBar({ scrolled }: TopEmergencyBarProps) {
  const reduced = useMotionStore((s) => s.motionTier) !== "full";
  const compact = scrolled;

  // Resolve strip heights once from the design tokens (kept in sync with CSS)
  const heights = useMemo(() => {
    if (typeof document === "undefined") return { full: 40, compact: 32 };
    const cs = getComputedStyle(document.documentElement);
    return {
      full: parseFloat(cs.getPropertyValue("--top-strip-height")) || 40,
      compact: parseFloat(cs.getPropertyValue("--top-strip-compact-height")) || 32,
    };
  }, []);

  return (
    <motion.div
      className="top-emergency-strip relative z-[var(--z-top-strip)] overflow-hidden bg-background will-change-[height]"
      initial={false}
      animate={{ height: compact ? heights.compact : heights.full }}
      transition={
        reduced
          ? { duration: 0 }
          : { duration: STRIP_DURATION, ease: STRIP_EASE }
      }
      role="region"
      aria-label="Emergency hotline, rescue statistics, and donation"
    >
      <style jsx global>{`
        @keyframes top-bar-marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* Desktop 3-column layout */}
      <motion.div
        className="hidden sm:grid mx-auto h-full max-w-[1280px] grid-cols-3"
        initial={reduced ? false : "hidden"}
        animate={reduced ? undefined : "visible"}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: stagger.fast, delayChildren: delay.micro / 1000 },
          },
        }}
      >
        <DonationCard compact={compact} />
        <StatisticsCard compact={compact} />
        <EmergencyCard compact={compact} />
      </motion.div>

      {/* Mobile continuous marquee */}
      <div className="sm:hidden flex items-center h-full w-full overflow-hidden relative">
        <div
          className="flex items-center h-full shrink-0"
          style={{
            animation: reduced ? "none" : "top-bar-marquee 16s linear infinite",
            display: "flex",
            width: "max-content",
          }}
        >
          {/* Loop Set 1 */}
          <div className="flex items-center h-full shrink-0">
            <DonationCard compact={compact} />
            <StatisticsCard compact={compact} />
            <EmergencyCard compact={compact} />
          </div>
          {/* Loop Set 2 (Duplicate for seamless loop) */}
          <div className="flex items-center h-full shrink-0" aria-hidden="true">
            <DonationCard compact={compact} />
            <StatisticsCard compact={compact} />
            <EmergencyCard compact={compact} />
          </div>
        </div>
      </div>

      <span className="sr-only">{SITE_STATS.rescuedDogs} dogs rescued</span>
    </motion.div>
  );
}