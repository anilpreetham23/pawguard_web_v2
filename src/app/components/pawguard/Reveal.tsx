"use client";

import { motion } from "motion/react";
import { cn } from "../ui/utils";
import { sectionReveal } from "../../../motion";
import { useMotionStore } from "../../../motion/motion-store";

type RevealVariantKey = "hero" | "section" | "card" | "timeline" | "panel";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "span" | "section" | "article" | "li";
  /** Semantic chapter/level variant. */
  variant?: RevealVariantKey;
  /** Legacy directional variant; takes precedence over `variant`. */
  direction?: "up" | "down" | "left" | "right" | "scale" | "fade";
  once?: boolean;
}

export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
  variant = "section",
  direction,
  once = true,
}: RevealProps) {
  const motionTier = useMotionStore((s) => s.motionTier);

  if (motionTier !== "full") {
    return <Tag className={cn(className)}>{children}</Tag>;
  }

  const target = direction ? sectionReveal[direction] : sectionReveal[variant];
  const Component = motion[Tag as keyof typeof motion] as typeof motion.div;

  return (
    <Component
      className={cn(className)}
      variants={{
        hidden: target.hidden as any,
        visible: {
          ...(target.visible as any),
          transition: {
            ...((target.visible as any).transition || {}),
            delay,
          },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-40px" }}
    >
      {children}
    </Component>
  );
}
