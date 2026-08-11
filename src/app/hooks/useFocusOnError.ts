"use client";

import { useEffect, useRef } from "react";
import { scrollTo } from "../../motion/scroll";

export function useFocusOnError(errors: Record<string, string>) {
  const refs = useRef<Record<string, HTMLElement | null>>({});

  const setRef = (key: string) => (el: HTMLElement | null) => {
    refs.current[key] = el;
  };

  useEffect(() => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0) {
      const firstKey = errorKeys[0];
      const el = refs.current[firstKey];
      if (el && "focus" in el) {
        el.focus({ preventScroll: true });
        scrollTo(el, { block: "center" });
      }
    }
  }, [errors]);

  return { setRef };
}
