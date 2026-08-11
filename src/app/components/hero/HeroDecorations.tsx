"use client";

import { cn } from "../ui/utils";

/**
 * Phase 3 — Original Decorative System
 *
 * Custom illustration language using subtle SVG artwork.
 * Guidelines:
 *   - Low opacity (3–8%)
 *   - Large scale
 *   - Responsive
 *   - Never overlap important text
 *   - Never feel like clipart
 *   - Integrate naturally into the environment
 *   - Respond to cursor parallax (GPU-only transforms)
 *   - Subtle hover glow on interaction
 */

interface DecorationProps {
  className?: string;
  style?: React.CSSProperties;
}

/* ── Dog Face Outline ──────────────────────────────────────────────────────── */
export function DogFaceOutline({ className, style }: DecorationProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      className={cn("pointer-events-none select-none", className)}
      style={style}
      aria-hidden="true"
    >
      {/* Head */}
      <ellipse cx="100" cy="105" rx="52" ry="58" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      {/* Left ear */}
      <path d="M55 60 C40 20, 20 30, 35 65" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5" />
      {/* Right ear */}
      <path d="M145 60 C160 20, 180 30, 165 65" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5" />
      {/* Eyes */}
      <circle cx="80" cy="95" r="5" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
      <circle cx="120" cy="95" r="5" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
      {/* Nose */}
      <ellipse cx="100" cy="115" rx="8" ry="6" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      {/* Mouth */}
      <path d="M100 121 C90 132, 85 128, 80 125" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.35" />
      <path d="M100 121 C110 132, 115 128, 120 125" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.35" />
    </svg>
  );
}

/* ── Puppy Sketch ──────────────────────────────────────────────────────────── */
export function PuppySketch({ className, style }: DecorationProps) {
  return (
    <svg
      viewBox="0 0 180 160"
      fill="none"
      className={cn("pointer-events-none select-none", className)}
      style={style}
      aria-hidden="true"
    >
      {/* Body */}
      <ellipse cx="90" cy="100" rx="45" ry="35" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      {/* Head */}
      <circle cx="90" cy="55" r="28" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      {/* Ears */}
      <path d="M65 42 C55 20, 45 25, 52 45" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.4" />
      <path d="M115 42 C125 20, 135 25, 128 45" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.4" />
      {/* Eyes */}
      <circle cx="80" cy="50" r="3" fill="currentColor" opacity="0.3" />
      <circle cx="100" cy="50" r="3" fill="currentColor" opacity="0.3" />
      {/* Nose */}
      <ellipse cx="90" cy="60" rx="5" ry="3.5" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      {/* Tail */}
      <path d="M135 95 C150 80, 155 75, 148 68" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.4" />
      {/* Front legs */}
      <line x1="70" y1="130" x2="65" y2="150" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
      <line x1="85" y1="132" x2="82" y2="150" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
      {/* Back legs */}
      <line x1="105" y1="132" x2="108" y2="150" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
      <line x1="120" y1="130" x2="125" y2="150" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
    </svg>
  );
}

/* ── Paw Print ─────────────────────────────────────────────────────────────── */
export function PawPrint({ className, style }: DecorationProps) {
  return (
    <svg
      viewBox="0 0 60 70"
      fill="currentColor"
      className={cn("pointer-events-none select-none", className)}
      style={style}
      aria-hidden="true"
    >
      {/* Main pad */}
      <ellipse cx="30" cy="48" rx="14" ry="12" opacity="0.5" />
      {/* Toe pads */}
      <ellipse cx="16" cy="28" rx="7" ry="8" opacity="0.4" transform="rotate(-15 16 28)" />
      <ellipse cx="30" cy="22" rx="6.5" ry="7.5" opacity="0.4" />
      <ellipse cx="44" cy="28" rx="7" ry="8" opacity="0.4" transform="rotate(15 44 28)" />
      <ellipse cx="50" cy="42" rx="5.5" ry="6.5" opacity="0.35" transform="rotate(25 50 42)" />
    </svg>
  );
}

/* ── Veterinary Cross ──────────────────────────────────────────────────────── */
export function VetCross({ className, style }: DecorationProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={cn("pointer-events-none select-none", className)}
      style={style}
      aria-hidden="true"
    >
      <rect x="14" y="4" width="12" height="32" rx="2" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
      <rect x="4" y="14" width="32" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
    </svg>
  );
}

/* ── Rescue Heart ──────────────────────────────────────────────────────────── */
export function RescueHeart({ className, style }: DecorationProps) {
  return (
    <svg
      viewBox="0 0 50 50"
      fill="none"
      className={cn("pointer-events-none select-none", className)}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M25 42 C18 35, 4 26, 4 16 C4 10, 9 5, 15 5 C19 5, 22 7, 25 10 C28 7, 31 5, 35 5 C41 5, 46 10, 46 16 C46 26, 32 35, 25 42Z"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.4"
      />
      {/* Paw inside heart */}
      <ellipse cx="25" cy="22" rx="5" ry="4" fill="currentColor" opacity="0.2" />
      <circle cx="20" cy="17" r="2.2" fill="currentColor" opacity="0.15" />
      <circle cx="25" cy="15" r="2" fill="currentColor" opacity="0.15" />
      <circle cx="30" cy="17" r="2.2" fill="currentColor" opacity="0.15" />
    </svg>
  );
}

/* ── Dog Collar ────────────────────────────────────────────────────────────── */
export function DogCollar({ className, style }: DecorationProps) {
  return (
    <svg
      viewBox="0 0 120 30"
      fill="none"
      className={cn("pointer-events-none select-none", className)}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M5 15 C5 15, 20 5, 60 5 C100 5, 115 15, 115 15 C115 15, 100 25, 60 25 C20 25, 5 15, 5 15Z"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.4"
      />
      {/* Tags */}
      <circle cx="60" cy="22" r="5" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      <circle cx="60" cy="22" r="2" fill="currentColor" opacity="0.2" />
    </svg>
  );
}

/* ── Adoption Stamp ────────────────────────────────────────────────────────── */
export function AdoptionStamp({ className, style }: DecorationProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className={cn("pointer-events-none select-none", className)}
      style={style}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <circle cx="50" cy="50" r="36" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
      <text
        x="50"
        y="44"
        textAnchor="middle"
        fill="currentColor"
        fontSize="9"
        fontFamily="Barlow Condensed, sans-serif"
        fontWeight="700"
        letterSpacing="0.15em"
        opacity="0.3"
      >
        ADOPTED
      </text>
      <text
        x="50"
        y="60"
        textAnchor="middle"
        fill="currentColor"
        fontSize="6"
        fontFamily="Barlow Condensed, sans-serif"
        fontWeight="500"
        letterSpacing="0.1em"
        opacity="0.25"
      >
        PAWGUARD
      </text>
      {/* Star decoration */}
      <path
        d="M50 28 L52 34 L58 34 L53 38 L55 44 L50 40 L45 44 L47 38 L42 34 L48 34Z"
        fill="currentColor"
        opacity="0.2"
      />
    </svg>
  );
}

/* ── Map Pin ───────────────────────────────────────────────────────────────── */
export function MapPin({ className, style }: DecorationProps) {
  return (
    <svg
      viewBox="0 0 40 55"
      fill="none"
      className={cn("pointer-events-none select-none", className)}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M20 2 C10 2, 4 10, 4 18 C4 30, 20 50, 20 50 C20 50, 36 30, 36 18 C36 10, 30 2, 20 2Z"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.35"
      />
      <circle cx="20" cy="18" r="7" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

/* ── Rescue Rope / Leash ───────────────────────────────────────────────────── */
export function RescueRope({ className, style }: DecorationProps) {
  return (
    <svg
      viewBox="0 0 200 40"
      fill="none"
      className={cn("pointer-events-none select-none", className)}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M0 20 C30 10, 50 30, 80 20 C110 10, 130 30, 160 20 C180 14, 190 18, 200 20"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Dog Ear Peek ──────────────────────────────────────────────────────────── */
export function DogEarPeek({ className, style, side = "left" }: DecorationProps & { side?: "left" | "right" }) {
  const flip = side === "right" ? "scale(-1, 1)" : undefined;
  return (
    <svg
      viewBox="0 0 60 80"
      fill="none"
      className={cn("pointer-events-none select-none", className)}
      style={{ ...style, transform: flip ? `${style?.transform || ""} ${flip}`.trim() : style?.transform }}
      aria-hidden="true"
    >
      <path
        d="M55 80 C55 50, 50 20, 30 5 C20 -2, 5 0, 10 25 C12 35, 15 55, 20 80"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.4"
        fill="none"
      />
      {/* Inner ear line */}
      <path
        d="M48 70 C46 50, 42 30, 30 12"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.25"
        fill="none"
      />
    </svg>
  );
}

/* ── Community Hearts ──────────────────────────────────────────────────────── */
export function CommunityHearts({ className, style }: DecorationProps) {
  return (
    <svg
      viewBox="0 0 120 60"
      fill="none"
      className={cn("pointer-events-none select-none", className)}
      style={style}
      aria-hidden="true"
    >
      {/* Small hearts scattered */}
      <path d="M20 30 C17 24, 12 24, 12 28 C12 32, 20 38, 20 38 C20 38, 28 32, 28 28 C28 24, 23 24, 20 30Z" fill="currentColor" opacity="0.15" />
      <path d="M55 20 C53 16, 49 16, 49 19 C49 22, 55 26, 55 26 C55 26, 61 22, 61 19 C61 16, 57 16, 55 20Z" fill="currentColor" opacity="0.12" />
      <path d="M90 35 C88 31, 84 31, 84 34 C84 37, 90 41, 90 41 C90 41, 96 37, 96 34 C96 31, 92 31, 90 35Z" fill="currentColor" opacity="0.1" />
      <path d="M110 15 C108.5 12, 105.5 12, 105.5 14 C105.5 16, 110 19, 110 19 C110 19, 114.5 16, 114.5 14 C114.5 12, 111.5 12, 110 15Z" fill="currentColor" opacity="0.1" />
      <path d="M35 48 C34 46, 31.5 46, 31.5 47.5 C31.5 49, 35 51.5, 35 51.5 C35 51.5, 38.5 49, 38.5 47.5 C38.5 46, 36 46, 35 48Z" fill="currentColor" opacity="0.12" />
    </svg>
  );
}

/* ── Paw Trail (leading to CTA) ────────────────────────────────────────────── */
export function PawTrail({ className, style }: DecorationProps) {
  return (
    <svg
      viewBox="0 0 30 120"
      fill="currentColor"
      className={cn("pointer-events-none select-none", className)}
      style={style}
      aria-hidden="true"
    >
      {[0, 30, 60, 90].map((y, i) => (
        <g key={i} transform={`translate(${i % 2 === 0 ? 10 : 18}, ${y})`} opacity={0.25 - i * 0.04}>
          {/* Main pad */}
          <ellipse cx="0" cy="10" rx="4.5" ry="3.8" />
          {/* Toe pads */}
          <circle cx="-4" cy="2" r="1.8" />
          <circle cx="0" cy="0" r="1.6" />
          <circle cx="4" cy="2" r="1.8" />
        </g>
      ))}
    </svg>
  );
}

/* ── Handwritten Note ──────────────────────────────────────────────────────── */
export function HandwrittenNote({ className, style, text = "Rescue #4271" }: DecorationProps & { text?: string }) {
  return (
    <svg
      viewBox="0 0 160 50"
      fill="none"
      className={cn("pointer-events-none select-none", className)}
      style={style}
      aria-hidden="true"
    >
      {/* Paper background */}
      <rect x="2" y="2" width="156" height="46" rx="3" stroke="currentColor" strokeWidth="0.5" opacity="0.15" fill="currentColor" fillOpacity="0.03" />
      {/* Handwritten text */}
      <text
        x="12"
        y="30"
        fill="currentColor"
        fontSize="12"
        fontFamily="Georgia, serif"
        fontStyle="italic"
        opacity="0.2"
      >
        {text}
      </text>
      {/* Paper clip */}
      <path
        d="M140 5 C148 5, 150 8, 150 14 L150 22 C150 26, 147 28, 143 28 L143 14 C143 11, 144 9, 140 9"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.15"
      />
    </svg>
  );
}

/* ── Rescue Route Map ──────────────────────────────────────────────────────── */
export function RescueRouteMap({ className, style }: DecorationProps) {
  return (
    <svg
      viewBox="0 0 140 100"
      fill="none"
      className={cn("pointer-events-none select-none", className)}
      style={style}
      aria-hidden="true"
    >
      {/* Map grid lines */}
      {[20, 40, 60, 80].map((x) => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="100" stroke="currentColor" strokeWidth="0.3" opacity="0.1" />
      ))}
      {[20, 40, 60, 80].map((y) => (
        <line key={`h${y}`} x1="0" y1={y} x2="140" y2={y} stroke="currentColor" strokeWidth="0.3" opacity="0.1" />
      ))}
      {/* Rescue route */}
      <path
        d="M15 80 C30 60, 50 70, 60 40 C70 10, 90 25, 120 15"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.2"
        strokeDasharray="4 3"
        strokeLinecap="round"
      />
      {/* Start pin */}
      <circle cx="15" cy="80" r="4" fill="currentColor" opacity="0.2" />
      <circle cx="15" cy="80" r="2" fill="currentColor" opacity="0.15" />
      {/* End pin */}
      <circle cx="120" cy="15" r="4" stroke="currentColor" strokeWidth="1" opacity="0.25" />
      <circle cx="120" cy="15" r="1.5" fill="currentColor" opacity="0.2" />
    </svg>
  );
}

/* ── Main Decorations Composition ──────────────────────────────────────────── */
export function HeroDecorations({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden z-0",
        "[&_*]:text-white",
        className,
      )}
      aria-hidden="true"
    >
      {/* ── Top-left: Dog face outline (watching over the story) ── */}
      <DogFaceOutline
        className="absolute w-[280px] lg:w-[360px] opacity-[0.05] -top-8 -left-12 animate-hero-decoration-drift"
        style={
          {
            "--rot": "-12deg",
            "--drift-x": "5px",
            "--drift-y": "-3px",
            animationDuration: "16s",
          } as React.CSSProperties
        }
      />

      {/* ── Top-right: Single paw print ── */}
      <PawPrint
        className="absolute w-[45px] opacity-[0.06] top-[15%] right-[8%] animate-hero-decoration-drift"
        style={
          {
            "--rot": "25deg",
            "--drift-x": "4px",
            "--drift-y": "-4px",
            animationDuration: "14s",
          } as React.CSSProperties
        }
      />

      {/* ── Bottom-left: Veterinary cross ── */}
      <VetCross
        className="absolute w-[60px] opacity-[0.05] bottom-[20%] left-[3%]"
        style={{ transform: "rotate(8deg)" }}
      />

      {/* ── Center-right: Puppy sketch (a quiet companion in the frame) ── */}
      <PuppySketch
        className="absolute w-[200px] lg:w-[260px] opacity-[0.045] top-[40%] -right-8 animate-hero-decoration-drift"
        style={
          {
            "--rot": "5deg",
            "--drift-x": "-5px",
            "--drift-y": "4px",
            animationDuration: "18s",
          } as React.CSSProperties
        }
      />

      {/* ── Bottom-right: Adoption stamp ── */}
      <AdoptionStamp
        className="absolute w-[90px] opacity-[0.05] bottom-[15%] right-[5%] animate-hero-decoration-drift"
        style={
          {
            "--rot": "-15deg",
            "--drift-x": "-4px",
            "--drift-y": "3px",
            animationDuration: "20s",
          } as React.CSSProperties
        }
      />

      {/* ── Left edge: Dog ear peek ── */}
      <DogEarPeek
        className="absolute w-[50px] opacity-[0.04] top-[10%] -left-2"
      />

      {/* ── Center: Rescue heart (softly breathing) ── */}
      <RescueHeart
        className="absolute w-[70px] opacity-[0.04] top-[35%] left-[45%] animate-hero-float-gentle"
        style={{ animationDuration: "6s" } as React.CSSProperties}
      />

      {/* ── Top-left: Rescue rope ── */}
      <RescueRope
        className="absolute w-[200px] opacity-[0.03] top-[42%] left-0"
        style={{ transform: "rotate(-3deg)" }}
      />
    </div>
  );
}
