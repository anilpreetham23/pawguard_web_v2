"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionStore } from "../../../motion/motion-store";
import { cn } from "../ui/utils";

// A live rescue feed told as a quiet human story rather than a status log.
// Each phrase moves the narrative forward: dispatch → arrival → safety → care
// → home. This keeps the "live" trust signal without the dashboard vocabulary.
const TICKER_PHRASES = [
  "A dispatcher picks up on the first ring",
  "A rescue van turns the corner",
  "A trembling pup feels a gentle hand",
  "A vet whispers, \"You're safe now\"",
  "A family drives through the night to meet them",
];

const TYPE_MS = 34;
const HOLD_MS = 3000;
const DELETE_MS = 18;
const PAUSE_MS = 500;

export function HeroTypewriter({ className }: { className?: string }) {
  const ready = useMotionStore((s) => s.ready);
  const motionTier = useMotionStore((s) => s.motionTier);
  const enabled = ready && motionTier === "full";

  const [text, setText] = useState("");
  const containerRef = useRef<HTMLParagraphElement>(null);
  const phraseRef = useRef(0);
  const charRef = useRef(0);
  const deletingRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    charRef.current = 0;
    phraseRef.current = 0;
    deletingRef.current = false;
    setText("");

    let paused = false;
    let done = false;
    let timeout: number | undefined;

    const stopTimer = () => {
      if (timeout !== undefined) {
        window.clearTimeout(timeout);
        timeout = undefined;
      }
    };

    const tick = () => {
      timeout = undefined;
      if (paused || done) return;
      const phrase = TICKER_PHRASES[phraseRef.current];
      if (!deletingRef.current) {
        charRef.current += 1;
        const currentChar = phrase.slice(0, charRef.current);
        setText(currentChar);

        if (charRef.current >= phrase.length) {
          deletingRef.current = true;
          timeout = window.setTimeout(tick, HOLD_MS);
        } else {
          timeout = window.setTimeout(tick, TYPE_MS);
        }
      } else {
        charRef.current -= 1;
        const currentChar = phrase.slice(0, charRef.current);
        setText(currentChar);

        if (charRef.current <= 0) {
          deletingRef.current = false;
          phraseRef.current = (phraseRef.current + 1) % TICKER_PHRASES.length;
          timeout = window.setTimeout(tick, PAUSE_MS);
        } else {
          timeout = window.setTimeout(tick, DELETE_MS);
        }
      }
    };

    const resume = () => {
      if (paused || done) return;
      if (timeout === undefined) {
        timeout = window.setTimeout(tick, 0);
      }
    };

    const setPaused = (value: boolean) => {
      if (paused === value) return;
      paused = value;
      if (paused) stopTimer();
      else resume();
    };

    const io = new IntersectionObserver(
      ([entry]) => setPaused(!entry.isIntersecting),
      { rootMargin: "80px 0px" },
    );
    if (containerRef.current) io.observe(containerRef.current);

    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    const start = window.setTimeout(tick, 1600);

    return () => {
      done = true;
      stopTimer();
      window.clearTimeout(start);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <p ref={containerRef} className={cn("hero-typewriter flex items-center gap-2 text-sm text-white/70", className)}>
      <span
        aria-hidden="true"
        className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 animate-hero-ticker-dot"
      />
      <span aria-hidden="true" className="font-mono tracking-wide min-h-[1.25rem]">
        {text}
        <span className="inline-block w-[1ch] -ml-[1ch] text-amber-200 animate-hero-caret" />
      </span>
      <span className="sr-only">
        Live rescue updates: {TICKER_PHRASES.join(". ")}
      </span>
    </p>
  );
}