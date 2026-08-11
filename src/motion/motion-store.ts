import { create } from "zustand";
import { getRoutePolicy } from "./motion.utils";
import type { MotionTier, RouteType, RoutePolicy } from "./motion.types";

interface MotionStore {
  reducedMotion: boolean;
  motionTier: MotionTier;
  scrollY: number;
  scrollProgress: number;
  scrollDirection: "up" | "down";
  scrollVelocity: number;
  lenisReady: boolean;
  activeRoute: RouteType;
  ready: boolean;
  /** Global loader overlay is visible while true (initial load + route changes). */
  loading: boolean;
  /** True while a lazy route chunk is still being fetched (set by Suspense fallback). */
  pendingChunk: boolean;

  setReducedMotion: (value: boolean) => void;
  setMotionTier: (tier: MotionTier) => void;
  setScrollY: (y: number) => void;
  setScrollProgress: (p: number) => void;
  setScrollDirection: (dir: "up" | "down") => void;
  setScrollVelocity: (v: number) => void;
  setScrollState: (state: { scrollY?: number; scrollProgress?: number; scrollDirection?: "up" | "down"; scrollVelocity?: number }) => void;
  setLenisReady: (ready: boolean) => void;
  setActiveRoute: (route: RouteType) => void;
  setReady: (ready: boolean) => void;
  setLoading: (loading: boolean) => void;
  setPendingChunk: (pending: boolean) => void;

  getPolicy: () => RoutePolicy;
}

export const useMotionStore = create<MotionStore>((set, get) => ({
  reducedMotion: false,
  motionTier: "full",
  scrollY: 0,
  scrollProgress: 0,
  scrollDirection: "down",
  scrollVelocity: 0,
  lenisReady: false,
  activeRoute: "homepage",
  ready: false,
  loading: false,
  pendingChunk: false,

  setReducedMotion: (value) => {
    set({ reducedMotion: value, motionTier: value ? "reduced" : "full" });
  },

  setMotionTier: (tier) => set({ motionTier: tier }),

  setScrollY: (y) => set({ scrollY: y }),

  setScrollProgress: (p) => set({ scrollProgress: p }),

  setScrollDirection: (dir) => set({ scrollDirection: dir }),

  setScrollVelocity: (v) => set({ scrollVelocity: v }),

  setScrollState: (state) => {
    set(state);
  },

  setLenisReady: (ready) => {
    set({ lenisReady: ready });
  },

  setActiveRoute: (route) => set({ activeRoute: route }),

  setReady: (ready) => set({ ready }),

  setLoading: (loading) => set({ loading }),

  setPendingChunk: (pending) => set({ pendingChunk: pending }),

  getPolicy: () => {
    const { activeRoute, reducedMotion } = get();
    const policy = getRoutePolicy(activeRoute);
    if (reducedMotion) {
      return { ...policy, smoothScroll: "native", parallax: false, textSplit: false };
    }
    return policy;
  },
}));
