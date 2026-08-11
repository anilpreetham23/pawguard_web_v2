"use client";

/** CircleBackdrop — background visualization only.
 *  Connection lines live in ConnectionLine.tsx (Phase 3).
 */

interface CircleBackdropProps {
  glow: string | null;
}

const PARTICLES = [
  { top: "18%", left: "30%", delay: "0s" },
  { top: "26%", left: "66%", delay: "0.9s" },
  { top: "42%", left: "22%", delay: "1.7s" },
  { top: "58%", left: "74%", delay: "0.4s" },
  { top: "70%", left: "34%", delay: "2.1s" },
  { top: "76%", left: "62%", delay: "1.3s" },
  { top: "38%", left: "52%", delay: "2.6s" },
  { top: "64%", left: "48%", delay: "0.2s" },
];

export function CircleBackdrop({ glow }: CircleBackdropProps) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {/* Soft radial glow that reacts to active service */}
      <div
        className="absolute inset-0 rounded-full transition-all duration-500"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${
            glow ?? "rgba(0,35,111,0.10)"
          } 0%, transparent 68%)`,
        }}
      />

      {/* Concentric guide rings */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <circle
          cx="50" cy="50" r="49.6"
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="0.5"
          className="animate-ring-pulse"
        />
        <circle
          cx="50" cy="50" r="41"
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="0.4"
          strokeOpacity="0.45"
        />
        <circle
          cx="50" cy="50" r="41"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="0.7"
          strokeLinecap="round"
          strokeDasharray="1.5 30"
          className="animate-services-ring-energy"
        />
        <circle
          cx="50" cy="50" r="32"
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="0.4"
          strokeOpacity="0.3"
        />
      </svg>

      {/* Ambient particles */}
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-primary/40"
          style={{
            top: p.top,
            left: p.left,
            animation: `ambient-pulse 3.6s ease-in-out ${p.delay} infinite, ambient-drift 5.5s ease-in-out ${p.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}
