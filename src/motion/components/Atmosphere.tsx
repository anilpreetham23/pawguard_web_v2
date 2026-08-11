"use client";

import { useMemo, type CSSProperties } from "react";
import { useMotionStore } from "../motion-store";
import { cn } from "../../app/components/ui/utils";
import "./atmosphere.css";

/**
 * Atmosphere — a living, breathing background.
 *
 * A restrained amount of slow light orbs and floating particles tinted by the
 * section's emotional palette (`var(--emotion-*)`). Everything animates on
 * pure transform/opacity so the compositor can offload it, and the existing
 * `[data-ambient="off"]` pause system freezes it whenever the section leaves
 * the viewport. Rendered statically (soft glow only) when motion is reduced
 * or the tier is not "full".
 */

type AtmosphereTint =
  | "hope"
  | "trust"
  | "urgency"
  | "compassion"
  | "reality"
  | "proof"
  | "guidance"
  | "transformation"
  | "joy"
  | "action"
  | "belonging"
  | "promise";

type Variant = "both" | "orbs" | "particles" | "grain";

interface OrbSpec {
  x: number;
  y: number;
  size: number;
  dur: number;
  delay: number;
  op: number;
  dx: number;
  dy: number;
  dy2: number;
}

interface ParticleSpec {
  x: number;
  y: number;
  size: number;
  dur: number;
  delay: number;
  op: number;
  px: number;
  py: number;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface AtmosphereProps {
  /** Emotional tint name — must match a `--emotion-*` token in theme.css. */
  tint?: AtmosphereTint;
  variant?: Variant;
  /** Light = 1 → dark = ~0.45 handled by CSS. 0–1 boost per section. */
  intensity?: number;
  orbCount?: number;
  particleCount?: number;
  className?: string;
}

export function Atmosphere({
  tint = "hope",
  variant = "both",
  intensity = 0.5,
  orbCount = 3,
  particleCount = 12,
  className,
}: AtmosphereProps) {
  const { motionTier, reducedMotion } = useMotionStore();
  const animate = motionTier === "full" && !reducedMotion;

  const showOrbs = variant === "both" || variant === "orbs";
  const showParticles = variant === "both" || variant === "particles";
  const showGrain = variant === "grain";

  const orbs = useMemo<OrbSpec[]>(() => {
    const rnd = mulberry32((tint.length * 131) ^ orbCount ^ 7);
    return Array.from({ length: orbCount }, () => ({
      x: 8 + rnd() * 84,
      y: 12 + rnd() * 72,
      size: 220 + rnd() * 260,
      dur: 14 + rnd() * 12,
      delay: -rnd() * 8,
      op: clamp(intensity * (0.5 + rnd() * 0.5), 0.12, 0.6),
      dx: (rnd() - 0.5) * 60,
      dy: (rnd() - 0.5) * 56,
      dy2: (rnd() - 0.5) * 60,
    }));
  }, [tint, orbCount, intensity]);

  const particles = useMemo<ParticleSpec[]>(() => {
    const rnd = mulberry32((tint.length * 613) ^ particleCount ^ 3);
    return Array.from({ length: particleCount }, () => ({
      x: 4 + rnd() * 92,
      y: 20 + rnd() * 70,
      size: 2 + rnd() * 3,
      dur: 11 + rnd() * 13,
      delay: -rnd() * 12,
      op: clamp(intensity * (0.3 + rnd() * 0.5), 0.08, 0.45),
      px: (rnd() - 0.5) * 40,
      py: -(30 + rnd() * 70),
    }));
  }, [tint, particleCount, intensity]);

  return (
    <div
      aria-hidden="true"
      className={cn("atmosphere pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={{ "--atmos-tint": `var(--emotion-${tint})` } as CSSProperties}
    >
      {showGrain && <div className={cn("atmosphere-grain", animate && "animate-atmos-grain")} />}

      {showOrbs &&
        orbs.map((o, i) => (
          <span
            key={`o${i}`}
            className="atmosphere-orb-wrap"
            style={{ left: `${o.x}%`, top: `${o.y}%`, width: o.size, height: o.size }}
          >
            <span
              className={cn("atmosphere-orb", animate && "animate-atmosphere-orb")}
              style={
                {
                  "--orb-op": o.op,
                  "--atmos-orb-dur": `${o.dur}s`,
                  "--atmos-orb-delay": `${o.delay}s`,
                  "--orb-dx": `${o.dx}px`,
                  "--orb-dy": `${o.dy}px`,
                  "--orb-dy2": `${o.dy2}px`,
                } as CSSProperties
              }
            />
          </span>
        ))}

      {showParticles &&
        particles.map((p, i) => (
          <span
            key={`p${i}`}
            className="atmosphere-particle-wrap"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          >
            <span
              className={cn("atmosphere-particle", animate && "animate-atmosphere-particle")}
              style={
                {
                  "--p-op": p.op,
                  "--atmos-p-dur": `${p.dur}s`,
                  "--atmos-p-delay": `${p.delay}s`,
                  "--p-x": `${p.px}px`,
                  "--p-y": `${p.py}px`,
                } as CSSProperties
              }
            />
          </span>
        ))}
    </div>
  );
}
