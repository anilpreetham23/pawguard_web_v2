"use client";

import { useEffect, useRef } from "react";

/**
 * Toggles `data-ambient="on" | "off"` on the container so CSS ambient
 * loops (breathing, zoom, drift) can be paused while off-screen.
 * Animations resume automatically when the container re-enters.
 */
export function useAmbientPause<T extends HTMLElement = HTMLElement>(
  externalRef?: React.RefObject<T | null>,
) {
  const ownRef = useRef<T | null>(null);
  const ref = externalRef ?? ownRef;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.dataset.ambient = "on";
    const io = new IntersectionObserver(
      ([entry]) => {
        el.dataset.ambient = entry.isIntersecting ? "on" : "off";
      },
      { rootMargin: "240px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  return ref;
}

