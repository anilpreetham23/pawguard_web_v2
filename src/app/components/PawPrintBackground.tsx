"use client";

import { useMemo } from "react";
import { useMotionStore } from "../../motion/motion-store";

/**
 * PawPrintBackground — subtle, fixed-position sketch-style paw prints
 * scattered across the viewport. Appears below the hero section only
 * (the hero's solid bg-background covers it). Uses pure SVG + CSS
 * for zero runtime cost. Respects reduced motion.
 */

interface PawPrint {
  x: number;
  y: number;
  size: number;
  rotation: number;
  opacity: number;
  flip: boolean;
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Sketch-style paw SVG path — hand-drawn look with slightly irregular edges */
const PAW_SVG = `
M16,28 C10.5,28 9,24.5 9,21.5 C9,18 11.5,15.5 16,15.5 C20.5,15.5 23,18 23,21.5 C23,24.5 21.5,28 16,28 Z
M8,13.5 C6,13.5 5,11.8 5,10.2 C5,8.2 6.2,6.5 8,6.5 C9.8,6.5 11,8.2 11,10.2 C11,11.8 10,13.5 8,13.5 Z
M13,10.5 C11.2,10.5 10.2,8.8 10.2,7.2 C10.2,5.4 11.4,3.8 13,3.8 C14.6,3.8 15.8,5.4 15.8,7.2 C15.8,8.8 14.8,10.5 13,10.5 Z
M19,10.5 C17.2,10.5 16.2,8.8 16.2,7.2 C16.2,5.4 17.4,3.8 19,3.8 C20.6,3.8 21.8,5.4 21.8,7.2 C21.8,8.8 20.8,10.5 19,10.5 Z
M24,13.5 C22.2,13.5 21.2,11.8 21.2,10.2 C21.2,8.2 22.4,6.5 24,6.5 C25.6,6.5 26.8,8.2 26.8,10.2 C26.8,11.8 25.8,13.5 24,13.5 Z
`;

export function PawPrintBackground() {
  const reducedMotion = useMotionStore((s) => s.reducedMotion);

  const paws = useMemo<PawPrint[]>(() => {
    const rnd = mulberry32(42);
    return Array.from({ length: 18 }, () => ({
      x: rnd() * 100,
      y: rnd() * 100,
      size: 14 + rnd() * 18,
      rotation: (rnd() - 0.5) * 50,
      opacity: 0.025 + rnd() * 0.03,
      flip: rnd() > 0.5,
    }));
  }, []);

  if (reducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {paws.map((paw, i) => (
        <svg
          key={i}
          width={paw.size}
          height={paw.size}
          viewBox="0 0 32 32"
          className="absolute"
          style={{
            left: `${paw.x}%`,
            top: `${paw.y}%`,
            opacity: paw.opacity,
            transform: `rotate(${paw.rotation}deg)${paw.flip ? " scaleX(-1)" : ""}`,
          }}
        >
          <path
            d={PAW_SVG}
            fill="currentColor"
            className="text-foreground"
          />
        </svg>
      ))}
    </div>
  );
}
