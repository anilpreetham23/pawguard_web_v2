"use client";

/**
 * LiveActivityFeed — Phase 6
 *
 * Independent, reusable component.
 * Accepts an optional `activities` prop so it can be driven by a live API or
 * WebSocket in the future — no refactoring required.
 * Falls back to MOCK_ACTIVITIES when no prop is supplied.
 *
 * Animation contract (GPU only):
 *  - Cards enter via opacity + translateY.
 *  - Cards exit via opacity + translateY.
 *  - No width / height / filter animations.
 *  - AnimatePresence mode="popLayout" keeps layout stable.
 *  - Respects prefers-reduced-motion via MotionConfig in parent.
 */

import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ACTIVITY_META, MOCK_ACTIVITIES, type Activity } from "./services-data";
import { useMotionStore } from "../../../motion/motion-store";

interface LiveActivityFeedProps {
  /** Pass live data here; falls back to mock when omitted */
  activities?: Activity[];
  /** Max cards visible at once (default 5) */
  maxVisible?: number;
  className?: string;
}

const STATUS_BADGE: Record<Activity["status"], { label: string; cls: string }> = {
  completed: { label: "Completed", cls: "bg-primary/8 text-primary" },
  ongoing:   { label: "Ongoing",   cls: "bg-destructive/8 text-destructive" },
};

const ActivityCard = forwardRef<HTMLDivElement, { item: Activity }>(function ActivityCard(
  { item },
  ref,
) {
  const meta   = ACTIVITY_META[item.eventType];
  const badge  = STATUS_BADGE[item.status];

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14, transition: { duration: 0.22 } }}
      transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
      className="flex items-start gap-3 rounded-xl border border-border/60 bg-background px-3.5 py-3 shadow-sm"
    >
      {/* Emoji icon */}
      <span className="mt-0.5 text-base leading-none shrink-0" role="img" aria-hidden="true">
        {meta.emoji}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground leading-snug">
          <span style={{ color: meta.color }}>{item.dogName}</span>
          {" "}
          <span className="font-normal text-muted-foreground">{meta.label}</span>
        </p>
        {item.location && (
          <p className="mt-0.5 text-xs text-muted-foreground">{item.location}</p>
        )}
      </div>

      {/* Right column: time + status */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="font-condensed text-2xs font-semibold uppercase tracking-wider text-muted-foreground/60">
          {item.time}
        </span>
        <span className={`rounded-full px-2 py-0.5 font-condensed text-2xs font-semibold uppercase tracking-wider ${badge.cls}`}>
          {badge.label}
        </span>
      </div>
    </motion.div>
  );
});

export function LiveActivityFeed({
  activities,
  maxVisible = 5,
  className = "",
}: LiveActivityFeedProps) {
  const motionTier = useMotionStore((s) => s.motionTier);
  const reduced    = motionTier !== "full";

  const listRef    = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState(0);

  // Pin the card list to a stable height (exactly `maxVisible` cards). Card
  // rotation otherwise transiently holds `maxVisible + 1` cards in flow, which
  // grows the section (and page) height every tick and makes the browser's
  // scroll anchoring yank the page up/down. A fixed, clipped height keeps the
  // layout static while the cards still slide through on the GPU.
  useLayoutEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const measure = () => {
      const next = el.scrollHeight;
      setListHeight((prev) => (next > 0 ? next : prev));
    };
    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [maxVisible]);

  // Seed with first `maxVisible` items; each gets a unique numeric key
  const [visible, setVisible] = useState<(Activity & { _key: number })[]>(() =>
    (activities ?? MOCK_ACTIVITIES).slice(0, maxVisible).map((a, i) => ({ ...a, _key: i })),
  );

  const counterRef = useRef((activities ?? MOCK_ACTIVITIES).length);
  const poolRef    = useRef((activities ?? MOCK_ACTIVITIES).slice(maxVisible));

  // When external `activities` prop changes (live data), reset the feed
  useEffect(() => {
    if (!activities) return;
    setVisible(activities.slice(0, maxVisible).map((a, i) => ({ ...a, _key: i })));
    counterRef.current = activities.length;
    poolRef.current    = activities.slice(maxVisible);
  }, [activities, maxVisible]);

  // Auto-rotate mock data when no live feed is provided
  useEffect(() => {
    if (activities || reduced) return;
    const id = setInterval(() => {
      const pool = poolRef.current;
      if (!pool.length) return;
      const next = pool[0];
      poolRef.current = [...pool.slice(1), pool[0]]; // rotate
      const key = counterRef.current++;
      setVisible((prev) => [{ ...next, _key: key }, ...prev.slice(0, maxVisible - 1)]);
    }, 3200);
    return () => clearInterval(id);
  }, [activities, maxVisible, reduced]);

  return (
    <div className={`flex flex-col gap-2 ${className}`} aria-label="Live rescue activity" aria-live="polite">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
        </span>
        <span className="font-condensed text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Live Operations
        </span>
      </div>

      {/* Cards — fixed height + clipped so rotating cards never shift the page layout */}
      <div
        ref={listRef}
        className="flex flex-col gap-2 overflow-hidden"
        style={listHeight > 0 ? { height: listHeight } : undefined}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map((item) => (
            <ActivityCard key={item._key} item={item} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
