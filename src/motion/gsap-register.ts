/**
 * Dynamic GSAP Loader & Plugin Registry
 * Prevents GSAP from being statically included in the shared root initial JS bundle.
 */

export async function getGsap() {
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
  ]);
  gsap.registerPlugin(ScrollTrigger);
  gsap.ticker.lagSmoothing(0);
  if (typeof window !== "undefined") {
    (window as any).gsap = gsap;
    (window as any).ScrollTrigger = ScrollTrigger;
  }
  return { gsap, ScrollTrigger };
}

export function registerGsapPlugins(): void {
  // Fire-and-forget background async loader if triggered explicitly
  if (typeof window !== "undefined") {
    getGsap().catch(() => {});
  }
}
