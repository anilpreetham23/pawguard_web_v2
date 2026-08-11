"use client";

/**
 * InteractiveImage — cinematic image interaction engine.
 *
 * Layers (bottom → top):
 *  1. <img>            — zoom on hover, entrance scale
 *  2. Vignette         — permanent 6% dark edge
 *  3. CursorLight      — radial glow follows cursor (8% opacity)
 *  4. SpecularHighlight— diagonal gloss sweep, once per hover
 *  5. RimLight         — blue edge glow on hover (15%)
 *  6. HoverOverlay     — subtle contrast/saturation boost via gradient
 *  7. overlay slot     — badges, buttons, etc.
 *
 * Motion rules:
 *  - Only transform + opacity animated
 *  - All pointer tracking via MotionValue (zero React rerenders)
 *  - Idle float via CSS animation (GPU only)
 *  - Parallax via useSpring on MotionValues
 *  - Intersection Observer pauses offscreen
 */
import {
  useRef,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
  type ImgHTMLAttributes,
} from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "motion/react";
import { cn } from "../../app/components/ui/utils";
import { useMotionStore } from "../motion-store";

// ─── Motion constants ─────────────────────────────────────────────────────────
export const IMG_EASE = [0.22, 1, 0.36, 1] as const;
const SPRING_SOFT = { stiffness: 60, damping: 18, mass: 0.6 };
const SPRING_FAST = { stiffness: 140, damping: 22, mass: 0.4 };

// ─── Types ────────────────────────────────────────────────────────────────────
export type ImageVariant =
  | "default"
  | "hero"
  | "card"
  | "story"
  | "featured"
  | "portrait"
  | "partner";

export interface InteractiveImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  variant?: ImageVariant;
  className?: string;
  imgClassName?: string;
  aspectRatio?: string;
  /** Disable cursor parallax (use inside overflow:hidden parents) */
  noParallax?: boolean;
  noSweep?: boolean;
  noGlow?: boolean;
  noFloat?: boolean;
  overlay?: ReactNode;
  onImageLoad?: () => void;
}

// ─── Vignette ─────────────────────────────────────────────────────────────────
function Vignette() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[2]"
      style={{
        background:
          "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.06) 100%)",
      }}
    />
  );
}

// ─── CursorLight ──────────────────────────────────────────────────────────────
function CursorLight({
  mouseX,
  mouseY,
  active,
}: {
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  active: boolean;
}) {
  const opacity = useSpring(active ? 1 : 0, SPRING_FAST);
  useEffect(() => { opacity.set(active ? 1 : 0); }, [active, opacity]);

  const bgX = useTransform(mouseX, (v) => `${v}%`);
  const bgY = useTransform(mouseY, (v) => `${v}%`);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[3]"
      style={{ opacity }}
    >
      <motion.div
        className="absolute"
        style={{
          left: bgX,
          top: bgY,
          width: 380,
          height: 380,
          x: "-50%",
          y: "-50%",
          background:
            "radial-gradient(circle, rgba(255,200,130,0.30) 0%, rgba(255,180,96,0.10) 40%, transparent 70%)",
          borderRadius: "50%",
        }}
      />
    </motion.div>
  );
}

// ─── SpecularHighlight ────────────────────────────────────────────────────────
function SpecularHighlight({ trigger }: { trigger: boolean }) {
  return (
    <AnimatePresence>
      {trigger && (
        <motion.div
          key="specular"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[4]"
          initial={{ opacity: 0, x: "-110%" }}
          animate={{ opacity: [0, 0.06, 0.06, 0], x: ["-110%", "110%"] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: "easeInOut" }}
          style={{
            background:
              "linear-gradient(108deg, transparent 25%, rgba(255,255,255,0.7) 50%, transparent 75%)",
          }}
        />
      )}
    </AnimatePresence>
  );
}

// ─── RimLight ─────────────────────────────────────────────────────────────────
function RimLight({ active }: { active: boolean }) {
  const opacity = useSpring(active ? 1 : 0, SPRING_FAST);
  useEffect(() => { opacity.set(active ? 1 : 0); }, [active, opacity]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[5] rounded-[inherit]"
      style={{
        opacity,
        boxShadow: "inset 0 0 0 2px rgba(255,170,80,0.30), inset 0 0 24px rgba(255,170,80,0.10)",
      }}
    />
  );
}

// ─── HoverOverlay (contrast/saturation boost via gradient) ───────────────────
function HoverOverlay({ active }: { active: boolean }) {
  const opacity = useSpring(active ? 1 : 0, SPRING_FAST);
  useEffect(() => { opacity.set(active ? 1 : 0); }, [active, opacity]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] mix-blend-overlay"
      style={{
        opacity,
        background:
          "radial-gradient(ellipse at 50% 40%, rgba(255,196,120,0.16) 0%, rgba(120,62,10,0.14) 100%)",
      }}
    />
  );
}

// ─── DepthShadow (applied on wrapper, not image) ─────────────────────────────
// Handled via whileHover on the outer wrapper — no extra component needed.

// ─── Main component ───────────────────────────────────────────────────────────
export function InteractiveImage({
  src,
  alt,
  variant = "default",
  className,
  imgClassName,
  aspectRatio,
  noParallax = false,
  noSweep = false,
  noGlow = false,
  noFloat = false,
  overlay,
  onImageLoad,
  loading = "lazy",
  decoding = "async",
  ...imgProps
}: InteractiveImageProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(wrapperRef, { once: true, margin: "-60px" });
  const isVisible = useInView(wrapperRef, { margin: "0px" });

  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [swept, setSwept] = useState(false);

  const tier = useMotionStore((s) => s.motionTier);
  const isReduced = tier === "reduced" || tier === "none";
  const isMobile =
    typeof window !== "undefined" && window.matchMedia("(pointer:coarse)").matches;

  // ── Cursor tracking (MotionValues only — zero rerenders) ──────────────────
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  // Parallax: image moves ±6px, light moves ±14px (opposite for reflection)
  const rawPX = useMotionValue(0);
  const rawPY = useMotionValue(0);
  const imgPX = useSpring(rawPX, SPRING_SOFT);
  const imgPY = useSpring(rawPY, SPRING_SOFT);

  // ── Specular: trigger once per hover session ──────────────────────────────
  const sweepKey = useRef(0);
  const [sweepActive, setSweepActive] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    if (!noSweep && !isReduced) {
      sweepKey.current += 1;
      setSweepActive(true);
      setTimeout(() => setSweepActive(false), 900);
    }
  }, [noSweep, isReduced]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isReduced || isMobile) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      mouseX.set(nx * 100);
      mouseY.set(ny * 100);
      if (!noParallax) {
        rawPX.set((nx - 0.5) * 6);
        rawPY.set((ny - 0.5) * 6);
      }
    },
    [isReduced, isMobile, noParallax, mouseX, mouseY, rawPX, rawPY],
  );

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    rawPX.set(0);
    rawPY.set(0);
  }, [rawPX, rawPY]);

  const handleLoad = useCallback(() => {
    setLoaded(true);
    onImageLoad?.();
  }, [onImageLoad]);

  // Zoom scale per variant
  const zoomScale =
    variant === "hero" ? 1.04 : variant === "partner" ? 1.05 : 1.08;

  // Idle float: CSS keyframe via className (GPU only, no JS)
  const floatClass =
    !noFloat && !isReduced && !isMobile && isVisible
      ? "animate-img-float"
      : "";

  return (
    <motion.div
      ref={wrapperRef}
      className={cn(
        "relative overflow-hidden",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        floatClass,
        className,
      )}
      style={aspectRatio ? { aspectRatio } : undefined}
      // ── Entrance ──────────────────────────────────────────────────────────
      initial={isReduced ? undefined : { opacity: 0, y: 40, scale: 0.96 }}
      animate={
        isReduced
          ? undefined
          : isInView
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: 40, scale: 0.96 }
      }
      transition={
        isReduced
          ? undefined
          : { duration: 0.7, ease: IMG_EASE }
      }
      // ── Hover lift + depth shadow ─────────────────────────────────────────
      whileHover={
        isReduced
          ? undefined
          : {
              y: -8,
              scale: 1.025,
              transition: { duration: 0.45, ease: IMG_EASE },
            }
      }
      whileTap={
        isReduced
          ? undefined
          : { scale: 0.985, transition: { duration: 0.09 } }
      }
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* ── Loading skeleton ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {!loaded && (
          <motion.div
            key="skeleton"
            className="absolute inset-0 z-20 bg-card"
            animate={{ opacity: [0.35, 0.65, 0.35] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* ── Image ────────────────────────────────────────────────────────── */}
      <motion.img
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        onLoad={handleLoad}
        className={cn(
          "w-full h-full object-cover will-change-transform",
          imgClassName,
        )}
        style={
          !noParallax && !isReduced && !isMobile
            ? { x: imgPX, y: imgPY }
            : undefined
        }
        animate={
          isReduced
            ? { opacity: loaded ? 1 : 0 }
            : {
                scale: hovered ? zoomScale : loaded ? 1 : 0.97,
                opacity: loaded ? 1 : 0,
              }
        }
        transition={
          isReduced
            ? { duration: 0.4 }
            : {
                scale: { duration: 0.9, ease: "easeOut" },
                opacity: { duration: 0.45 },
              }
        }
        {...(imgProps as any)}
      />

      {/* ── Vignette ─────────────────────────────────────────────────────── */}
      <Vignette />

      {/* ── HoverOverlay (contrast boost) ────────────────────────────────── */}
      {!isReduced && <HoverOverlay active={hovered} />}

      {/* ── CursorLight ──────────────────────────────────────────────────── */}
      {!noGlow && !isReduced && !isMobile && (
        <CursorLight mouseX={mouseX} mouseY={mouseY} active={hovered} />
      )}

      {/* ── SpecularHighlight ────────────────────────────────────────────── */}
      {!noSweep && !isReduced && (
        <SpecularHighlight key={sweepKey.current} trigger={sweepActive} />
      )}

      {/* ── RimLight ─────────────────────────────────────────────────────── */}
      {!isReduced && <RimLight active={hovered} />}

      {/* ── Bottom gradient mask ─────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 z-[6]"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.20) 0%, transparent 100%)",
        }}
      />

      {/* ── Overlay slot ─────────────────────────────────────────────────── */}
      {overlay && (
        <div className="absolute inset-0 z-[10]">{overlay}</div>
      )}
    </motion.div>
  );
}
