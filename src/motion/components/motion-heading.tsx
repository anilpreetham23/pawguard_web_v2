"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { stagger, duration, ease } from "../motion.config";
import { cn } from "../../app/components/ui/utils";

interface MotionHeadingProps {
  as?: "h1" | "h2" | "h3" | "h4";
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  wordDuration?: number;
  once?: boolean;
}

export function MotionHeading({
  as: Tag = "h2",
  children,
  className,
  staggerDelay = stagger.fast,
  wordDuration,
  once = true,
}: MotionHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once, margin: "-40px" });

  const text = typeof children === "string" ? children : "";
  const words = text.split(" ").filter(Boolean);

  if (words.length === 0) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag ref={ref} className={cn("overflow-hidden", className)}>
      <motion.span
        className="inline-flex flex-wrap"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: staggerDelay },
          },
        }}
      >
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            className="inline-block mr-[0.25em]"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: wordDuration ?? duration.gentle / 1000,
                  ease: ease.gentle,
                },
              },
            }}
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}
