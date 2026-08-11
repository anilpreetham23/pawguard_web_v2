import { ease, routePolicy } from "./motion.config";
import type { EasingArray, MotionTier, RouteType, RoutePolicy } from "./motion.types";

let reducedMotionQuery: MediaQueryList | null = null;

function getReducedMotionQuery(): MediaQueryList {
  if (typeof window === "undefined") {
    return { matches: false } as MediaQueryList;
  }
  if (!reducedMotionQuery) {
    reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  }
  return reducedMotionQuery;
}

export function prefersReducedMotion(): boolean {
  return getReducedMotionQuery().matches;
}

export function getMotionTier(preference?: MotionTier): MotionTier {
  if (preference) return preference;
  if (prefersReducedMotion()) return "reduced";
  return "full";
}

export function getEffectiveDuration(baseMs: number, tier: MotionTier): number {
  if (tier === "none") return 0;
  if (tier === "reduced") return Math.min(baseMs, 200);
  return baseMs;
}

export function getEffectiveEasing(preferred: EasingArray, tier: MotionTier): EasingArray {
  if (tier === "none" || tier === "reduced") return ease.fast;
  return preferred;
}

export function clampDuration(ms: number, min = 0, max = 2000): number {
  return Math.max(min, Math.min(max, ms));
}

export function getRoutePolicy(route: RouteType): RoutePolicy {
  return routePolicy[route] ?? routePolicy.marketing;
}

export function onReducedMotionChange(handler: (matches: boolean) => void): () => void {
  const mql = getReducedMotionQuery();
  const listener = (e: MediaQueryListEvent) => handler(e.matches);
  mql.addEventListener("change", listener);
  return () => mql.removeEventListener("change", listener);
}
