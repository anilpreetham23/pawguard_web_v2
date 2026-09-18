import { useEffect, useRef, useState } from "react";
import { duration as durConfig } from "../motion.config";
import { useMotionStore } from "../motion-store";

interface UseCountUpOptions {
  from?: number;
  duration?: number;
  delay?: number;
}

function extractNumber(raw: string): { num: number; prefix: string; suffix: string } {
  const match = raw.match(/[\d,]+/);
  if (!match) return { num: 0, prefix: "", suffix: "" };
  const num = parseInt(match[0].replace(/,/g, ""), 10);
  const prefix = raw.slice(0, match.index);
  const suffix = raw.slice(match.index! + match[0].length);
  return { num, prefix, suffix };
}

function formatDisplay(num: number, prefix: string, suffix: string): string {
  const locale = num.toLocaleString();
  const rawMatch = (prefix + "0" + suffix).match(/[\d,]+/);
  if (!rawMatch) return prefix + locale + suffix;
  const rawPrefix = (prefix + "0" + suffix).slice(0, rawMatch.index!);
  const rawSuffix = (prefix + "0" + suffix).slice(rawMatch.index! + rawMatch[0].length);
  return rawPrefix + locale + rawSuffix;
}

export function useCountUp(formattedValue: string, options: UseCountUpOptions = {}) {
  const [display, setDisplay] = useState(formattedValue);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const motionTier = useMotionStore((s) => s.motionTier);
  const [animated, setAnimated] = useState(false);

  const { num, prefix, suffix } = extractNumber(formattedValue);

  useEffect(() => {
    if (animated || isNaN(num) || num === 0) return;
    if (motionTier === "none") {
      setDisplay(formattedValue);
      setAnimated(true);
      return;
    }

    const dur = options.duration ?? durConfig.deliberate / 1000;
    const delay = options.delay ?? 0;

    const el = triggerRef.current;
    if (!el) return;

    let tween: any = null;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();

        if (motionTier === "reduced") {
          setDisplay(formattedValue);
          setAnimated(true);
          return;
        }

        let rafId: number;
        const startTime = performance.now();
        const animDuration = dur * 1000;
        const startVal = options.from ?? 0;

        const animate = (now: number) => {
          const elapsed = Math.max(0, now - (startTime + delay * 1000));
          const progress = Math.min(elapsed / animDuration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(startVal + (num - startVal) * easeProgress);
          setDisplay(formatDisplay(current, prefix, suffix));

          if (progress < 1) {
            rafId = requestAnimationFrame(animate);
          } else {
            setAnimated(true);
          }
        };

        rafId = requestAnimationFrame(animate);
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
    };
  }, [num, prefix, suffix, formattedValue, options.from, options.duration, options.delay, motionTier, animated]);

  return { display, triggerRef };
}

export function formatStatValue(num: number, suffix: string): string {
  return formatDisplay(num, "", suffix);
}
