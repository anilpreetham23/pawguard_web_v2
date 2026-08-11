import { useEffect } from "react";
import { gsap } from "gsap";
import { ease as motionEase } from "../../../../motion/motion.config";
const ease = motionEase as any;
import { registerGsapPlugins } from "../../../../motion/gsap-register";
import { useMotionStore } from "../../../../motion/motion-store";

registerGsapPlugins();

/**
 * Phase 1.3 — Hero Cinematic Environment System: Emotional Timing Choreography
 *
 * Every layer enters on its own beat — no two unrelated elements animate
 * at the same instant. The timeline follows the emotional arc:
 *
 *   0.00s  ── Video base (already running, just fade in)
 *   0.10s  ── Directional sun + lighting bloom
 *   0.20s  ── Volumetric rays breathe in
 *   0.30s  ── Atmospheric bloom swells
 *   0.40s  ── Eyebrow kicker
 *   0.55s  ── Typed editorial narrative (headline + deck + support) fades in
 *   1.30s  ── Live rescue feed begins typing
 *   1.45s  ── Decorations assemble one by one
 *   1.65s  ── Trust indicators
 *   1.95s  ── Scroll invitation
 *
 * Total entrance: ~2.2s — the scene feels alive within 2 seconds.
 */
export function useHeroTimeline(
  sectionRef: React.RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const ready = useMotionStore((s) => s.ready);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (!enabled || !ready) return;

    const ctx = gsap.context(() => {
      // ── Main Entrance Timeline: Emotional Choreography ──
      gsap
        .timeline({ defaults: { ease: ease.gentle } })
        // 0.00 ── Video base layer fades in (the film is already running)
        .from(
          ".hero-scene",
          { opacity: 0, duration: 0.7, ease: ease.emerge, immediateRender: true },
          0.0,
        )
        // 0.10 ── Directional sun key light
        .from(
          ".hero-light-sun",
          { opacity: 0, scale: 0.9, duration: 0.6, ease: ease.emerge, immediateRender: true },
          0.1,
        )
        // 0.20 ── Volumetric rays (god rays) breathe in
        .from(
          ".hero-light-rays",
          { opacity: 0, y: 20, duration: 0.7, ease: ease.gentle, immediateRender: true },
          0.2,
        )
        // 0.30 ── Atmospheric bloom swells
        .from(
          ".hero-light-bloom",
          { opacity: 0, scale: 0.95, duration: 0.5, ease: ease.emerge, immediateRender: true },
          0.3,
        )
        // 0.40 ── Eyebrow kicker
        .from(
          ".hero-eyebrow",
          { opacity: 0, y: 12, duration: 0.55, immediateRender: true },
          0.4,
        )
        // 0.55 ── Typed editorial narrative fades in as one living block;
        //           the typewriter itself drives the internal line-by-line loop
        .from(
          ".hero-full-typewriter",
          { opacity: 0, y: 22, duration: 0.8, immediateRender: true },
          0.55,
        )
        // 1.30 ── Live rescue feed begins typing
        .from(".hero-typewriter", { opacity: 0, y: 12, duration: 0.45, immediateRender: true }, 1.3)
        // 1.45 ── Decorations assemble one by one — environment comes alive
        .from(
          ".hero-decorations > *",
          { opacity: 0, duration: 0.7, stagger: 0.07, ease: ease.gentle, immediateRender: true },
          1.45,
        )
        // 1.65 ── Trust indicators (quiet credibility)
        .from(
          ".hero-trust-badges > *",
          { opacity: 0, y: 10, scale: 0.95, duration: 0.35, stagger: 0.06, immediateRender: true },
          1.65,
        )
        // 1.95 ── Scroll invitation appears last
        .from(
          ".hero-scroll",
          { opacity: 0, y: 12, duration: 0.45, immediateRender: true },
          1.95,
        );

      // ── Scroll Exit Timeline (scrubbed) ──
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        })
        .to(".hero-cinematic-lighting", { opacity: 0, duration: 0.35 }, 0.2)
        .to(".hero-atmosphere-particles", { opacity: 0, duration: 0.3 }, 0.15)
        .to(".hero-light-bloom", { opacity: 0, duration: 0.35 }, 0.25)
        .to(".hero-decorations", { opacity: 0, duration: 0.3 }, 0.15)
        .to(
          ".hero-scene-exit",
          { opacity: 0.55, duration: 0.45 },
          0.3,
        )
        .to(".hero-content", { opacity: 0, y: -36, duration: 0.4 }, 0.5)
        .to(".hero-cursor-light", { opacity: 0, duration: 0.25 }, 0.35)
        .to(".hero-scroll", { opacity: 0, duration: 0.2 }, 0);
    }, section);

    return () => ctx.revert();
  }, [sectionRef, enabled, ready]);
}