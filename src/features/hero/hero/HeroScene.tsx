"use client";

import { HeroVideo } from "./HeroVideo";
import { HeroCinematicLighting } from "./HeroCinematicLighting";
import { HeroAtmosphereParticles } from "./HeroAtmosphereParticles";

/**
 * Cinematic full-bleed backdrop layer — Phase 1.3.
 *
 * Composition (z-order):
 *   z-0:   Video (base)
 *   z-5:   Cinematic Lighting (sun, bounce, volumetric, bloom, sweep, vignette, color grade)
 *   z-15:  Atmosphere Particles (dust, fur, feathers, pollen)
 *   z-20:  Film Grain
 *   z-30:  Cinematic Scrim (text legibility)
 *   z-30:  Grounding Shadow
 */
export function HeroScene({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      {/* ── Full-bleed Video ── */}
      <div className="hero-scene-exit absolute inset-0 z-0">
        <HeroVideo />

        {/* ── Cinematic Lighting Stack ── */}
        <HeroCinematicLighting
          tint="hope"
          intensity={0.55}
          className="z-5"
        />

        {/* ── Atmospheric Particles (dust, fur, feathers, pollen) ── */}
        <HeroAtmosphereParticles
          tint="hope"
          dustCount={20}
          furCount={10}
          featherCount={4}
          pollenCount={14}
          intensity={0.45}
          className="z-15"
        />

        {/* ── Film grain overlay ── */}
        <div className="noise-overlay absolute inset-0 z-20 opacity-[0.04]" />

        {/* ── Collective cinematic scrim for text legibility ── */}
        <div
          className="pointer-events-none absolute inset-0 z-30"
          style={{
            background:
              "linear-gradient(100deg, rgba(10,13,26,0.82) 0%, rgba(10,13,26,0.62) 34%, rgba(10,13,26,0.28) 62%, rgba(10,13,26,0.55) 100%)",
          }}
        />
        {/* Grounding shadow along the bottom edge */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-32"
          style={{
            background:
              "linear-gradient(to top, rgba(7,9,18,0.7) 0%, transparent 100%)",
          }}
        />
      </div>
    </div>
  );
}