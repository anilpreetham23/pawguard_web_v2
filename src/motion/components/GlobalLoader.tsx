"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useMotionStore } from "../motion-store";
import { LottieDog } from "./lottie-dog";
import "./global-loader.css";

/** Minimum time the loader is visible per cycle (feels deliberate, not flickery). */
const MIN_MS = 1500;
const EXIT_MS = 0.35;

/**
 * Global yellow-dog loading system. Covers the initial boot (preloader
 * replacement) and every subsequent route change. Shows ONLY the amber dog
 * walk cycle — no progress bar, messages, or paw marks. Stays up for a fixed
 * minimum window and while a lazy route chunk is still being fetched
 * (`pendingChunk`). Never locks scrolling, so a missed resume can't leave the
 * page frozen.
 */
export function GlobalLoader() {
  const loading = useMotionStore((s) => s.loading);
  const tier = useMotionStore((s) => s.motionTier);
  const setLoading = useMotionStore((s) => s.setLoading);
  const setReady = useMotionStore((s) => s.setReady);

  const isReduced = tier === "reduced" || tier === "none";
  const [visible, setVisible] = useState(false);
  const cycleStartRef = useRef(0);
  const completedRef = useRef(false);

  // Keep visibility in sync with the store signal before paint so there is
  // never a frame of un-covered content between route commit and overlay.
  useLayoutEffect(() => {
    if (isReduced) {
      setVisible(false);
      setLoading(false);
      setReady(true);
      return;
    }
    if (loading) {
      cycleStartRef.current = performance.now();
      completedRef.current = false;
      setVisible(true);
    }
  }, [loading, isReduced, setLoading, setReady]);

  // Exit only after the minimum window AND the lazy route chunk has resolved.
  useEffect(() => {
    if (!visible || isReduced) return;

    const start = cycleStartRef.current;
    let timer: number | undefined;

    const check = () => {
      const elapsed = performance.now() - start;
      const { pendingChunk } = useMotionStore.getState();
      if (elapsed >= MIN_MS && !pendingChunk && !completedRef.current) {
        completedRef.current = true;
        window.setTimeout(() => setVisible(false), 160);
        return;
      }
      timer = window.setTimeout(check, 60);
    };
    timer = window.setTimeout(check, 60);

    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [visible, isReduced]);

  const handleExitComplete = () => {
    setLoading(false);
    setReady(true);
  };

  if (isReduced) return null;

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {visible && (
        <motion.div
          key="global-loader"
          className="global-loader"
          role="status"
          aria-live="polite"
          aria-busy="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: EXIT_MS, ease: "easeOut" }}
        >
          <LottieDog size={190} className="global-loader__dog" />
          <span className="sr-only">Loading PawGuard</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
