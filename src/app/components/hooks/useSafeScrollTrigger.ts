import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * useSafeScrollTrigger — guarantees GSAP ScrollTriggers fire at the correct
 * scroll positions when a lazy-loaded section mounts.
 *
 * Problem: sections inside a lazy route chunk create their ScrollTriggers the
 * moment the chunk mounts. At that instant the page layout is usually not yet
 * final (hero video dimensions, fonts, images, later siblings), so
 * ScrollTrigger caches start/end positions from a stale layout. Triggers then
 * fire immediately or never — content appears "all at once" and only a full
 * reload (which re-measures everything) shows the intended scroll animation.
 *
 * Fix: after mount, re-measure ScrollTrigger once the layout has settled so
 * every trigger in this component recalibrates against real positions.
 */
export function useSafeScrollTrigger(delayMs = 300) {
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    // First pass after mount + a delayed pass once lazy content has settled.
    refresh();
    timerRef.current = window.setTimeout(refresh, delayMs);

    const onFontsReady = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) {
      document.fonts.ready.then(onFontsReady).catch(() => {});
    }

    return () => {
      if (timerRef.current !== undefined) {
        window.clearTimeout(timerRef.current);
        timerRef.current = undefined;
      }
    };
  }, [delayMs]);
}
