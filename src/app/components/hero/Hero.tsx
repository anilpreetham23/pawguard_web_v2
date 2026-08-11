"use client";

import { useRef, useCallback, useMemo } from "react";
import { useMotionValue, useTransform } from "motion/react";
import { HeroContent } from "./HeroContent";
import { HeroScene } from "./HeroScene";
import { HeroScrollIndicator } from "./HeroScrollIndicator";
import { HeroDecorations } from "./HeroDecorations";
import { Atmosphere } from "../../../motion/components/Atmosphere";
import { HeroCursorLight } from "./HeroCursorLight";
import { useHeroTimeline } from "./hooks/useHeroTimeline";
import { useAmbientPause } from "../../hooks/useAmbientPause";
import { useHeroScrollPause } from "../../hooks/useHeroScrollPause";
import { useMotionStore } from "../../../motion/motion-store";
import { TILT } from "./data/heroData";
import { HeroParallaxProvider } from "./HeroParallaxContext";

/**
 * Cinematic Hero — Phase 1.3 Cinematic Environment System.
 *
 * The Hero is composed as a living documentary scene with:
 *   1. Video base layer
 *   2. Cinematic Lighting (sun, bounce, volumetric, bloom, sweep, vignette, color grade)
 *   3. Atmosphere Particles (dust, fur, feathers, pollen)
 *   4. Cursor Light (flashlight effect)
 *   5. 5-Layer Depth System (video→lighting→decorations→typography→CTAs)
 *   6. Editorial Foreground (headline, narration, live feed, trust, CTAs)
 *   7. Scroll Invitation
 *
 * Independent visual layers with different parallax responses:
 *   - Backdrop:       video + lighting + particles (z-0 to z-20)
 *   - Decorations:    custom SVG illustrations (z-25)
 *   - Cursor Light:   follows mouse, illuminates scene (z-30)
 *   - Foreground:     editorial content (z-40)
 *   - Scroll Hint:    paw-print indicator (z-50)
 */

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const enabled = useMotionStore((s) => s.motionTier) === "full";

  useHeroTimeline(sectionRef, enabled);
  useAmbientPause(sectionRef);
  useHeroScrollPause(sectionRef);

  // ── Cursor Parallax (using TILT multipliers) ──────────────────────────────
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  // Create parallax values for each layer — top-level hooks (not inside useMemo/map)
  // This avoids Rules-of-Hooks violations and ensures stable hook count across renders
  const videoX = useTransform(mouseX, (v) => (v - 50) * TILT.multipliers.video);
  const videoY = useTransform(mouseY, (v) => (v - 50) * TILT.multipliers.video);
  const lightingX = useTransform(mouseX, (v) => (v - 50) * TILT.multipliers.bloom);
  const lightingY = useTransform(mouseY, (v) => (v - 50) * TILT.multipliers.bloom);
  const decorationsX = useTransform(mouseX, (v) => (v - 50) * TILT.multipliers.decorations);
  const decorationsY = useTransform(mouseY, (v) => (v - 50) * TILT.multipliers.decorations);
  const typographyX = useTransform(mouseX, (v) => (v - 50) * TILT.multipliers.hud * 0.1);
  const typographyY = useTransform(mouseY, (v) => (v - 50) * TILT.multipliers.hud * 0.1);
  const ctasX = useTransform(mouseX, (v) => (v - 50) * TILT.multipliers.stats * 0.15);
  const ctasY = useTransform(mouseY, (v) => (v - 50) * TILT.multipliers.stats * 0.15);

  const layerValues = useMemo(() => [
    { id: "video", multiplier: TILT.multipliers.video, x: videoX, y: videoY },
    { id: "lighting", multiplier: TILT.multipliers.bloom, x: lightingX, y: lightingY },
    { id: "decorations", multiplier: TILT.multipliers.decorations, x: decorationsX, y: decorationsY },
    { id: "typography", multiplier: TILT.multipliers.hud * 0.1, x: typographyX, y: typographyY },
    { id: "ctas", multiplier: TILT.multipliers.stats * 0.15, x: ctasX, y: ctasY },
  ], [videoX, videoY, lightingX, lightingY, decorationsX, decorationsY, typographyX, typographyY, ctasX, ctasY]);

  const rafRef = useRef(0);
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        const rect = e.currentTarget.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width;
        const ny = (e.clientY - rect.top) / rect.height;
        mouseX.set(nx * 100);
        mouseY.set(ny * 100);
      });
    },
    [],
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Hero"
      className="hero-section bg-background relative z-0 overflow-hidden"
      style={{
        paddingTop: "var(--header-height)",
      }}
      onMouseMove={handleMouseMove}
    >
      {/* ── Layer 0-20: Cinematic Backdrop (Video + Lighting + Particles) ── */}
      <HeroScene className="hero-scene absolute z-0 top-[var(--header-height)] left-0 right-0 bottom-0" />

      {/* ── Layer 10: Living Atmosphere (orbs + particles) ── */}
      <Atmosphere
        tint="hope"
        variant="both"
        intensity={0.35}
        orbCount={2}
        particleCount={8}
        className="z-10"
      />

      {/* ── Layer 25: Illustrations (SVG Decorations) ── */}
      <HeroParallaxProvider
        layerValues={layerValues}
        mouseX={mouseX}
        mouseY={mouseY}
      >
        <HeroDecorations className="hero-decorations z-25" />
      </HeroParallaxProvider>

      {/* ── Layer 30: Cursor Light (flashlight effect) ── */}
      <HeroCursorLight
        radius={480}
        opacity={0.3}
        color="rgba(255,200,130,0.35)"
        className="z-30"
      />

      {/* ── Layer 40: Editorial Foreground ── */}
      <div
        className="relative z-40 mx-auto flex min-h-[calc(100svh-var(--header-height))] max-w-[1280px] flex-col justify-center px-6 pb-section-lg lg:pb-section-xl pt-[clamp(72px,8vw+10px,116px)] lg:px-8"
      >
        <div className="hero-content max-w-3xl flex flex-col">
          <HeroContent />
        </div>
      </div>

      {/* ── Layer 50: Scroll Invitation ── */}
      <HeroScrollIndicator className="hero-scroll absolute bottom-6 left-1/2 z-50 -translate-x-1/2" />
    </section>
  );
}