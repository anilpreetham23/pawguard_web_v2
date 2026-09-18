import { useEffect } from "react";
import { ease as motionEase } from "@/motion/motion.config";
const ease = motionEase as any;
import { useMotionStore } from "@/motion/motion-store";

/**
 * Phase 1.3 — Hero Cinematic Environment System: Emotional Timing Choreography
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

    let ctx: any = null;

    import("@/motion/gsap-register")
      .then(({ getGsap }) => getGsap())
      .then(({ gsap }) => {
      ctx = gsap.context(() => {
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
        if (sun) mainTl.from(sun, { opacity: 0, scale: 0.9, duration: 0.9, ease: ease.emerge }, 0.1);
        if (rays) mainTl.from(rays, { opacity: 0, scaleY: 0.95, duration: 1.0, ease: ease.emerge }, 0.2);
        if (bloom) mainTl.from(bloom, { opacity: 0, scale: 0.95, duration: 0.8 }, 0.3);
        if (eyebrow) mainTl.from(eyebrow, { opacity: 0, y: 12, duration: 0.4, ease: ease.responsive }, 0.4);
        if (fullTypewriter) mainTl.from(fullTypewriter, { opacity: 0, y: 14, duration: 0.5, ease: ease.responsive }, 0.55);
        if (typewriter) mainTl.from(typewriter, { opacity: 0, y: 12, duration: 0.4 }, 1.3);

        if (decorations) {
          mainTl.from(
            decorations,
            { opacity: 0, y: 14, scale: 0.96, duration: 0.45, stagger: 0.1, ease: ease.gentle },
            1.45
          );
        }

        if (trustBadges) {
          mainTl.from(
            trustBadges,
            { opacity: 0, y: 10, duration: 0.4, stagger: 0.08, ease: ease.responsive },
            1.65
          );
        }

        if (scroll) mainTl.from(scroll, { opacity: 0, y: -6, duration: 0.5, ease: ease.gentle }, 1.95);
      }, section);
    }).catch(() => {});

    return () => {
      if (ctx?.revert) ctx.revert();
    };
  }, [sectionRef, enabled, ready]);
}