import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function registerGsapPlugins(): void {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger);
  // Prevent GSAP's ticker from accumulating lag after heavy frames, which
  // otherwise makes scrubbed ScrollTrigger tweens feel jumpy during scroll.
  gsap.ticker.lagSmoothing(0);
  registered = true;
}
