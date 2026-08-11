"use client";

export function HeroLighting() {
  return (
    <div className="hero-light pointer-events-none absolute inset-0" aria-hidden="true">
      {/* Consolidated warm glow: sunrise + bloom + ambient tint merged into a
          SINGLE normal-composited layer. The previous mix-blend-screen /
          soft-light / overlay full-viewport stack was the hero's dominant
          compositing cost (~3-4x frame time on top of the video). A gentle
          opacity pulse keeps the scene feeling alive. */}
      <div
        className="absolute inset-0 animate-hero-glow"
        style={{
          background: [
            "radial-gradient(ellipse at 28% 18%, rgba(255,214,150,0.55) 0%, rgba(255,214,150,0) 55%)",
            "radial-gradient(58% 46% at 52% 44%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 72%)",
            "linear-gradient(160deg, rgba(255,180,100,0.18) 0%, rgba(0,35,111,0.12) 100%)",
          ].join(", "),
        }}
      />
      {/* Consolidated shading: cinematic vignette + bottom fade. Normal alpha
          compositing only — no blend modes. */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(125% 95% at 50% 50%, transparent 45%, rgba(0,0,0,0.5) 100%)",
            "linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.18) 32%, transparent 55%)",
          ].join(", "),
        }}
      />
    </div>
  );
}
