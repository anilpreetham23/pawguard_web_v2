"use client";

import { useCountUp } from "../../motion/hooks/use-count-up";
import { duration } from "../../motion/motion.config";

interface ImpactMetricProps {
  value: string;
  label: string;
  prefix?: string;
  /** Seconds to offset the periodic shimmer across metrics. */
  shimmerDelay?: number;
}

export default function ImpactMetric({ value, label, prefix, shimmerDelay = 0 }: ImpactMetricProps) {
  const { display, triggerRef } = useCountUp(value, {
    duration: duration.slow / 1000,
  });

  return (
    <div className="relative flex flex-col gap-1.5 overflow-hidden">
      <span
        ref={triggerRef}
        className="text-foreground font-serif font-bold text-3xl lg:text-4xl leading-none tracking-tight tabular-nums"
      >
        {prefix}{display}
      </span>
      <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase font-condensed">{label}</span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-stat-shimmer bg-gradient-to-r from-transparent via-primary/15 to-transparent"
        style={{ animationDelay: `${shimmerDelay}s` }}
      />
    </div>
  );
}
