"use client";

import { motion } from "motion/react";
import { cn } from "../ui/utils";
import { QUADRANT_LAYOUT, type ServiceData } from "./services-data";
import { ease } from "../../../motion";

interface QuadrantProps {
  service: ServiceData;
  index: number;
  isActive: boolean;
  isDimmed: boolean;
  isFocused: boolean;
  onHover: () => void;
  onLeave: () => void;
  onSelect: () => void;
  onFocus: () => void;
  onBlur: () => void;
  registerRef: (el: HTMLButtonElement | null, index: number) => void;
}

export function Quadrant({
  service,
  index,
  isActive,
  isDimmed,
  isFocused,
  onHover,
  onLeave,
  onSelect,
  onFocus,
  onBlur,
  registerRef,
}: QuadrantProps) {
  const layout = QUADRANT_LAYOUT[service.id];
  const Icon = service.icon;
  const clipId = `clip-${service.id}`;

  return (
    <button
      ref={(el) => registerRef(el, index)}
      type="button"
      className={cn(
        "absolute inset-0 bg-transparent cursor-pointer select-none",
        "focus-visible:outline-none",
        isActive ? "z-20" : "z-10",
      )}
      // pointer-events:none on the button rect — only the SVG path shape receives events
      style={{ pointerEvents: "none" }}
      role="tab"
      aria-selected={isActive}
      aria-controls="services-story-panel"
      aria-label={`${service.title} — ${service.metric} ${service.metricLabel}`}
      tabIndex={isFocused ? 0 : -1}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <motion.div
        className="absolute inset-0 will-change-transform animate-services-sector-drift"
        style={{ transformOrigin: layout.origin, animationDelay: `${index * 2.2}s` }}
        initial={false}
        animate={{ scale: isActive ? 1.04 : isDimmed ? 0.98 : 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 26, mass: 0.9 }}
      >
        {/* Sector fill — pointer-events only on the path shape */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full overflow-visible"
          aria-hidden="true"
          style={{ pointerEvents: "none" }}
        >
          <defs>
            {/* Clip to circle so no square corners show */}
            <clipPath id={clipId}>
              <circle cx="50" cy="50" r="49.5" />
            </clipPath>
          </defs>
          <motion.path
            d={layout.path}
            clipPath={`url(#${clipId})`}
            fill={isActive ? service.color.soft : service.color.tint}
            stroke={isActive ? service.color.border : "var(--color-border)"}
            strokeWidth={0.6}
            strokeLinejoin="round"
            initial={false}
            animate={{ opacity: isDimmed ? 0.2 : 1 }}
            transition={{ duration: 0.3, ease: ease.standard }}
            // Only the path shape receives pointer events
            style={{ pointerEvents: "all", cursor: "pointer" }}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            onClick={onSelect}
          />
        </svg>

        {/* Icon + label */}
        <motion.div
          className="absolute z-10 flex flex-col items-center text-center px-1 pointer-events-none"
          style={{ left: layout.anchorX, top: layout.anchorY, x: "-50%", y: "-50%" }}
          initial={false}
          animate={{
            scale: isActive ? 1.08 : 1,
            opacity: isDimmed ? 0.22 : 1,
          }}
          transition={{ duration: 0.3, ease: ease.gentle }}
        >
          <motion.span
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full",
              isActive && "bg-background/80 shadow-sm",
            )}
            initial={false}
            animate={{
              color: isActive ? service.color.text : "var(--color-muted-foreground)",
              scale: isActive ? 1.15 : 1,
            }}
            transition={{ duration: 0.3, ease: ease.gentle }}
          >
            <motion.span
              animate={isActive ? { rotate: [0, -8, 8, 0] } : { rotate: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
            >
              <Icon size={19} strokeWidth={2} />
            </motion.span>
          </motion.span>

          <span
            className={cn(
              "font-condensed mt-1.5 text-xs uppercase leading-tight tracking-wider",
              isActive ? "font-bold" : "font-semibold",
            )}
            style={{ color: isActive ? service.color.text : "var(--color-muted-foreground)" }}
          >
            {service.short}
          </span>

          <span
            className="font-mono text-sm font-bold leading-tight tabular-nums"
            style={{ color: isActive ? service.color.text : "var(--color-muted-foreground)" }}
          >
            {service.metric}
          </span>
        </motion.div>
      </motion.div>
    </button>
  );
}
