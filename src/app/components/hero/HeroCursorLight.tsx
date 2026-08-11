"use client";

import {
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useState,
} from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useMotionStore } from "../../../motion/motion-store";
import { cn } from "../../../app/components/ui/utils";

/**
 * HeroCursorLight — a cinematic cursor light that illuminates the hero.
 *
 * The cursor becomes an invisible flashlight:
 *   - Radial glow follows cursor (warm amber)
 *   - Specular sweep on first interaction
 *   - Light direction affects button/headline shadows
 *   - Respects reduced motion + mobile
 *
 * Outputs MotionValues for downstream consumers:
 *   - mouseX, mouseY (0-100%)
 *   - cursorX, cursorY (screen pixels)
 *   - lightX, lightY (percentage for CSS gradients)
 */

export interface HeroCursorLightProps {
  /** Radius of the cursor light in pixels */
  radius?: number;
  /** Base opacity of the light */
  opacity?: number;
  /** Color of the light (CSS color) */
  color?: string;
  /** Optional className */
  className?: string;
}

export function HeroCursorLight({
  radius = 420,
  opacity = 0.35,
  color = "rgba(255,200,130,0.35)",
  className,
}: HeroCursorLightProps) {
  const tier = useMotionStore((s) => s.motionTier);
  const isReduced = tier === "reduced" || tier === "none";
  const isMobile =
    typeof window !== "undefined" && window.matchMedia("(pointer:coarse)").matches;

  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const [hovered, setHovered] = useState(false);

  // Spring-smoothed light position (GPU-friendly)
  const lightX = useSpring(mouseX, { stiffness: 60, damping: 18, mass: 0.6 });
  const lightY = useSpring(mouseY, { stiffness: 60, damping: 18, mass: 0.6 });

  // Light position as CSS percentages for radial-gradient
  const lightXPct = useTransform(lightX, (v) => `${v}%`);
  const lightYPct = useTransform(lightY, (v) => `${v}%`);

  // Specular sweep trigger
  const sweepKey = useRef(0);
  const [sweepActive, setSweepActive] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    if (!isReduced) {
      sweepKey.current += 1;
      setSweepActive(true);
      setTimeout(() => setSweepActive(false), 900);
    }
  }, [isReduced]);

  const rafRef = useRef(0);
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isReduced || isMobile) return;
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        const rect = e.currentTarget.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width;
        const ny = (e.clientY - rect.top) / rect.height;
        mouseX.set(nx * 100);
        mouseY.set(ny * 100);
      });
    },
    [isReduced, isMobile, mouseX, mouseY],
  );

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
  }, []);

  // Specular sweep component
  const SpecularSweep = useMemo(() => {
    if (isReduced) return null;
    return (
      <div
        key={sweepKey.current}
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          opacity: sweepActive ? 1 : 0,
          transition: "opacity 0.85s ease-in-out",
          background:
            "linear-gradient(108deg, transparent 25%, rgba(255,255,255,0.08) 50%, transparent 75%)",
        }}
      />
    );
  }, [sweepActive, sweepKey.current, isReduced]);

  // Radial cursor light
  const CursorGlow = useMemo(() => {
    if (isReduced) return null;
    return (
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{ opacity: hovered ? opacity : 0 }}
      >
        <motion.div
          className="absolute rounded-full"
          style={{
            left: lightXPct,
            top: lightYPct,
            width: radius,
            height: radius,
            x: "-50%",
            y: "-50%",
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            borderRadius: "50%",
            willChange: "transform",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
    );
  }, [hovered, opacity, radius, color, lightXPct, lightYPct]);

  return (
    <div
      className={cn("hero-cursor-light pointer-events-none absolute inset-0", className)}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-hidden="true"
    >
      {SpecularSweep}
      {CursorGlow}
    </div>
  );
}