"use client";

import { useEffect, type ReactNode } from "react";
import { registerGsapPlugins } from "./gsap-register";
import { LenisProvider } from "./lenis-provider";
import { useMotionStore } from "./motion-store";
import { onReducedMotionChange } from "./motion.utils";

interface MotionProviderProps {
  children: ReactNode;
}

function MotionInit({ children }: { children: ReactNode }) {
  const setReducedMotion = useMotionStore((s) => s.setReducedMotion);
  const setReady = useMotionStore((s) => s.setReady);

  useEffect(() => {
    registerGsapPlugins();

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);

    const cleanup = onReducedMotionChange((matches) => {
      setReducedMotion(matches);
    });

    setReady(true);

    return cleanup;
  }, [setReducedMotion, setReady]);

  return <>{children}</>;
}

export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <MotionInit>
      <LenisProvider>
        {children}
      </LenisProvider>
    </MotionInit>
  );
}
