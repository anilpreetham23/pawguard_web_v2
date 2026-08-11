"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "motion/react";
import { useMotionStore } from "../../../motion/motion-store";
import { duration, ease } from "../../../motion/motion.config";
import { cn } from "../ui/utils";

/**
 * EditorialHeading — handcrafted typography.
 *
 * Word-level reveal where some words feel heavier than others:
 *   `*second chance*`  → serif italic accent with a hand-drawn underline
 *   `~and~`            → quieter, lower-contrast word
 *   normal words       → clean serif, arrive in rhythm
 *
 * The emphasized words arrive a beat later, from deeper, with a gentle
 * blur-to-sharp so the eye lands on them last. Fully tier-aware: on
 * reduced-motion it renders statically with the emphasis preserved.
 */

type Token = { type: "default" | "em" | "muted"; word: string };

function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  let current = "";
  let mode: Token["type"] = "default";
  const push = (chunk: string, m: Token["type"]) => {
    chunk
      .split(/\s+/)
      .filter(Boolean)
      .forEach((w) => tokens.push({ type: m, word: w }));
  };

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === "*") {
      if (current.trim()) push(current, mode);
      current = "";
      mode = mode === "em" ? "default" : "em";
      continue;
    }
    if (ch === "~") {
      if (current.trim()) push(current, mode);
      current = "";
      mode = mode === "muted" ? "default" : "muted";
      continue;
    }
    current += ch;
  }
  if (current.trim()) push(current, mode);
  return tokens;
}

interface EditorialHeadingProps {
  eyebrow?: string;
  as?: "h1" | "h2" | "h3";
  children: ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
  /** When true, skip the internal word-level reveal — the parent owns the
   *  reveal animation (e.g. a GSAP scroll timeline). Static rendering keeps
   *  the emphasis styles but never touches opacity/transform, so it composes
   *  cleanly with an outer transform animation. */
  static?: boolean;
}

export function EditorialHeading({
  eyebrow,
  as: Tag = "h2",
  children,
  description,
  align = "left",
  className,
  static: isStatic = false,
}: EditorialHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const tier = useMotionStore((s) => s.motionTier);
  const animate = !isStatic && tier === "full";

  const center = align === "center";
  const tokens = typeof children === "string" ? tokenize(children) : [];

  return (
    <div className={cn("flex flex-col gap-[var(--space-3)]", center && "items-center text-center", className)}>
      {eyebrow && (
        <p className="text-primary text-xs font-semibold tracking-[0.12em] uppercase">
          {eyebrow}
        </p>
      )}

      <Tag
        ref={ref}
        className="text-foreground font-serif font-bold text-2xl lg:text-3xl leading-tight tracking-tight text-pretty"
      >
        {typeof children === "string" && tokens.length > 0 ? (
          isStatic ? (
            <span className={cn("inline-flex flex-wrap", center && "justify-center")}>
              {tokens.map((t, i) => {
                const isEm = t.type === "em";
                const isMuted = t.type === "muted";
                return (
                  <span
                    key={`${t.word}-${i}`}
                    className={cn(
                      "relative inline-block mr-[0.28em] mb-[0.12em]",
                      isMuted && "opacity-70 font-normal",
                    )}
                  >
                    {isEm ? (
                      <em className="relative font-serif italic text-primary">{t.word}</em>
                    ) : (
                      <span>{t.word}</span>
                    )}
                  </span>
                );
              })}
            </span>
          ) : (
            <motion.span
              className={cn("inline-flex flex-wrap", center && "justify-center")}
              initial={animate ? "hidden" : false}
              animate={animate && inView ? "visible" : false}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.055 } },
              }}
            >
              {tokens.map((t, i) => {
                const isEm = t.type === "em";
                const isMuted = t.type === "muted";
                return (
                  <motion.span
                    key={`${t.word}-${i}`}
                    className="relative inline-block mr-[0.28em] mb-[0.12em]"
                    variants={{
                      hidden: { opacity: 0, y: 22, filter: isEm ? "blur(5px)" : "blur(1px)" },
                      visible: {
                        opacity: isMuted ? 0.68 : 1,
                        y: 0,
                        filter: "blur(0px)",
                        transition: {
                          duration: isEm ? duration.narrative / 1000 : duration.reveal / 1000,
                          ease: isEm ? ease.narrative : ease.gentle,
                          delay: isEm ? 0.28 : 0,
                        },
                      },
                    }}
                  >
                    {isEm ? (
                      <em className="relative font-serif italic text-primary">
                        {t.word}
                        <motion.span
                          aria-hidden="true"
                          className="absolute -bottom-[0.14em] left-0 right-0 h-[0.13em] rounded-full"
                          style={{
                            background:
                              "linear-gradient(90deg, rgba(255,180,96,0.85) 0%, rgba(255,180,96,0.25) 100%)",
                            transformOrigin: "left center",
                          }}
                          initial={{ scaleX: 0, opacity: 0 }}
                          animate={animate && inView ? { scaleX: 1, opacity: 1 } : { scaleX: 1, opacity: 1 }}
                          transition={{ duration: 0.5, ease: ease.narrative, delay: 0.4 }}
                        />
                      </em>
                    ) : (
                      <span className={cn(isMuted && "font-normal")}>{t.word}</span>
                    )}
                  </motion.span>
                );
              })}
            </motion.span>
          )
        ) : (
          <span
            className="inline-block"
            style={
              animate && !inView ? { opacity: 0, transform: "translateY(16px)" } : undefined
            }
          >
            {children}
          </span>
        )}
      </Tag>

      {description && (
        <p className="text-muted-foreground text-lg leading-relaxed max-w-[540px]">{description}</p>
      )}
    </div>
  );
}
