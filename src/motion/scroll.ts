import { getLenis } from "./lenis-instance";

type ScrollLogicalBlock = "start" | "center" | "end" | "nearest" | "contain";
type ScrollLogicalInline = "start" | "center" | "end" | "nearest" | "contain";

interface ScrollOptions {
  offset?: number;
  duration?: number;
  easing?: (t: number) => number;
  immediate?: boolean;
  block?: ScrollLogicalBlock;
  inline?: ScrollLogicalInline;
}

export function scrollTo(target: number | Element | string, options?: ScrollOptions): void {
  const lenis = getLenis();
  if (typeof target === "number") {
    if (lenis) {
      lenis.scrollTo(target, { duration: options?.duration ?? 1.2, easing: options?.easing, immediate: options?.immediate });
    } else {
      window.scrollTo({ top: target, behavior: "smooth" });
    }
    return;
  }
  if (typeof target === "string") {
    const el = document.querySelector(target);
    if (el) {
      scrollToElement(el, options);
    }
    return;
  }
  scrollToElement(target, options);
}

function scrollToElement(el: any, options?: ScrollOptions): void {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(el, {
      offset: options?.offset ?? 0,
      duration: options?.duration ?? 1.2,
      easing: options?.easing,
      immediate: options?.immediate,
    });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: options?.block ?? "start", inline: options?.inline ?? "nearest" });
  }
}

export function scrollToTop(options?: ScrollOptions): void {
  scrollTo(0, options);
}

export function scrollToBottom(options?: ScrollOptions): void {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(document.documentElement.scrollHeight, {
      duration: options?.duration ?? 1.2,
      easing: options?.easing,
    });
  } else {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  }
}

export function scrollToSelector(selector: string, options?: ScrollOptions): void {
  scrollTo(selector, options);
}

export function cancelScroll(): void {
  const lenis = getLenis();
  if (lenis) {
    lenis.stop();
  }
}

export function resumeScroll(): void {
  const lenis = getLenis();
  if (lenis) {
    lenis.start();
  }
}

// Guarantees nothing can leave the page stuck: clears any lingering
// body overflow lock and restarts Lenis if it was stopped. Called after
// route transitions and whenever a fresh Lenis instance is created.
export function ensureScrollUnlocked(): void {
  document.body.style.overflow = "";
  const lenis = getLenis();
  if (lenis) {
    lenis.start();
  }
}

export function getScrollPosition(): number {
  const lenis = getLenis();
  return lenis ? lenis.scroll : window.scrollY;
}

export function getScrollProgress(): number {
  const lenis = getLenis();
  if (lenis) {
    const max = lenis.limit;
    return max > 0 ? Math.min(1, lenis.scroll / max) : 0;
  }
  const y = window.scrollY;
  const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  return Math.min(1, y / max);
}

export function refreshScroll(): void {
  const lenis = getLenis();
  if (lenis) {
    lenis.resize();
  }
}
