"use client";

/**
 * GuidePath — curved Bézier connector: icon edge → story panel paragraph.
 * Renders ONLY on hover/focus. Zero output when idle.
 * 1px stroke, cubic Bézier, strokeDashoffset animation only.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { QuadrantId, ServiceData } from "./services-data";

interface Pt { x: number; y: number; }

export interface GuidePathProps {
  activeService: ServiceData | null;
  sectionRef: React.RefObject<HTMLElement | null>;
  circleRef:  React.RefObject<HTMLDivElement | null>;
  panelRef:   React.RefObject<HTMLDivElement | null>;
}

/** Fractional position of each icon within the circle container — matches QUADRANT_LAYOUT anchors */
const ICON_FRAC: Record<QuadrantId, Pt> = {
  emergency:  { x: 0.80, y: 0.50 },
  adoption:   { x: 0.50, y: 0.80 },
  veterinary: { x: 0.50, y: 0.20 },
  foster:     { x: 0.20, y: 0.50 },
};

/**
 * Per-service Y offset for the first Bezier control point (c1).
 * Expressed as a fraction of the circle height. Positive = downward.
 * Foster needs to curve downward to avoid crossing through the circle center.
 */
const C1_Y_OFFSET: Record<QuadrantId, number> = {
  emergency:  0,
  adoption:   0,
  veterinary: 0,
  foster:     0.30,
};

interface Measurements {
  section: DOMRect;
  circle:  DOMRect;
  panel:   DOMRect;
}

interface PathState {
  d: string;
  len: number;
}

function build(m: Measurements, id: QuadrantId): PathState {
  const f = ICON_FRAC[id];
  const sec = m.section;

  // Start: icon position
  const startX = m.circle.left - sec.left + m.circle.width  * f.x;
  const startY = m.circle.top  - sec.top  + m.circle.height * f.y;

  // End: left edge of panel, beside the first paragraph (~110px from panel top)
  const endX = m.panel.left - sec.left - 8;
  const endY = m.panel.top  - sec.top  + 110;

  // Cubic Bézier control points
  // c1 is shifted downward for foster to avoid crossing through the circle center
  const midX = (startX + endX) / 2;
  const c1YOffset = m.circle.height * C1_Y_OFFSET[id];
  const c1: Pt = { x: midX, y: startY + c1YOffset };
  const c2: Pt = { x: midX, y: endY };

  const d = `M ${startX.toFixed(1)},${startY.toFixed(1)} C ${c1.x.toFixed(1)},${c1.y.toFixed(1)} ${c2.x.toFixed(1)},${c2.y.toFixed(1)} ${endX.toFixed(1)},${endY.toFixed(1)}`;

  // Approximate length via straight-line distance × 1.2 for the curve
  const dx = endX - startX, dy = endY - startY;
  const len = Math.ceil(Math.sqrt(dx * dx + dy * dy) * 1.2) + 10;

  return { d, len };
}

export function GuidePath({ activeService, sectionRef, circleRef, panelRef }: GuidePathProps) {
  const measureRef = useRef<Measurements | null>(null);
  const [svgSize,   setSvgSize]   = useState({ w: 0, h: 0 });
  const [pathState, setPathState] = useState<PathState | null>(null);

  const measure = useCallback(() => {
    const s = sectionRef.current;
    const c = circleRef.current;
    const p = panelRef.current;
    if (!s || !c || !p) return;
    const sr = s.getBoundingClientRect();
    measureRef.current = { section: sr, circle: c.getBoundingClientRect(), panel: p.getBoundingClientRect() };
    setSvgSize({ w: Math.ceil(sr.width), h: Math.ceil(sr.height) });
  }, [sectionRef, circleRef, panelRef]);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    [sectionRef, circleRef, panelRef].forEach(r => { if (r.current) ro.observe(r.current); });
    return () => ro.disconnect();
  }, [measure]);

  useEffect(() => {
    if (!activeService || !measureRef.current || measureRef.current.section.width < 768) {
      setPathState(null); return;
    }
    setPathState(build(measureRef.current, activeService.id));
  }, [activeService?.id, svgSize.w, svgSize.h]);

  if (svgSize.w < 768) return null;

  return (
    <AnimatePresence>
      {activeService && pathState && (
        <motion.svg
          key={activeService.id}
          className="pointer-events-none absolute inset-0 z-40 overflow-visible"
          style={{ width: svgSize.w, height: svgSize.h, top: 0, left: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          aria-hidden="true"
        >
          <motion.path
            d={pathState.d}
            fill="none"
            stroke="rgba(37,99,235,0.4)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeDasharray={pathState.len}
            initial={{ strokeDashoffset: pathState.len }}
            animate={{ strokeDashoffset: 0 }}
            exit={{ strokeDashoffset: pathState.len }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.svg>
      )}
    </AnimatePresence>
  );
}
