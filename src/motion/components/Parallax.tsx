"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useMotionStore } from "../motion-store";
import { cn } from "../../app/components/ui/utils";

/**
 * Parallax — scroll-linked depth for decorative layers.
 *
 * Wraps its children and drifts them at a different speed than the page:
 * positive speed follows the scroll, negative counters it. Driven through
 * MotionValues + a spring so nothing re-renders on scroll, and it degrades
 * to a static layer (no transform) under reduced motion or a non-full tier.
 *
 * Note: this only works while Lenis scrolls natively (window scroll), which
 * it does — framer-motion reads real scroll position, so the two stay in sync.
 */

interface ParallaxProps {
  /** Drift amount: ±(speed × 200)px over the element's pass. Default 0.12. */
  speed?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export function Parallax({ speed = 0.12, className, style, children }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { motionTier, reducedMotion } = useMotionStore();
  const enabled = motionTier === "full" && !reducedMotion;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const travel = speed * 200;
  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], [-travel, travel]),
    { stiffness: 90, damping: 22, mass: 0.6 },
  );

  return (
    <div ref={ref} className={cn("will-change-transform", className)} style={style}>
      <motion.div style={enabled ? { y } : undefined}>{children}</motion.div>
    </div>
  );
}
