"use client";

import { useEffect, useRef } from "react";
import { useMotionStore } from "../../motion/motion-store";

/**
 * Pauses the hero's compositor-heavy ambient loops (full-screen video
 * transform + blend-mode gradients) *only while the user is actively
 * scrolling* AND the hero is in the viewport. Re-rasterizing those
 * full-viewport layers every scroll frame causes visible lag. Setting
 * `data-scroll-active` lets CSS freeze the transform/blend animations;
 * when scrolling stops the loops resume and the cinematic motion returns.
 *
 * The store is subscribed imperatively (not via a React hook selector) so
 * per-frame `scrollVelocity` changes never re-render the Hero. An
 * IntersectionObserver gate stops the attribute writes once the hero leaves
 * the viewport. DOM writes are batched via rAF to avoid layout thrash.
 */
export function useHeroScrollPause<T extends HTMLElement>(ref: React.RefObject<T | null>): void {
  const inViewRef = useRef(false);
  const lastActiveRef = useRef(false);
  const rafRef = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const applyPause = () => {
      const target = ref.current;
      if (!target) return;
      const active =
        inViewRef.current && useMotionStore.getState().scrollVelocity > 0.35;
      if (active === lastActiveRef.current) return;
      lastActiveRef.current = active;
      // Batch DOM write into next frame
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (active) {
          target.setAttribute("data-scroll-active", "true");
        } else {
          target.removeAttribute("data-scroll-active");
        }
      });
    };

    const obs = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
        if (!entry.isIntersecting) {
          lastActiveRef.current = false;
          cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(() => {
            ref.current?.removeAttribute("data-scroll-active");
          });
        } else {
          applyPause();
        }
      },
      { rootMargin: "0px" },
    );
    obs.observe(el);

    // Subscribe to state changes — applyPause already guards against redundant DOM writes.
    const unsubscribe = useMotionStore.subscribe(() => applyPause());
    applyPause();

    return () => {
      cancelAnimationFrame(rafRef.current);
      obs.disconnect();
      unsubscribe();
    };
  }, [ref]);
}
