"use client";

/**
 * StoryContent — Phase 5
 *
 * Renders the full service detail panel.
 * Additions over the original:
 *  - Animated workflow steps (auto-advance every 1.8 s).
 *  - Staggered entrance for every content block.
 *  - CountStat unchanged (GSAP counter already existed).
 *  - Timeline unchanged (kept for backward compat).
 */

import { memo, useEffect, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { motion } from "motion/react";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "../pawguard/Button";
import { useMotionStore } from "../../../motion/motion-store";
import { fadeUp, panelVariants, timelineDot, timelineFill } from "./motion-variants";
import type { ServiceData } from "./services-data";

/* ─── CountStat (unchanged from original) ─────────────────────────────────── */

function parseValue(raw: string): { num: number; prefix: string; suffix: string } {
  const match = raw.match(/[\d,]+/);
  if (!match) return { num: NaN, prefix: raw, suffix: "" };
  return {
    num: parseInt(match[0].replace(/,/g, ""), 10),
    prefix: raw.slice(0, match.index),
    suffix: raw.slice(match.index! + match[0].length),
  };
}

function formatValue(v: number, prefix: string, suffix: string): string {
  return prefix + Math.round(v).toLocaleString() + suffix;
}

export function CountStat({
  value,
  label,
  color,
  delay,
}: {
  value: string;
  label: string;
  color: string;
  delay: number;
}) {
  const motionTier = useMotionStore((s) => s.motionTier);
  const { num, prefix, suffix } = parseValue(value);
  const [display, setDisplay] = useState(() =>
    motionTier === "full" && !Number.isNaN(num) ? prefix + "0" + suffix : value,
  );

  useEffect(() => {
    if (motionTier !== "full" || Number.isNaN(num)) {
      setDisplay(value);
      return;
    }
    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: num,
      duration: 0.75,
      delay,
      ease: "back.out(1.6)",
      onUpdate: () => setDisplay(formatValue(obj.v, prefix, suffix)),
    });
    return () => { tween.kill(); };
  }, [num, prefix, suffix, delay, motionTier, value]);

  return (
    <div className="flex flex-col gap-1">
      <span className="font-serif text-2xl font-bold leading-none tabular-nums lg:text-3xl" style={{ color }}>
        {display}
      </span>
      <span className="font-condensed text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

/* ─── Legacy flat Timeline (unchanged) ────────────────────────────────────── */

function Timeline({ steps, color }: { steps: string[]; color: string }) {
  return (
    <div className="relative mt-4">
      <div className="absolute left-0 right-0 top-[5px] h-px bg-border/70" aria-hidden="true" />
      <motion.div
        variants={timelineFill as any}
        className="absolute left-0 top-[5px] h-px will-change-transform"
        style={{ backgroundColor: color, transformOrigin: "left" }}
        aria-hidden="true"
      />
      <motion.div
        variants={timelineDot as any}
        className="absolute left-0 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full shadow-sm"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      <div className="relative flex justify-between">
        {steps.map((s) => (
          <div key={s} className="flex w-full flex-col items-center gap-2">
            <span
              className="z-10 h-2.5 w-2.5 rounded-full border-2 bg-background"
              style={{ borderColor: color }}
              aria-hidden="true"
            />
            <span className="font-condensed text-center text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
              {s}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Animated Workflow (new) ──────────────────────────────────────────────── */

function AnimatedWorkflow({ service }: { service: ServiceData }) {
  const motionTier = useMotionStore((s) => s.motionTier);
  const reduced = motionTier !== "full";
  const steps = service.workflow;
  const [activeStep, setActiveStep] = useState(0);

  // Auto-advance through steps; reset when service changes
  useEffect(() => {
    setActiveStep(0);
    if (reduced) return;
    const id = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 1800);
    return () => clearInterval(id);
  }, [service.id, steps.length, reduced]);

  return (
    <ol className="flex flex-col gap-0" aria-label={`${service.title} process`}>
      {steps.map((step, i) => {
        const isActive = activeStep === i;
        const isPast   = i < activeStep;
        return (
          <li key={step.label} className="flex items-start gap-2.5">
            {/* Step indicator column */}
            <div className="flex flex-col items-center shrink-0 pt-0.5">
              <motion.div
                className="flex h-5 w-5 items-center justify-center rounded-full border-2 text-[10px] font-bold"
                animate={{
                  borderColor:     isActive ? service.color.text : isPast ? service.color.border : "var(--color-border)",
                  backgroundColor: isActive ? service.color.text : isPast ? service.color.soft  : "transparent",
                  color:           isActive ? "#fff"              : isPast ? service.color.text  : "var(--color-muted-foreground)",
                  scale:           isActive ? 1.15 : 1,
                }}
                transition={{ duration: 0.25 }}
              >
                {isPast ? (
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  i + 1
                )}
              </motion.div>
              {i < steps.length - 1 && (
                <motion.div
                  className="w-px"
                  style={{ height: 14 }}
                  animate={{
                    backgroundColor: isPast ? service.color.text : "var(--color-border)",
                    opacity: isPast ? 0.5 : 0.25,
                  }}
                  transition={{ duration: 0.25 }}
                />
              )}
            </div>

            {/* Step text */}
            <div className="pb-1 min-w-0">
              <motion.p
                className="text-xs font-semibold leading-snug"
                animate={{
                  color: isActive ? service.color.text : isPast ? "var(--color-foreground)" : "var(--color-muted-foreground)",
                }}
                transition={{ duration: 0.25 }}
              >
                {step.label}
              </motion.p>
              <motion.p
                className="text-2xs text-muted-foreground leading-snug"
                animate={{ opacity: isActive ? 1 : 0.5 }}
                transition={{ duration: 0.25 }}
              >
                {step.detail}
              </motion.p>
            </div>

            {/* Live pulse on active step */}
            {isActive && !reduced && (
              <motion.span
                className="ml-auto mt-1 h-1.5 w-1.5 rounded-full shrink-0"
                style={{ backgroundColor: service.color.text }}
                animate={{ scale: [1, 1.7, 1], opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.1, repeat: Infinity }}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* ─── Section label helper ─────────────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-condensed text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
      {children}
    </p>
  );
}

/* ─── Main StoryContent ────────────────────────────────────────────────────── */

export const StoryContent = memo(function StoryContent({ service }: { service: ServiceData }) {
  const c = service.color;

  return (
    <motion.div variants={panelVariants} className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <motion.div variants={fadeUp(0.05)} className="flex flex-col gap-3">
        <span
          className="inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 font-condensed text-2xs font-semibold uppercase tracking-wider"
          style={{ color: c.text, backgroundColor: c.tint, border: `1px solid ${c.border}` }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c.text }} aria-hidden="true" />
          {service.badge}
        </span>
        <h3 className="font-serif text-3xl font-bold leading-tight tracking-tight text-foreground lg:text-[2.6rem]">
          {service.title}
        </h3>
        <p className="text-lg leading-snug text-muted-foreground">{service.subtitle}</p>
      </motion.div>

      <motion.div variants={fadeUp(0.13)} className="mt-5 h-px w-full bg-border/70" aria-hidden="true" />

      <motion.p variants={fadeUp(0.2)} className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
        {service.description}
      </motion.p>

      {/* Capabilities */}
      <motion.div variants={fadeUp(0.28)} className="mt-6">
        <SectionLabel>Capabilities</SectionLabel>
        <ul className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
          {service.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm leading-snug text-foreground/85">
              <Check size={14} strokeWidth={2.5} className="mt-0.5 shrink-0" style={{ color: c.text }} />
              {f}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Animated workflow + legacy timeline side-by-side on larger screens */}
      <motion.div variants={fadeUp(0.36)} className="mt-6 grid gap-grid-md sm:grid-cols-2">
        <div>
          <SectionLabel>Process</SectionLabel>
          <div className="mt-3">
            <AnimatedWorkflow service={service} />
          </div>
        </div>
        <div>
          <SectionLabel>Timeline</SectionLabel>
          <Timeline steps={service.timeline} color={c.text} />
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeUp(0.52)} className="mt-6 border-t border-border/70 pt-5">
        <div className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
          {service.stats.map((s, i) => (
            <CountStat key={s.label} value={s.value} label={s.label} color={c.text} delay={0.52 + i * 0.06} />
          ))}
        </div>
      </motion.div>

      {/* CTAs */}
      <motion.div variants={fadeUp(0.64)} className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-4 pt-6">
        <Button asLink={{ href: service.primaryCta.to }} variant="primary" size="md">
          {service.primaryCta.label}
        </Button>
        {service.secondaryCta && (
          <Link
            href={service.secondaryCta.to}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            {service.secondaryCta.label}
            <ArrowRight size={14} />
          </Link>
        )}
      </motion.div>
    </motion.div>
  );
});
