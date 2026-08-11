"use client";

import { useEffect, useRef, useState } from "react";
import { PawPrint } from "lucide-react";
import { useMotionStore } from "../../../motion/motion-store";

export function HeroScrollIndicator({ className }: { className?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const scrolledRef = useRef(false);

  useEffect(() => {
    const update = (s: { scrollY: number }) => {
      const next = s.scrollY > 0;
      if (next !== scrolledRef.current) {
        scrolledRef.current = next;
        setScrolled(next);
      }
    };
    update(useMotionStore.getState());
    return useMotionStore.subscribe(update);
  }, []);

  return (
    <div className={className} aria-hidden="true">
      <span
        className={`flex flex-col items-center gap-2 transition-all duration-scroll ease-gentle ${
          scrolled ? "-translate-y-2 opacity-0" : "opacity-100"
        }`}
      >
        <span className="font-condensed text-2xs font-semibold uppercase tracking-[0.2em] text-white/70">
          Scroll
        </span>
        <span className="relative flex h-11 w-6 items-start justify-center overflow-hidden rounded-full border border-white/30 p-1">
          <span className="relative flex flex-col items-center">
            <PawPrint size={12} className="text-amber-200/80 animate-paw-scroll" />
            <span
              className="absolute top-2.5 h-1 w-1 rounded-full bg-amber-200/70 animate-paw-trail"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="absolute top-2.5 h-1 w-1 rounded-full bg-amber-200/40 animate-paw-trail"
              style={{ animationDelay: "240ms" }}
            />
          </span>
        </span>
      </span>
    </div>
  );
}
