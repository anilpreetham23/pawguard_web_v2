"use client";

import "../../../styles/navbar-footprints.css";

// ─── Navbar layout at max-width 1280px, px-8 (32px padding each side) ─────────
//
//  [Logo 0–148px] [GAP1 155–310px] [Nav 320–760px] [GAP2 768–920px] [Donate+Emergency 968–1248px]
//
//  As % of 1280px:
//    GAP1  : 12.1% → 24.2%   ← paw trail lives here
//    GAP2  : 60.0% → 71.0%   ← bone icons live here (Search+Toggle removed)
//    GAP3  : 72.5% → 74.5%   ← heartbeat line lives here
// ─────────────────────────────────────────────────────────────────────────────

// ─── PAW TRAIL (Gap 1) ────────────────────────────────────────────────────────
interface FootprintDef {
  x: number; y: number; size: number; rotate: number; opacity: number; flip: boolean;
}

const TRAIL: FootprintDef[] = [
  { x: 12.1, y: 46, size: 18, rotate: -15, opacity: 0.18, flip: false },
  { x: 15.2, y: 26, size: 20, rotate:  12, opacity: 0.20, flip: true  },
  { x: 17.6, y: 48, size: 19, rotate: -11, opacity: 0.22, flip: false },
  { x: 20.8, y: 24, size: 22, rotate:   9, opacity: 0.24, flip: true  },
  { x: 23.1, y: 46, size: 20, rotate: -13, opacity: 0.21, flip: false },
  { x: 25.7, y: 28, size: 19, rotate:   8, opacity: 0.18, flip: true  },
  { x: 27.5, y: 48, size: 18, rotate: -10, opacity: 0.13, flip: false },
];

const TRAIL_PATH = "M 155 46 C 172 28, 190 48, 210 24 S 248 46, 268 28 S 305 48, 352 36";

const PAW_PATH = [
  "M16,28 C10.5,28 9,24.5 9,21.5 C9,18 11.5,15.5 16,15.5 C20.5,15.5 23,18 23,21.5 C23,24.5 21.5,28 16,28 Z",
  "M8,13.5 C6,13.5 5,11.8 5,10.2 C5,8.2 6.2,6.5 8,6.5 C9.8,6.5 11,8.2 11,10.2 C11,11.8 10,13.5 8,13.5 Z",
  "M13,10.5 C11.2,10.5 10.2,8.8 10.2,7.2 C10.2,5.4 11.4,3.8 13,3.8 C14.6,3.8 15.8,5.4 15.8,7.2 C15.8,8.8 14.8,10.5 13,10.5 Z",
  "M19,10.5 C17.2,10.5 16.2,8.8 16.2,7.2 C16.2,5.4 17.4,3.8 19,3.8 C20.6,3.8 21.8,5.4 21.8,7.2 C21.8,8.8 20.8,10.5 19,10.5 Z",
  "M24,13.5 C22.2,13.5 21.2,11.8 21.2,10.2 C21.2,8.2 22.4,6.5 24,6.5 C25.6,6.5 26.8,8.2 26.8,10.2 C26.8,11.8 25.8,13.5 24,13.5 Z",
].join(" ");

function PawShape({ size, flip, opacity }: { size: number; flip: boolean; opacity: number }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 32 32"
      aria-hidden="true" focusable="false"
      style={{
        display: "block",
        transform: flip ? "scaleX(-1)" : undefined,
        filter: "drop-shadow(0 0 0.4px rgba(255,255,255,0.25))",
      }}
    >
      <path d={PAW_PATH} fill={`rgba(17,37,89,${opacity})`} />
    </svg>
  );
}

// ─── BONE ICONS (Gap 2) ───────────────────────────────────────────────────────
// Two small bones, staggered vertically, slightly rotated.
// Bone path drawn in 40×16 viewBox — classic dog bone silhouette.
// Knobs at each end, shaft in the middle.
const BONE_PATH =
  // Left knob (two bumps)
  "M4,5 C2,5 1,6.5 1,8 C1,9.5 2,11 4,11 C4.8,11 5.5,10.6 6,10 L6,6 C5.5,5.4 4.8,5 4,5 Z " +
  "M4,4 C1.8,4 0,5.8 0,8 C0,10.2 1.8,12 4,12 C5.2,12 6.3,11.5 7,10.6 L7,5.4 C6.3,4.5 5.2,4 4,4 Z " +
  // Shaft
  "M7,5.5 L33,5.5 L33,10.5 L7,10.5 Z " +
  // Right knob (two bumps)
  "M36,5 C35.2,5 34.5,5.4 34,6 L34,10 C34.5,10.6 35.2,11 36,11 C38,11 39,9.5 39,8 C39,6.5 38,5 36,5 Z " +
  "M36,4 C34.8,4 33.7,4.5 33,5.4 L33,10.6 C33.7,11.5 34.8,12 36,12 C38.2,12 40,10.2 40,8 C40,5.8 38.2,4 36,4 Z";

interface BoneDef {
  x: number; // % of navbar width
  y: number; // px from top
  width: number;
  rotate: number;
  opacity: number;
}

const BONES: BoneDef[] = [
  { x: 62.0, y: 20, width: 42, rotate: -8,  opacity: 0.18 },
  { x: 65.5, y: 44, width: 38, rotate:  6,  opacity: 0.16 },
];

function BoneShape({ width, rotate, opacity }: { width: number; rotate: number; opacity: number }) {
  const height = Math.round(width * 0.4);
  return (
    <svg
      width={width} height={height} viewBox="0 0 40 16"
      aria-hidden="true" focusable="false"
      style={{
        display: "block",
        transform: `rotate(${rotate}deg)`,
        filter: "drop-shadow(0 0 0.4px rgba(255,255,255,0.2))",
      }}
    >
      {/* Shaft */}
      <rect x="7" y="5.5" width="26" height="5" rx="2.5" fill={`rgba(17,37,89,${opacity})`} />
      {/* Left end — two rounded bumps */}
      <circle cx="5"  cy="5.5" r="3.2" fill={`rgba(17,37,89,${opacity})`} />
      <circle cx="5"  cy="10.5" r="3.2" fill={`rgba(17,37,89,${opacity})`} />
      {/* Right end — two rounded bumps */}
      <circle cx="35" cy="5.5" r="3.2" fill={`rgba(17,37,89,${opacity})`} />
      <circle cx="35" cy="10.5" r="3.2" fill={`rgba(17,37,89,${opacity})`} />
    </svg>
  );
}

// ─── HEARTBEAT LINE (Gap 3) ───────────────────────────────────────────────────
// A single faint ECG-style line sitting between the nav cluster and the CTA buttons.
// Drawn as an SVG path in a 64×24 viewBox.
// Represents life, care, and the heartbeat of rescued animals.
const HEARTBEAT_PATH = "M0,12 L10,12 L14,4 L18,20 L22,8 L26,16 L30,12 L64,12";

export default function NavbarFootprints() {
  return (
    <div className="paw-trail-container" aria-hidden="true" role="presentation">

      {/* ── Gap 1: Paw trail ── */}
      <svg
        className="paw-trail-line"
        viewBox="0 0 1280 72"
        preserveAspectRatio="none"
        width="100%" height="100%"
        aria-hidden="true" focusable="false"
      >
        <path
          d={TRAIL_PATH}
          fill="none"
          stroke="rgba(17,37,89,0.03)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="3 8"
        />
      </svg>

      {TRAIL.map((fp, i) => (
        <span
          key={`paw-${i}`}
          className="paw-print"
          style={{ left: `${fp.x}%`, top: `${fp.y}px`, transform: `rotate(${fp.rotate}deg)` }}
        >
          <PawShape size={fp.size} flip={fp.flip} opacity={fp.opacity} />
        </span>
      ))}

      {/* ── Gap 2: Bone icons ── */}
      {BONES.map((b, i) => (
        <span
          key={`bone-${i}`}
          className="nav-bone"
          style={{ left: `${b.x}%`, top: `${b.y}px` }}
        >
          <BoneShape width={b.width} rotate={b.rotate} opacity={b.opacity} />
        </span>
      ))}

      {/* ── Gap 3: Heartbeat line ── */}
      <span className="nav-heartbeat">
        <svg
          width="64" height="24" viewBox="0 0 64 24"
          aria-hidden="true" focusable="false"
          style={{ display: "block" }}
        >
          <path
            d={HEARTBEAT_PATH}
            fill="none"
            stroke="rgba(17,37,89,0.18)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

    </div>
  );
}
