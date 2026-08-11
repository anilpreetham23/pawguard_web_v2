"use client";

/**
 * CenterHub — Phase 4
 *
 * Displays the PawGuard brand mark at the circle center.
 * Reacts to the active service:
 *  - Border color + box-shadow transition to service accent.
 *  - Stat + label swap with AnimatePresence (fade + scale).
 *  - Numbers animate via GSAP counter (same pattern as StoryContent).
 *  - Ripple pulse on service change.
 */

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { gsap } from "gsap";
import { DEFAULT_CENTER, type ServiceData } from "./services-data";
import { useMotionStore } from "../../../motion/motion-store";

interface CenterHubProps {
  accent: { text: string; border: string; glow: string } | null;
  activeService: ServiceData | null;
}

function parseNum(raw: string) {
  const m = raw.match(/[\d,]+/);
  return m ? parseInt(m[0].replace(/,/g, ""), 10) : NaN;
}

function AnimatedCounter({ value, color }: { value: string; color: string }) {
  const motionTier = useMotionStore((s) => s.motionTier);
  const num = parseNum(value);
  const prefix = Number.isNaN(num) ? value : value.slice(0, value.search(/[\d,]/));
  const rawSuffix = Number.isNaN(num) ? "" : value.slice(value.search(/[\d,]/) + (value.match(/[\d,]+/)?.[0].length ?? 0));
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (motionTier !== "full" || Number.isNaN(num)) {
      setDisplay(value);
      return;
    }
    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: num,
      duration: 0.65,
      ease: "back.out(1.4)",
      onUpdate: () => setDisplay(prefix + Math.round(obj.v).toLocaleString() + rawSuffix),
    });
    return () => { tween.kill(); };
  }, [value, num, prefix, rawSuffix, motionTier]);

  return (
    <span
      className="mt-0.5 font-mono text-lg font-bold leading-none tabular-nums"
      style={{ color }}
    >
      {display}
    </span>
  );
}

export function CenterHub({ accent, activeService }: CenterHubProps) {
  const stat  = activeService?.centerStat  ?? DEFAULT_CENTER.stat;
  const label = activeService?.centerLabel ?? DEFAULT_CENTER.sub;
  const color = accent?.text ?? "var(--color-foreground)";
  const key   = activeService?.id ?? "default";

  return (
    <motion.div
      className="pointer-events-none absolute left-1/2 top-1/2 z-30 flex aspect-square w-[30%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background animate-services-hub-breathe"
      initial={false}
      animate={{
        borderColor: accent ? accent.border : "var(--color-border)",
        boxShadow:   accent ? `0 0 34px -6px ${accent.glow}` : "var(--shadow-md)",
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ borderWidth: 2, borderStyle: "solid" }}
    >
      {/* Ripple on service change */}
      {accent && (
        <motion.div
          key={`ripple-${accent.text}`}
          className="absolute inset-0 rounded-full"
          initial={{ opacity: 0.5, scale: 0.94 }}
          animate={{ opacity: 0, scale: 1.14 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
          style={{ boxShadow: `inset 0 0 26px ${accent.glow}` }}
          aria-hidden="true"
        />
      )}

      {/* Stat + label — swap with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          className="flex flex-col items-center px-2 text-center"
          initial={{ opacity: 0, scale: 0.88, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: -4 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          <span className="font-serif text-sm font-bold leading-tight text-foreground/90">
            {DEFAULT_CENTER.title}
          </span>
          <AnimatedCounter value={stat} color={color} />
          <span className="font-condensed mt-0.5 text-2xs font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">
            {label}
          </span>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
