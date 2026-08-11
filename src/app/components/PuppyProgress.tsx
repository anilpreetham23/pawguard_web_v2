"use client";

import { useEffect, useRef } from "react";
import type { LottieRef } from "lottie-react";
import { useMotionStore } from "../../motion/motion-store";
import { LottieDog } from "../../motion/components/lottie-dog";
import "./puppy-progress.css";

const PUPPY_SIZE = 72;

/** Paw prints are laid once at every 5% milestone (5% → 95%). */
const MILESTONE_STEP = 5;
const MILESTONE_MAX = 95;

/** Velocity below which the dog is considered idle (px/frame). */
const IDLE_VELOCITY = 0.01;

export default function PuppyProgress() {
  const trackRef  = useRef<HTMLDivElement>(null);
  const fillRef   = useRef<HTMLDivElement>(null);
  const dogRef    = useRef<HTMLDivElement>(null);
  const dogAnimRef = useRef<any>(null);
  const pawRefs   = useRef<(HTMLSpanElement | null)[]>([]);
  const lastMilestoneRef = useRef(0);
  const lastVelocityRef  = useRef(0);
  const walkingRef = useRef(false);
  const completeRef = useRef(false);

  // Subscribe imperatively: every scroll update writes the dog's position and
  // fill bar directly to the DOM (no React re-render, no timers, no easing).
  useEffect(() => {
    const setPaw = (milestone: number, laid: boolean) => {
      const idx = Math.round(milestone / MILESTONE_STEP) - 1;
      const el = pawRefs.current[idx];
      if (el) el.dataset.laid = laid ? "true" : "false";
    };

    // Cache track width — only recalculate on resize, not every scroll frame.
    let cachedTrackW = trackRef.current?.offsetWidth ?? window.innerWidth;

    const applyScroll = (scrollY: number, progress: number, velocity: number) => {
      const x = progress * Math.max(0, cachedTrackW - PUPPY_SIZE);
      const facing =
        useMotionStore.getState().scrollDirection === "up" ? " scaleX(-1)" : "";

      if (dogRef.current) {
        dogRef.current.style.transform = `translate3d(${x}px,0,0)${facing}`;
      }
      if (fillRef.current) {
        fillRef.current.style.transform = `scaleX(${progress})`;
      }

      // Milestone paw prints — fire once per crossing, fade via CSS only.
      const milestone = Math.floor(progress * (100 / MILESTONE_STEP));
      if (milestone !== lastMilestoneRef.current) {
        const lo = Math.min(milestone, lastMilestoneRef.current);
        const hi = Math.max(milestone, lastMilestoneRef.current);
        const goingUp = milestone > lastMilestoneRef.current;
        for (let m = lo + 1; m <= hi; m++) {
          if (m * MILESTONE_STEP > MILESTONE_MAX) continue;
          setPaw(m * MILESTONE_STEP, goingUp);
        }
        lastMilestoneRef.current = milestone;
      }

      // Completion state — heart + celebration at ~100%.
      const complete = progress >= 0.995;
      if (complete !== completeRef.current) {
        completeRef.current = complete;
        if (dogRef.current) {
          dogRef.current.dataset.complete = complete ? "true" : "false";
        }
      }

      // Walk animation synced to velocity — legs match actual scroll speed.
      const anim = dogAnimRef.current;
      const speedMag = Math.abs(velocity);
      const moving = speedMag > IDLE_VELOCITY;
      if (moving) {
        const smoothed = lastVelocityRef.current + (speedMag - lastVelocityRef.current) * 0.3;
        lastVelocityRef.current = smoothed;
        const speed = Math.min(3, Math.max(0.5, 0.5 + smoothed * 0.3));
        anim?.setSpeed(speed);
        if (!walkingRef.current) {
          walkingRef.current = true;
          dogRef.current?.classList.remove("is-idle");
          anim?.play();
        }
      } else if (walkingRef.current) {
        lastVelocityRef.current = 0;
        walkingRef.current = false;
        anim?.pause();
        dogRef.current?.classList.add("is-idle");
      }
    };

    applyScroll(
      useMotionStore.getState().scrollY,
      useMotionStore.getState().scrollProgress,
      useMotionStore.getState().scrollVelocity,
    );

    const onResize = () => {
      cachedTrackW = trackRef.current?.offsetWidth ?? window.innerWidth;
      const { scrollY, scrollProgress, scrollVelocity } = useMotionStore.getState();
      applyScroll(scrollY, scrollProgress, scrollVelocity);
    };
    window.addEventListener("resize", onResize, { passive: true });

    // Subscribe to scroll state changes.
    const unsubscribe = useMotionStore.subscribe((state) => {
      applyScroll(state.scrollY, state.scrollProgress, state.scrollVelocity);
    });

    return () => {
      window.removeEventListener("resize", onResize);
      unsubscribe();
    };
  }, []);

  const milestones: number[] = [];
  for (let m = MILESTONE_STEP; m <= MILESTONE_MAX; m += MILESTONE_STEP) {
    milestones.push(m);
  }

  return (
    <div className="puppy-bar" aria-hidden="true" role="presentation">
      <div ref={trackRef} className="puppy-bar__track">
        <div ref={fillRef} className="puppy-bar__fill" style={{ transform: "scaleX(0)" }} />

        {/* Paw prints laid at every 5% milestone */}
        <div className="puppy-bar__paws">
          {milestones.map((m, i) => (
            <span
              key={m}
              ref={(el) => { pawRefs.current[i] = el; }}
              className="puppy-bar__paw"
              style={{ left: `${m}%` }}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                <ellipse cx="12" cy="17" rx="4.6" ry="3.8" opacity="0.85" />
                <circle cx="5.6" cy="10.6" r="2.1" opacity="0.7" />
                <circle cx="12" cy="9" r="2" opacity="0.7" />
                <circle cx="18.4" cy="10.6" r="2.1" opacity="0.7" />
              </svg>
            </span>
          ))}
        </div>

        <div ref={dogRef} className="puppy-bar__dog" style={{ transform: "translate3d(0,0,0)" }}>
          {/* Heart celebrates 100% completion */}
          <span className="puppy-bar__heart" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M12 21 C6 15, 2 10.5, 2 7 C2 3.5, 5 2, 7.5 2 C9.5 2, 11 3, 12 4.5 C13 3, 14.5 2, 16.5 2 C19 2, 22 3.5, 22 7 C22 10.5, 18 15, 12 21Z" />
            </svg>
          </span>
          <LottieDog
            size={PUPPY_SIZE}
            className="puppy-bar__lottie"
            lottieRef={dogAnimRef}
          />
        </div>
      </div>
    </div>
  );
}
