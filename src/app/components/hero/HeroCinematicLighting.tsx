"use client";

import { useMemo } from "react";
import { useMotionStore } from "../../../motion/motion-store";
import { cn } from "../../../app/components/ui/utils";

/**
 * HeroCinematicLighting — essential cinematic lighting stack.
 *
 * Layers (bottom → top):
 *   1. Directional Sun          — warm key light, slow drift
 *   2. Volumetric Rays          — god rays through atmosphere
 *   3. Dynamic Vignette         — breathes with the scene
 *   4. Cinematic Color Grade    — unified warm LUT overlay
 *
 * All layers use transform/opacity only (GPU compositor).
 * Paused via [data-ambient="off"] and [data-scroll-active="true"].
 */

export interface HeroCinematicLightingProps {
  /** Tint for the emotional palette (matches --emotion-* tokens) */
  tint?: "hope" | "trust" | "urgency" | "compassion" | "reality" | "proof" | "guidance" | "transformation" | "joy" | "action" | "belonging" | "promise";
  /** Intensity 0-1 */
  intensity?: number;
  /** Optional className */
  className?: string;
}

export function HeroCinematicLighting({
  tint = "hope",
  intensity = 0.5,
  className,
}: HeroCinematicLightingProps) {
  const { motionTier, reducedMotion } = useMotionStore();
  const animate = motionTier === "full" && !reducedMotion;

  // Warm color palette for the hero (hope tint)
  const warmIvory = "rgba(255,246,239,0.18)";
  const gold = "rgba(240,165,0,0.22)";
  const amber = "rgba(255,196,120,0.28)";
  const earthBrown = "rgba(108,88,68,0.15)";
  const forestGreen = "rgba(76,94,73,0.10)";
  const softOrange = "rgba(255,165,0,0.18)";

  // Light animations
  const sunClass = animate ? "animate-hero-sun" : "";
  const vignetteClass = animate ? "animate-hero-vignette" : "";
  const atmosphereClass = animate ? "animate-hero-atmosphere" : "";

  // Directional Sun — the key light source
  const DirectionalSun = useMemo(() => (
    <div
      className={cn(
        "pointer-events-none absolute -inset-8 z-0 will-change-transform hero-light-sun",
        sunClass,
        className,
      )}
      aria-hidden="true"
      style={{
        background: [
          `radial-gradient(ellipse at 28% 18%, ${amber} 0%, ${gold} 35%, transparent 65%)`,
          `radial-gradient(ellipse at 72% 82%, ${warmIvory} 0%, transparent 55%)`,
          `radial-gradient(ellipse at 30% 20%, ${softOrange} 0%, transparent 70%)`,
        ].join(", "),
      }}
    />
  ), []);

  // Volumetric Rays — god rays through atmosphere
  const VolumetricRays = useMemo(() => (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-10 will-change-transform hero-light-rays",
        atmosphereClass,
      )}
      aria-hidden="true"
      style={{
        background: [
          `linear-gradient(135deg, transparent 40%, ${amber} 41%, ${amber} 43%, transparent 44%)`,
          `linear-gradient(145deg, transparent 30%, ${gold} 31%, ${gold} 33%, transparent 34%)`,
          `linear-gradient(125deg, transparent 50%, ${warmIvory} 51%, ${warmIvory} 52%, transparent 53%)`,
          `linear-gradient(155deg, transparent 60%, ${softOrange} 61%, ${softOrange} 62%, transparent 63%)`,
        ].join(", "),
        opacity: intensity * 0.35,
      }}
    />
  ), [intensity]);

  // Dynamic Vignette — breathes with the scene
  const DynamicVignette = useMemo(() => (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-30 hero-light-vignette",
        vignetteClass,
      )}
      aria-hidden="true"
      style={{
        background: [
          `radial-gradient(ellipse at 50% 50%, transparent 40%, ${earthBrown} 100%)`,
          `linear-gradient(to top, ${earthBrown} 0%, rgba(10,13,26,0.4) 35%, transparent 60%)`,
        ].join(", "),
      }}
    />
  ), []);

  // Cinematic Color Grade — unified warm LUT overlay
  const ColorGrade = useMemo(() => (
    <div
      className="pointer-events-none absolute inset-0 z-35 hero-light-grade"
      aria-hidden="true"
      style={{
        background: [
          `linear-gradient(180deg, ${earthBrown} 0%, transparent 20%, transparent 80%, ${forestGreen} 100%)`,
        ].join(", "),
        opacity: intensity * 0.12,
      }}
    />
  ), [intensity]);

  return (
    <div
      className={cn("hero-cinematic-lighting pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      {/* Layer 0: Directional Sun (key light) */}
      {DirectionalSun}

      {/* Layer 1: Volumetric Rays (god rays) */}
      {VolumetricRays}

      {/* Layer 2: Dynamic Vignette */}
      {DynamicVignette}

      {/* Layer 3: Cinematic Color Grade */}
      {ColorGrade}
    </div>
  );
}