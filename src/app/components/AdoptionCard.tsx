"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Heart, ArrowRight } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "motion/react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "../components/ui/hover-card";
import { InteractiveImage } from "../../motion/components/InteractiveImage";
import { useMotionStore } from "../../motion/motion-store";
import { cn } from "./ui/utils";
import { useFavorites } from "../hooks/useFavorites";

// ─── Springs ──────────────────────────────────────────────────────────────────
const TILT_SPRING  = { stiffness: 180, damping: 22, mass: 0.6 };
const GLOW_SPRING  = { stiffness: 100, damping: 20, mass: 0.5 };

// ─── Placeholder art (used when the live API has no photo) ───────────────────
const TONE_GRADIENTS: Record<string, string> = {
  amber: "from-amber-200/90 via-orange-100 to-amber-100",
  purple: "from-violet-200/90 via-purple-100 to-indigo-100",
  sky: "from-sky-200/90 via-cyan-100 to-sky-100",
  rose: "from-rose-200/90 via-pink-100 to-rose-100",
  teal: "from-teal-200/90 via-emerald-100 to-teal-100",
};

function PetPlaceholder({ emoji, tone }: { emoji?: string; tone?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-0 flex items-center justify-center bg-gradient-to-br",
        TONE_GRADIENTS[tone ?? ""] ?? TONE_GRADIENTS.amber,
      )}
    >
      <span className="text-7xl leading-none drop-shadow-sm select-none">
        {emoji ?? "🐶"}
      </span>
    </div>
  );
}

// ─── Urgent badge ─────────────────────────────────────────────────────────────
function UrgentBadge() {
  return (
    <span
      className="bg-destructive text-white text-2xs font-bold tracking-wider uppercase px-2.5 py-1 rounded-sm shadow-sm"
      style={{ animation: "badge-urgent-pulse 6s ease-in-out infinite" }}
    >
      Urgent
    </span>
  );
}

// ─── New badge ────────────────────────────────────────────────────────────────
function NewBadge() {
  return (
    <span
      className="text-primary-foreground text-2xs font-bold tracking-wider uppercase px-2.5 py-1 rounded-sm shadow-sm relative overflow-hidden"
      style={{
        background: "linear-gradient(90deg,#00236f 0%,#1D4ED8 40%,#00236f 60%,#00236f 100%)",
        backgroundSize: "200% auto",
        animation: "badge-new-shimmer 3s linear infinite",
      }}
    >
      New
    </span>
  );
}

// ─── Heart burst ──────────────────────────────────────────────────────────────
function HeartButton({ saved, onToggle }: { saved?: boolean; onToggle?: () => void }) {
  const [burst, setBurst] = useState(false);
  const handle = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setBurst(true);
    setTimeout(() => setBurst(false), 600);
    onToggle?.();
  }, [onToggle]);

  return (
    <button onClick={handle} aria-label={saved ? "Remove from saved" : "Save to favourites"}
      className="relative flex items-center justify-center w-6 h-6 shrink-0"
      type="button"
      aria-pressed={saved}
    >
      <motion.div animate={burst ? { scale: 1.2 } : { scale: 1 }}
        transition={{ duration: 0.18, ease: [0.22,1,0.36,1] }}>
        <Heart size={12} className={cn("transition-colors duration-200",
          saved ? "text-destructive fill-destructive" : "text-muted-foreground/40")} />
      </motion.div>
      <AnimatePresence>
        {burst && [0,60,120,180,240,300].map((deg) => (
          <motion.div key={deg}
            className="absolute w-1 h-1 rounded-full bg-destructive/70"
            initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
            animate={{
              scale: [0,1,0],
              x: Math.cos((deg*Math.PI)/180)*10,
              y: Math.sin((deg*Math.PI)/180)*10,
              opacity: [1,1,0],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </button>
  );
}

// ─── Main card ────────────────────────────────────────────────────────────────
export default function AdoptionCard({
  name, breed, age, gender, img,
  desc = "", temperament, vaccinated,
  urgent, newArrival, slug,
  emoji, tone,
  image_urls, photo_gallery_urls,
}: {
  name: string; breed: string; age: string; gender: string; img?: string;
  desc?: string; temperament?: string; vaccinated?: boolean;
  urgent?: boolean; newArrival?: boolean; slug?: string;
  emoji?: string; tone?: string;
  image_urls?: string[]; photo_gallery_urls?: string[];
}) {
  const cardRef  = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);

  const mainImage = img || image_urls?.[0] || photo_gallery_urls?.[0];

  const { isFavorited, toggleFavorite } = useFavorites();
  const saved = slug ? isFavorited(slug) : false;

  const tier = useMotionStore((s) => s.motionTier);
  const isReduced = tier === "reduced" || tier === "none";
  const isMobile = typeof window !== "undefined" && window.matchMedia("(pointer:coarse)").matches;

  // ── 3D tilt MotionValues ──────────────────────────────────────────────────
  const rawRotX = useMotionValue(0);
  const rawRotY = useMotionValue(0);
  const rotX = useSpring(rawRotX, TILT_SPRING);
  const rotY = useSpring(rawRotY, TILT_SPRING);

  // ── Outer glow position ───────────────────────────────────────────────────
  const rawGX = useMotionValue(50);
  const rawGY = useMotionValue(50);
  const glowX = useSpring(rawGX, GLOW_SPRING);
  const glowY = useSpring(rawGY, GLOW_SPRING);
  const glowOpacity = useSpring(0, GLOW_SPRING);

  // ── Lift ──────────────────────────────────────────────────────────────────
  const rawLift = useMotionValue(0);
  const lift = useSpring(rawLift, TILT_SPRING);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isReduced || isMobile) return;
    const rect = cardRef.current!.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;   // 0→1
    const ny = (e.clientY - rect.top)  / rect.height;  // 0→1
    // tilt: max ±10deg
    rawRotY.set((nx - 0.5) * 20);
    rawRotX.set(-(ny - 0.5) * 14);
    // glow follows cursor as % of card
    rawGX.set(nx * 100);
    rawGY.set(ny * 100);
  }, [isReduced, isMobile, rawRotX, rawRotY, rawGX, rawGY]);

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    rawLift.set(-12);
    glowOpacity.set(1);
  }, [rawLift, glowOpacity]);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    rawRotX.set(0);
    rawRotY.set(0);
    rawGX.set(50);
    rawGY.set(50);
    rawLift.set(0);
    glowOpacity.set(0);
  }, [rawRotX, rawRotY, rawGX, rawGY, rawLift, glowOpacity]);

  // Derived CSS transform string — no rerenders, pure MotionValue
  const cardTransform = useTransform(
    [rotX, rotY, lift],
    ([rx, ry, ly]: number[]) =>
      `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(${ly}px)`,
  );

  // Glow position as CSS background
  const glowBg = useTransform(
    [glowX, glowY],
    ([gx, gy]: number[]) =>
      `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,180,96,0.24) 0%, rgba(255,180,96,0.08) 40%, transparent 70%)`,
  );

  return (
    // ── Outer shell — NOT overflow-hidden so glow + lift are visible ────────
    <div
      ref={cardRef}
      className="relative"
      style={{ perspective: "900px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Ambient outer glow (follows cursor, outside card boundary) ────── */}
      {!isReduced && !isMobile && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-6 rounded-[28px] z-0"
          style={{ opacity: glowOpacity, background: glowBg }}
        />
      )}

      {/* ── Card body ─────────────────────────────────────────────────────── */}
      <motion.div
        style={isReduced || isMobile ? undefined : { transform: cardTransform }}
        className="relative z-10 will-change-transform"
      >
        <Link
          href={slug ? `/adopt/${slug}` : "/adopt"}
          className="group bg-card border border-border rounded-card overflow-hidden shadow-sm flex flex-col transition-shadow duration-300"
          style={{
            boxShadow: hovered
              ? "0 20px 60px -12px rgba(255,170,80,0.28), 0 8px 24px -4px rgba(0,0,0,0.12)"
              : "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          {/* ── Image / placeholder art ──────────────────────────────────── */}
          <div className="relative aspect-[4/3] overflow-hidden">
            {mainImage ? (
              <InteractiveImage
                src={mainImage}
                alt={`${name} — ${breed}, ${age}, ${gender}`}
                variant="featured"
                className="absolute inset-0 w-full h-full"
                noParallax
                noFloat
              />
            ) : (
              <PetPlaceholder emoji={emoji} tone={tone} />
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2 z-20">
              {urgent    && <UrgentBadge />}
              {newArrival && <NewBadge />}
            </div>
            <div className="absolute top-3 right-3 z-20">
              <span className="bg-white/90 text-foreground text-2xs font-medium px-2 py-1 rounded-sm shadow-sm">
                {gender}
              </span>
            </div>

            {/* Inner cursor glow on image — follows same cursor position */}
            {!isReduced && !isMobile && (
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-[8]"
                style={{
                  opacity: glowOpacity,
                  background: useTransform(
                    [glowX, glowY],
                    ([gx, gy]: number[]) =>
                      `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.18) 0%, transparent 60%)`,
                  ),
                }}
              />
            )}
          </div>

          {/* ── Content ───────────────────────────────────────────────────── */}
          <div className="p-3 sm:p-5 flex flex-col gap-1.5 sm:gap-2 flex-1 min-w-0">
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="flex items-center justify-between gap-1.5 sm:gap-2 cursor-help min-w-0">
                  <h3 className="text-foreground font-bold text-base sm:text-lg group-hover:text-primary transition-colors duration-ui truncate">
                    {name}
                  </h3>
                  <HeartButton
                    saved={saved}
                    onToggle={slug ? () => toggleFavorite({ id: slug, name, breed, age, gender, emoji, tone }) : undefined}
                  />
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-72" side="top" align="start">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-bold text-base">{name}</span>
                    <span className="text-muted-foreground text-sm">{breed}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full">{age}</span>
                    <span className="bg-card text-muted-foreground text-xs font-semibold px-2 py-0.5 rounded-full border border-border">{gender}</span>
                    {temperament && (
                      <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full">{temperament}</span>
                    )}
                  </div>
                  {desc && <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>}
                  {vaccinated && (
                    <div className="flex items-center gap-1.5 text-emerald-700 text-xs">
                      <CheckCircle2 size={12} />
                      <span>Vaccinated &amp; health-checked</span>
                    </div>
                  )}
                </div>
              </HoverCardContent>
            </HoverCard>

            <p className="text-muted-foreground text-xs sm:text-sm truncate">{breed} &middot; {age}</p>

            {/* Button */}
            <div className="mt-auto pt-2 sm:pt-3">
              <motion.span
                className="relative inline-flex w-full items-center justify-center gap-1.5 sm:gap-2 overflow-hidden border border-primary text-primary text-[10px] sm:text-xs font-semibold tracking-wider uppercase font-condensed px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-btn group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-btn-glow-primary transition-colors duration-ui"
                onMouseEnter={() => setBtnHovered(true)}
                onMouseLeave={() => setBtnHovered(false)}
              >
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  initial={{ x: "-100%", opacity: 0 }}
                  animate={btnHovered ? { x: "100%", opacity: [0, 0.15, 0] } : { x: "-100%", opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)" }}
                />
                Meet {name}
                <motion.span
                  animate={{ x: btnHovered ? 6 : 0 }}
                  transition={{ duration: 0.25, ease: [0.22,1,0.36,1] }}
                >
                  <ArrowRight size={11} />
                </motion.span>
              </motion.span>
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
