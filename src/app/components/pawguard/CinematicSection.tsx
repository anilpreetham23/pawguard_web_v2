"use client";

import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { duration, ease } from "../../../motion/motion.config";
import { useMotionStore } from "../../../motion/motion-store";

interface CinematicSectionProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "fade";
  delay?: number;
}

export function CinematicSection({
  children,
  className,
  direction = "up",
  delay = 0,
}: CinematicSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const motionTier = useMotionStore((s) => s.motionTier);
  const animate = motionTier === "full";

  const variants = {
    up: { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } },
    down: { hidden: { opacity: 0, y: -32 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: -32 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 32 }, visible: { opacity: 1, x: 0 } },
    fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  };

  const v = variants[direction] ?? variants.up;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={animate ? v.hidden : false}
      animate={animate && inView ? v.visible : false}
      transition={{
        duration: duration.reveal / 1000,
        ease: ease.narrative,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
