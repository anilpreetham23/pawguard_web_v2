"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { InteractiveImage } from "../../motion/components/InteractiveImage";
import { useMotionStore } from "../../motion/motion-store";

const TILT_SPRING = { stiffness: 180, damping: 22, mass: 0.6 };
const GLOW_SPRING = { stiffness: 100, damping: 20, mass: 0.5 };

interface StoryCardProps {
  headline: string;
  excerpt: string;
  img: string;
  adopter: string;
  type: string;
  featured?: boolean;
}

// ─── Tilt wrapper — reused for non-featured cards ─────────────────────────────
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const tier = useMotionStore((s) => s.motionTier);
  const isReduced = tier === "reduced" || tier === "none";
  const isMobile = typeof window !== "undefined" && window.matchMedia("(pointer:coarse)").matches;

  const rawRotX = useMotionValue(0);
  const rawRotY = useMotionValue(0);
  const rotX = useSpring(rawRotX, TILT_SPRING);
  const rotY = useSpring(rawRotY, TILT_SPRING);
  const rawLift = useMotionValue(0);
  const lift = useSpring(rawLift, TILT_SPRING);

  const rawGX = useMotionValue(50);
  const rawGY = useMotionValue(50);
  const glowX = useSpring(rawGX, GLOW_SPRING);
  const glowY = useSpring(rawGY, GLOW_SPRING);
  const glowOpacity = useSpring(0, GLOW_SPRING);

  const cardTransform = useTransform(
    [rotX, rotY, lift],
    ([rx, ry, ly]: number[]) =>
      `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(${ly}px)`,
  );

  const glowBg = useTransform(
    [glowX, glowY],
    ([gx, gy]: number[]) =>
      `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,180,96,0.22) 0%, rgba(255,180,96,0.07) 40%, transparent 70%)`,
  );

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isReduced || isMobile) return;
    const rect = ref.current!.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    rawRotY.set((nx - 0.5) * 18);
    rawRotX.set(-(ny - 0.5) * 12);
    rawGX.set(nx * 100);
    rawGY.set(ny * 100);
  }, [isReduced, isMobile, rawRotX, rawRotY, rawGX, rawGY]);

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    rawLift.set(-10);
    glowOpacity.set(1);
  }, [rawLift, glowOpacity]);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    rawRotX.set(0); rawRotY.set(0);
    rawGX.set(50);  rawGY.set(50);
    rawLift.set(0);
    glowOpacity.set(0);
  }, [rawRotX, rawRotY, rawGX, rawGY, rawLift, glowOpacity]);

  return (
    <div
      ref={ref}
      className={`relative ${className ?? ""}`}
      style={{ perspective: "900px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Outer ambient glow */}
      {!isReduced && !isMobile && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-6 rounded-[28px] z-0"
          style={{ opacity: glowOpacity, background: glowBg }}
        />
      )}

      <motion.div
        className="relative z-10 will-change-transform"
        style={isReduced || isMobile ? undefined : { transform: cardTransform }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function StoryCard({ headline, excerpt, img, adopter, type, featured }: StoryCardProps) {
  if (featured) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--space-10)] lg:gap-[var(--space-16)] items-center">
        <div className="relative aspect-[4/3] lg:aspect-[5/3] rounded-img overflow-hidden shadow-md">
          <InteractiveImage
            src={img}
            alt={headline}
            variant="story"
            className="absolute inset-0 w-full h-full rounded-img"
            noParallax
            noFloat
          />
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <span className="text-primary text-xs font-semibold tracking-widest uppercase font-condensed">Featured Story</span>
            <p className="text-muted-foreground text-sm">{type}</p>
          </div>
          <h2 className="text-foreground font-serif font-bold text-2xl lg:text-3xl leading-tight tracking-tight">
            {headline}
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">{excerpt}</p>
          <div className="flex flex-col gap-1 pt-5 border-t border-border">
            <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase font-condensed">Adopted by</span>
            <span className="text-foreground font-bold text-lg">{adopter}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TiltCard>
      <div className="flex flex-col gap-4 group">
        <div className="aspect-[4/3] relative rounded-img overflow-hidden">
          <InteractiveImage
            src={img}
            alt={headline}
            variant="card"
            className="absolute inset-0 w-full h-full rounded-img"
            noParallax
            noFloat
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground text-xs font-medium">{type}</p>
          <h3 className="text-foreground font-bold text-xl leading-snug group-hover:text-primary transition-colors duration-ui">{headline}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{excerpt}</p>
          <div className="flex flex-col gap-0.5 pt-3 border-t border-border mt-2">
            <span className="text-muted-foreground text-2xs font-medium tracking-wider uppercase">Adopted by</span>
            <span className="text-foreground font-semibold text-sm">{adopter}</span>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}
