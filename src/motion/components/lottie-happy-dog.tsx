"use client";

import { useCallback, useEffect, useRef } from "react";
import Lottie, { type LottieRef } from "lottie-react";
import happyDog from "../../imports/happy-dog.json";
import { useMotionStore } from "../motion-store";

interface LottieHappyDogProps {
  width?: number;
  className?: string;
}

export function LottieHappyDog({ width = 360, className }: LottieHappyDogProps) {
  const lottieRef = useRef<any>(null);
  const tier = useMotionStore((s) => s.motionTier);
  const isReduced = tier === "reduced" || tier === "none";

  const freezeOnLastFrame = useCallback(() => {
    if (!isReduced || !lottieRef.current) return;
    const totalFrames = lottieRef.current.getDuration(true) ?? 0;
    lottieRef.current.goToAndStop(Math.max(0, totalFrames - 1), true);
  }, [isReduced]);

  useEffect(() => {
    freezeOnLastFrame();
  }, [freezeOnLastFrame]);

  return (
    <div
      className={className}
      style={{ width, maxWidth: "100%", aspectRatio: "16 / 9" }}
      aria-hidden="true"
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={happyDog}
        autoplay={!isReduced}
        loop={!isReduced}
        renderer="svg"
        onLoad={freezeOnLastFrame}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
