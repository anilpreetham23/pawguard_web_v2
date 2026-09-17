"use client";

import { useRef, type ReactNode } from "react";
import { useMotionStore } from "../motion-store";
import { getGsap } from "../gsap-register";

interface MagneticWrapperProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

export function MagneticWrapper({ children, strength = 0.3, className }: MagneticWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const tier = useMotionStore((s) => s.motionTier);
  const isReduced = tier === "reduced" || tier === "none";

  if (isReduced) {
    return <div className={className}>{children}</div>;
  }

  function onMouseMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;

    getGsap().then(({ gsap }) => {
      gsap.to(el, { x, y, duration: 0.4, ease: "power2.out" });
    }).catch(() => {});
  }

  function onMouseLeave() {
    const el = ref.current;
    if (!el) return;

    getGsap().then(({ gsap }) => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
    }).catch(() => {});
  }

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ willChange: "transform" }}
    >
      {children}
    </div>
  );
}
