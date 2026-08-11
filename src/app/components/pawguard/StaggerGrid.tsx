"use client";

import { motion } from "motion/react";
import { cn } from "../ui/utils";
import { stagger, sectionReveal } from "../../../motion";
import { useMotionStore } from "../../../motion/motion-store";

interface StaggerGridProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerGrid({ children, className, staggerDelay = stagger.standard }: StaggerGridProps) {
  const motionTier = useMotionStore((s) => s.motionTier);

  if (motionTier !== "full") {
    return <div className={cn("grid", className)}>{children}</div>;
  }

  return (
    <motion.div
      className={cn("grid", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: staggerDelay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  const motionTier = useMotionStore((s) => s.motionTier);

  if (motionTier !== "full") {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: sectionReveal.card.hidden as any,
        visible: sectionReveal.card.visible as any,
      }}
    >
      {children}
    </motion.div>
  );
}
