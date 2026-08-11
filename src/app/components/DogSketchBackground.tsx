"use client";

import { useMemo } from "react";
import { useMotionStore } from "../../motion/motion-store";

/**
 * DogSketchBackground — scattered dog-related sketch illustrations
 * as subtle background art across all pages. Scrolls with content.
 *
 * Dual-layer approach:
 *   - Dark strokes (#1a1b1e) with mix-blend-mode: multiply → visible on light backgrounds
 *   - Light strokes (#ffffff) with mix-blend-mode: screen  → visible on dark backgrounds
 * On any given background, one layer is invisible and the other shows through.
 */

interface SketchItem {
  x: number;
  y: number;
  size: number;
  rotation: number;
  opacity: number;
  type: SketchType;
}

type SketchType =
  | "paw" | "bone" | "collar" | "heart" | "leash"
  | "bowl" | "house" | "stethoscope"
  | "dog" | "treat" | "tag" | "ball";

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SKETCH_SVGS: Record<SketchType, string> = {
  paw: "M16,28 C10.5,28 9,24.5 9,21.5 C9,18 11.5,15.5 16,15.5 C20.5,15.5 23,18 23,21.5 C23,24.5 21.5,28 16,28 Z M8,13.5 C6,13.5 5,11.8 5,10.2 C5,8.2 6.2,6.5 8,6.5 C9.8,6.5 11,8.2 11,10.2 C11,11.8 10,13.5 8,13.5 Z M13,10.5 C11.2,10.5 10.2,8.8 10.2,7.2 C10.2,5.4 11.4,3.8 13,3.8 C14.6,3.8 15.8,5.4 15.8,7.2 C15.8,8.8 14.8,10.5 13,10.5 Z M19,10.5 C17.2,10.5 16.2,8.8 16.2,7.2 C16.2,5.4 17.4,3.8 19,3.8 C20.6,3.8 21.8,5.4 21.8,7.2 C21.8,8.8 20.8,10.5 19,10.5 Z M24,13.5 C22.2,13.5 21.2,11.8 21.2,10.2 C21.2,8.2 22.4,6.5 24,6.5 C25.6,6.5 26.8,8.2 26.8,10.2 C26.8,11.8 25.8,13.5 24,13.5 Z",
  bone: "M8,10 C6,10 5,9 5,7.5 C5,6 6,5 8,5 C9,5 9.5,5.5 10,6 L14,6 C14.5,5.5 15,5 16,5 C18,5 19,6 19,7.5 C19,9 18,10 16,10 L16,14 C18,14 19,15 19,16.5 C19,18 18,19 16,19 C15,19 14.5,18.5 14,18 L10,18 C9.5,18.5 9,19 8,19 C6,19 5,18 5,16.5 C5,15 6,14 8,14 L8,10 Z",
  collar: "M6,16 C6,16 10,8 16,8 C22,8 26,16 26,16 C26,16 22,24 16,24 C10,24 6,16 6,16 Z M14,18 L18,18 L17,22 L15,22 Z",
  heart: "M16,28 C12,24 4,18 4,12 C4,8 7,5 10,5 C12,5 14,6 16,9 C18,6 20,5 22,5 C25,5 28,8 28,12 C28,18 20,24 16,28 Z",
  leash: "M4,8 C8,8 12,12 16,12 C20,12 24,8 28,8 M4,16 C8,16 12,20 16,20 C20,20 24,16 28,16",
  bowl: "M6,14 L26,14 C26,14 28,22 16,22 C4,22 6,14 6,14 Z M10,14 L10,10 C10,8 12,6 16,6 C20,6 22,8 22,10 L22,14",
  house: "M16,4 L4,14 L4,26 L28,26 L28,14 Z M12,26 L12,18 L20,18 L20,26 M8,14 L8,10 L12,10 L12,14",
  stethoscope: "M16,4 L16,14 M12,14 C12,18 14,20 16,20 C18,20 20,18 20,14 M8,8 C6,8 4,10 4,12 C4,14 6,16 8,16 M24,8 C26,8 28,10 28,12 C28,14 26,16 24,16 M16,20 L16,26 M14,26 L18,26",
  dog: "M8,24 L8,20 C8,18 10,16 12,16 L14,16 L16,12 L18,16 L20,16 C22,16 24,18 24,20 L24,24 M12,16 L12,14 C12,12 14,10 16,10 C18,10 20,12 20,14 L20,16 M6,22 L8,22 M24,22 L26,22 M14,13 A1,1 0 1,1 14.01,13 M18,13 A1,1 0 1,1 18.01,13",
  treat: "M16,6 C10,6 6,10 6,16 C6,22 10,26 16,26 C22,26 26,22 26,16 C26,10 22,6 16,6 Z M10,12 L12,14 M16,10 L18,12 M20,14 L22,16 M12,20 L14,22 M18,20 L20,22 M14,16 L18,16",
  tag: "M16,4 L28,16 L16,28 L4,16 Z M12,12 A2,2 0 1,1 12.01,12 M12,16 L20,16",
  ball: "M16,4 C9.4,4 4,9.4 4,16 C4,22.6 9.4,28 16,28 C22.6,28 28,22.6 28,16 C28,9.4 22.6,4 16,4 Z M4,16 L28,16 M16,4 C12,10 12,22 16,28 M16,4 C20,10 20,22 16,28",
};

const SKETCH_TYPES: SketchType[] = [
  "paw", "bone", "collar", "heart", "leash", "bowl", "house", "stethoscope",
  "dog", "treat", "tag", "ball",
];

export function DogSketchBackground() {
  const reducedMotion = useMotionStore((s) => s.reducedMotion);

  const sketches = useMemo<SketchItem[]>(() => {
    const rnd = mulberry32(77);
    return Array.from({ length: 36 }, (_, i) => ({
      x: rnd() * 94 + 3,
      y: rnd() * 96 + 2,
      size: 16 + rnd() * 18,
      rotation: (rnd() - 0.5) * 40,
      opacity: 0.06 + rnd() * 0.06,
      type: SKETCH_TYPES[i % SKETCH_TYPES.length],
    }));
  }, []);

  if (reducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Dark strokes — visible on light backgrounds via multiply blend */}
      {sketches.map((item, i) => (
        <svg
          key={`d-${i}`}
          width={item.size}
          height={item.size}
          viewBox="0 0 32 32"
          fill="none"
          stroke="#1a1b1e"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            opacity: item.opacity,
            transform: `rotate(${item.rotation}deg)`,
            mixBlendMode: "multiply",
          }}
        >
          <path d={SKETCH_SVGS[item.type]} />
        </svg>
      ))}
      {/* Light strokes — visible on dark backgrounds via screen blend */}
      {sketches.map((item, i) => (
        <svg
          key={`l-${i}`}
          width={item.size}
          height={item.size}
          viewBox="0 0 32 32"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            opacity: item.opacity * 0.7,
            transform: `rotate(${item.rotation}deg)`,
            mixBlendMode: "screen",
          }}
        >
          <path d={SKETCH_SVGS[item.type]} />
        </svg>
      ))}
    </div>
  );
}
