import { useEffect, useRef } from "react";

/**
 * useSafeScrollTrigger — guarantees GSAP ScrollTriggers fire at the correct
 * scroll positions when a lazy-loaded section mounts.
 */
export function useSafeScrollTrigger(delayMs = 300) {
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const refresh = () => {
      if (typeof window !== "undefined") {
        const st = (window as any).ScrollTrigger || (window as any).gsap?.ScrollTrigger;
        if (st?.refresh) {
          st.refresh();
        }
      }
    };

    refresh();
    timerRef.current = window.setTimeout(refresh, delayMs);

    if (document.fonts?.ready) {
      document.fonts.ready.then(refresh).catch(() => {});
    }

    return () => {
      if (timerRef.current !== undefined) {
        window.clearTimeout(timerRef.current);
        timerRef.current = undefined;
      }
    };
  }, [delayMs]);
}
