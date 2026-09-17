"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useMotionValue, type MotionValue } from "motion/react";

export interface ParallaxLayerValue {
  id: string;
  x: MotionValue<number>;
  y: MotionValue<number>;
  multiplier: number;
}

interface HeroParallaxContextValue {
  mouseX: ReturnType<typeof import("motion/react").useMotionValue<number>>;
  mouseY: ReturnType<typeof import("motion/react").useMotionValue<number>>;
  layerValues: {
    id: string;
    x: ReturnType<typeof import("motion/react").useMotionValue<number>>;
    y: ReturnType<typeof import("motion/react").useMotionValue<number>>;
    multiplier: number;
  }[];
}

const HeroParallaxContext = createContext<{
  mouseX: ReturnType<typeof import("motion/react").useMotionValue<number>>;
  mouseY: ReturnType<typeof import("motion/react").useMotionValue<number>>;
  layerValues: {
    id: string;
    x: ReturnType<typeof import("motion/react").useMotionValue<number>>;
    y: ReturnType<typeof import("motion/react").useMotionValue<number>>;
    multiplier: number;
  }[];
} | null>(null);

interface HeroParallaxProviderProps {
  children: React.ReactNode;
  layerValues: {
    id: string;
    x: ReturnType<typeof import("motion/react").useMotionValue<number>>;
    y: ReturnType<typeof import("motion/react").useMotionValue<number>>;
    multiplier: number;
  }[];
  mouseX: ReturnType<typeof import("motion/react").useMotionValue<number>>;
  mouseY: ReturnType<typeof import("motion/react").useMotionValue<number>>;
}

export function HeroParallaxProvider({
  children,
  layerValues,
  mouseX,
  mouseY,
}: HeroParallaxProviderProps) {
  const value = {
    layerValues,
    mouseX,
    mouseY,
  };

  return (
    <HeroParallaxContext.Provider value={value}>
      {children}
    </HeroParallaxContext.Provider>
  );
}

export function useHeroParallaxValues() {
  const context = useContext(HeroParallaxContext);
  if (!context) {
    throw new Error("useHeroParallaxValues must be used within HeroParallaxProvider");
  }
  return context;
}