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
      const target = (selector: string) => {
        const found = section.querySelectorAll(selector);
        return found.length > 0 ? found : null;
      };

      const scene = target(".hero-scene");
      const sun = target(".hero-light-sun");
      const rays = target(".hero-light-rays");
      const bloom = target(".hero-light-bloom");
      const eyebrow = target(".hero-eyebrow");
      const fullTypewriter = target(".hero-full-typewriter");
      const typewriter = target(".hero-typewriter");
      const decorations = target(".hero-decorations > *");
      const trustBadges = target(".hero-trust-badges > *");
      const scroll = target(".hero-scroll");

      // ── Main Entrance Timeline: Emotional Choreography ──
      const mainTl = gsap.timeline({ defaults: { ease: ease.gentle } });

      if (scene) mainTl.from(scene, { opacity: 0, duration: 0.7, ease: ease.emerge, immediateRender: true }, 0.0);
      if (sun) mainTl.from(sun, { opacity: 0, scale: 0.9, duration: 0.6, ease: ease.emerge, immediateRender: true }, 0.1);
      if (rays) mainTl.from(rays, { opacity: 0, y: 20, duration: 0.7, ease: ease.gentle, immediateRender: true }, 0.2);
      if (bloom) mainTl.from(bloom, { opacity: 0, scale: 0.95, duration: 0.5, ease: ease.emerge, immediateRender: true }, 0.3);
      if (eyebrow) mainTl.from(eyebrow, { opacity: 0, y: 12, duration: 0.55, immediateRender: true }, 0.4);
      if (fullTypewriter) mainTl.from(fullTypewriter, { opacity: 0, y: 22, duration: 0.8, immediateRender: true }, 0.55);
      if (typewriter) mainTl.from(typewriter, { opacity: 0, y: 12, duration: 0.45, immediateRender: true }, 1.3);
      if (decorations) mainTl.from(decorations, { opacity: 0, duration: 0.7, stagger: 0.07, ease: ease.gentle, immediateRender: true }, 1.45);
      if (trustBadges) mainTl.from(trustBadges, { opacity: 0, y: 10, scale: 0.95, duration: 0.35, stagger: 0.06, immediateRender: true }, 1.65);
      if (scroll) mainTl.from(scroll, { opacity: 0, y: 12, duration: 0.45, immediateRender: true }, 1.95);

      // ── Scroll Exit Timeline (scrubbed) ──
      const lighting = target(".hero-cinematic-lighting");
      const particles = target(".hero-atmosphere-particles");
      const sceneExit = target(".hero-scene-exit");
      const content = target(".hero-content");
      const cursorLight = target(".hero-cursor-light");
      const decs = target(".hero-decorations");

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      });

      if (lighting) scrollTl.to(lighting, { opacity: 0, duration: 0.35 }, 0.2);
      if (particles) scrollTl.to(particles, { opacity: 0, duration: 0.3 }, 0.15);
      if (bloom) scrollTl.to(bloom, { opacity: 0, duration: 0.35 }, 0.25);
      if (decs) scrollTl.to(decs, { opacity: 0, duration: 0.3 }, 0.15);
      if (sceneExit) scrollTl.to(sceneExit, { opacity: 0.55, duration: 0.45 }, 0.3);
      if (content) scrollTl.to(content, { opacity: 0, y: -36, duration: 0.4 }, 0.5);
      if (cursorLight) scrollTl.to(cursorLight, { opacity: 0, duration: 0.25 }, 0.35);
      if (scroll) scrollTl.to(scroll, { opacity: 0, duration: 0.2 }, 0);
    }, section);

    return () => ctx.revert();
  }, [sectionRef, enabled, ready]);
}