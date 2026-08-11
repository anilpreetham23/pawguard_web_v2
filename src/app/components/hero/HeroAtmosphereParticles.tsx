"use client";

import { useMemo, useEffect, useRef } from "react";
import { useMotionStore } from "../../../motion/motion-store";
import { cn } from "../../../app/components/ui/utils";

/**
 * HeroAtmosphereParticles — living atmospheric particles.
 *
 * Types:
 *   - Dust motes      — slow rising, gentle sway
 *   - Fur strands     — tiny floating fibers
 *   - Feathers        — rare, slow drifting down
 *   - Pollen          — tiny golden specks
 *
 * All particles:
 *   - Transform/opacity only (GPU)
 *   - Deterministic positions via mulberry32
 *   - Pause via [data-ambient="off"] and [data-scroll-active="true"]
 *   - Respect reduced motion
 */

interface ParticleSpec {
  x: number;
  y: number;
  size: number;
  dur: number;
  delay: number;
  op: number;
  px: number;
  py: number;
  rot: number;
  type: "dust" | "fur" | "feather" | "pollen";
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

export interface HeroAtmosphereParticlesProps {
  /** Emotional tint — matches --emotion-* tokens */
  tint?: "hope" | "trust" | "urgency" | "compassion" | "reality" | "proof" | "guidance" | "transformation" | "joy" | "action" | "belonging" | "promise";
  /** Number of dust motes */
  dustCount?: number;
  /** Number of fur strands */
  furCount?: number;
  /** Number of feathers */
  featherCount?: number;
  /** Number of pollen specks */
  pollenCount?: number;
  /** Global intensity 0-1 */
  intensity?: number;
  /** Optional className */
  className?: string;
}

export function HeroAtmosphereParticles({
  tint = "hope",
  dustCount = 18,
  furCount = 8,
  featherCount = 3,
  pollenCount = 12,
  intensity = 0.5,
  className,
}: HeroAtmosphereParticlesProps) {
  const { motionTier, reducedMotion } = useMotionStore();
  const animate = motionTier === "full" && !reducedMotion;

  const particles = useMemo<ParticleSpec[]>(() => {
    const rnd = mulberry32((tint.length * 911) ^ 7);
    const specs: ParticleSpec[] = [];

    // Dust motes — slow rising, gentle sway
    for (let i = 0; i < dustCount; i++) {
      specs.push({
        x: 2 + rnd() * 96,
        y: 10 + rnd() * 80,
        size: 1.5 + rnd() * 2.5,
        dur: 22 + rnd() * 28,
        delay: -rnd() * 20,
        op: clamp(intensity * (0.25 + rnd() * 0.35), 0.04, 0.25),
        px: (rnd() - 0.5) * 60,
        py: -(20 + rnd() * 100),
        rot: 0,
        type: "dust",
      });
    }

    // Fur strands — tiny fibers, slower
    for (let i = 0; i < furCount; i++) {
      specs.push({
        x: 5 + rnd() * 90,
        y: 15 + rnd() * 70,
        size: 1 + rnd() * 2,
        dur: 35 + rnd() * 40,
        delay: -rnd() * 30,
        op: clamp(intensity * (0.15 + rnd() * 0.25), 0.03, 0.18),
        px: (rnd() - 0.5) * 30,
        py: -(15 + rnd() * 80),
        rot: (rnd() - 0.5) * 30,
        type: "fur",
      });
    }

    // Feathers — rare, drifting down with rotation
    for (let i = 0; i < featherCount; i++) {
      specs.push({
        x: 10 + rnd() * 80,
        y: -10 - rnd() * 20, // start above viewport
        size: 6 + rnd() * 10,
        dur: 50 + rnd() * 60,
        delay: -rnd() * 40,
        op: clamp(intensity * (0.12 + rnd() * 0.18), 0.04, 0.15),
        px: (rnd() - 0.5) * 80,
        py: 120 + rnd() * 180, // drift down through viewport
        rot: (rnd() - 0.5) * 30,
        type: "feather",
      });
    }

    // Pollen — golden specks in light beams
    for (let i = 0; i < pollenCount; i++) {
      specs.push({
        x: 8 + rnd() * 84,
        y: 20 + rnd() * 60,
        size: 1 + rnd() * 1.5,
        dur: 14 + rnd() * 18,
        delay: -rnd() * 15,
        op: clamp(intensity * (0.3 + rnd() * 0.4), 0.08, 0.35),
        px: (rnd() - 0.5) * 40,
        py: -(30 + rnd() * 80),
        rot: 0,
        type: "pollen",
      });
    }

    return specs;
  }, [tint, dustCount, furCount, featherCount, pollenCount, intensity]);

  // Pause when off-screen
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        el.dataset.ambient = entry.isIntersecting ? "on" : "off";
      },
      { rootMargin: "100px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "hero-atmosphere-particles pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      aria-hidden="true"
      style={{ "--atmos-tint": `var(--emotion-${tint})` } as React.CSSProperties}
    >
      {particles.map((p, i) => (
        <span
          key={`p-${p.type}-${i}`}
          className={cn(
            "absolute",
            animate && "animate-atmosphere-particle",
            p.type === "feather" && "animate-atmosphere-feather",
          )}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            "--p-op": p.op,
            "--atmos-p-dur": `${p.dur}s`,
            "--atmos-p-delay": `${p.delay}s`,
            "--p-x": `${p.px}px`,
            "--p-y": `${p.py}px`,
            "--particle-type": p.type,
          } as React.CSSProperties}
        >
          {p.type === "feather" && (
            <span
              className="feather-shape"
              style={{ "--feather-rot": `${p.rot}deg` } as React.CSSProperties}
            />
          )}
          {p.type === "fur" && <span className="fur-strand" />}
        </span>
      ))}
    </div>
  );
}