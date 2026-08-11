"use client";

import { useEffect, useRef } from "react";
import Lottie, { type LottieRef } from "lottie-react";
import dogWalking from "../../imports/dog-walking.json";
import { useMotionStore } from "../motion-store";

interface LottieDogProps {
  size?: number;
  className?: string;
  /** Internal auto-control (preloader/loader usage): pause when not playing. */
  playing?: boolean;
  /** Internal auto-control: playback rate multiplier. */
  speed?: number;
  /**
   * External control. When provided, play/pause/speed are driven by the owner
   * via the Lottie instance (used by PuppyProgress to sync with scroll
   * velocity without re-rendering every frame).
   */
  lottieRef?: LottieRef;
}

export function LottieDog({
  size = 240,
  className,
  playing = true,
  speed = 1,
  lottieRef,
}: LottieDogProps) {
  const internalRef = useRef<any>(null);
  const ref = lottieRef ?? internalRef;
  const tier = useMotionStore((s) => s.motionTier);
  const isReduced = tier === "reduced" || tier === "none";

  useEffect(() => {
    if (lottieRef) return;
    const anim = ref.current as any;
    if (!anim) return;
    anim.setSpeed(speed);
    if (isReduced || !playing) {
      anim.pause();
    } else {
      anim.play();
    }
  }, [isReduced, playing, speed, lottieRef]);

  return (
    <div
      className={className}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <Lottie
        lottieRef={ref as any}
        animationData={dogWalking}
        autoplay={false}
        loop
        renderer="svg"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
