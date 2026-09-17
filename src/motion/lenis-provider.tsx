"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { useMotionStore } from "./motion-store";
import { setLenis } from "./lenis-instance";
import { ensureScrollUnlocked } from "./scroll";

interface LenisProviderProps {
  children: ReactNode;
}

function updateScrollTriggerIfLoaded() {
  if (typeof window !== "undefined") {
    const st = (window as any).ScrollTrigger || (window as any).gsap?.ScrollTrigger;
    if (st?.update) {
      st.update();
    }
  }
}

function refreshScrollTriggerIfLoaded() {
  if (typeof window !== "undefined") {
    const st = (window as any).ScrollTrigger || (window as any).gsap?.ScrollTrigger;
    if (st?.refresh) {
      st.refresh();
    }
  }
}

export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafCancelRef = useRef<(() => void) | null>(null);
  const resizeFnRef = useRef<(() => void) | null>(null);
  const scrollFnRef = useRef<((e: { scroll: number; velocity: number; direction: number; limit: number }) => void) | null>(null);
  const fontRefreshRef = useRef<(() => void) | null>(null);
  const videoRefreshRef = useRef<(() => void) | null>(null);
  const imageObsRef = useRef<ResizeObserver | null>(null);
  const realScrollSyncRef = useRef<((() => void) | null) | null>(null);
  const reducedMotion = useMotionStore((s) => s.reducedMotion);
  const setLenisReady = useMotionStore((s) => s.setLenisReady);
  const setScrollState = useMotionStore((s) => s.setScrollState);
  const getPolicy = useMotionStore((s) => s.getPolicy);

  useEffect(() => {
    const policy = getPolicy();
    const useLenis = !reducedMotion && policy.smoothScroll !== "native";

    if (!useLenis) {
      if (lenisRef.current) {
        const l = lenisRef.current;
        if (rafCancelRef.current) {
          rafCancelRef.current();
          rafCancelRef.current = null;
        }
        if (resizeFnRef.current) {
          window.removeEventListener("resize", resizeFnRef.current);
          resizeFnRef.current = null;
        }
        if (scrollFnRef.current) {
          l.off("scroll", scrollFnRef.current);
          scrollFnRef.current = null;
        }
        if (fontRefreshRef.current) {
          document.fonts.removeEventListener("done", fontRefreshRef.current);
          fontRefreshRef.current = null;
        }
        if (videoRefreshRef.current) {
          videoRefreshRef.current();
          videoRefreshRef.current = null;
        }
        if (imageObsRef.current) {
          imageObsRef.current.disconnect();
          imageObsRef.current = null;
        }
        l.destroy();
        lenisRef.current = null;
        setLenis(null);
      }

      setLenisReady(true);
      let lastY = window.scrollY;
      let lastTime = performance.now();
      let raf = 0;

      function update() {
        const y = window.scrollY;
        const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        const now = performance.now();
        const dt = Math.max(now - lastTime, 16);
        setScrollState({
          scrollY: y,
          scrollProgress: Math.min(1, y / max),
          scrollDirection: y >= lastY ? "down" : "up",
          scrollVelocity: Math.abs(y - lastY) / dt,
        });
        updateScrollTriggerIfLoaded();
        lastY = y;
        lastTime = now;
      }

      function onScroll() {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(update);
      }

      window.addEventListener("scroll", onScroll, { passive: true });
      update();

      return () => {
        window.removeEventListener("scroll", onScroll);
        cancelAnimationFrame(raf);
        setLenisReady(false);
      };
    }

    if (lenisRef.current) {
      return undefined;
    }

    const params = policy.scrollParams ?? { lerp: 0.09, duration: 1.2, wheelMultiplier: 1, touchMultiplier: 1 };

    const lenis = new Lenis({
      duration: params.duration ?? 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: params.wheelMultiplier ?? 1,
      touchMultiplier: params.touchMultiplier ?? 1,
      syncTouch: true,
    });

    lenisRef.current = lenis;
    setLenis(lenis);
    setLenisReady(true);
    ensureScrollUnlocked();

    const onRealScroll = () => {
      const real = window.scrollY;
      const diff = Math.abs(real - lenis.scroll);
      if (diff > 50 || (real === 0 && lenis.scroll > 10)) {
        lenis.scrollTo(real, { immediate: true, force: true, programmatic: true });
        return;
      }
      if (lenis.isScrolling) return;
      if (diff > 10) {
        lenis.scrollTo(real, { immediate: true, force: true, programmatic: true });
      }
    };
    window.addEventListener("scroll", onRealScroll, { passive: true });
    realScrollSyncRef.current = onRealScroll;

    let lastKnownMax = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
    const dimensionObs = new ResizeObserver(() => {
      const realMax = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
      if (Math.abs(realMax - lastKnownMax) > 2) {
        lastKnownMax = realMax;
        lenis.resize();
      }
    });
    dimensionObs.observe(document.documentElement);
    if (document.body) {
      dimensionObs.observe(document.body);
    }
    const mainContent = document.getElementById("main-content") || document.querySelector("main");
    if (mainContent) {
      dimensionObs.observe(mainContent);
    }

    function onLenisScroll(e: { scroll: number; velocity: number; direction: number; limit: number }) {
      const max = e.limit;
      setScrollState({
        scrollY: e.scroll,
        scrollVelocity: e.velocity,
        scrollDirection: e.direction === 1 ? "down" : "up",
        scrollProgress: max > 0 ? Math.min(1, e.scroll / max) : 0,
      });
      updateScrollTriggerIfLoaded();
    }

    scrollFnRef.current = onLenisScroll;
    lenis.on("scroll", onLenisScroll);

    let rafId = 0;

    function loop(now: number) {
      lenis.raf(now);
      const realMax = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
      if (Math.abs(realMax - lenis.limit) > 2) {
        lenis.resize();
      }
      rafId = window.requestAnimationFrame(loop);
    }

    rafId = window.requestAnimationFrame(loop);

    rafCancelRef.current = () => {
      window.cancelAnimationFrame(rafId);
    };

    let resizeRaf = 0;
    function onResize() {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        lenis.resize();
        refreshScrollTriggerIfLoaded();
      });
    }

    resizeFnRef.current = onResize;
    window.addEventListener("resize", onResize);

    let refreshTimeout: ReturnType<typeof setTimeout> | null = null;
    const debouncedRefresh = () => {
      if (refreshTimeout) clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(() => {
        lenis.resize();
        refreshScrollTriggerIfLoaded();
        refreshTimeout = null;
      }, 300);
    };

    debouncedRefresh();

    function onFontReady() {
      debouncedRefresh();
    }
    fontRefreshRef.current = onFontReady;
    document.fonts.ready.then(onFontReady);

    const heroVideo = document.querySelector("video");
    if (heroVideo) {
      function onVideoReady() {
        debouncedRefresh();
      }
      heroVideo.addEventListener("loadedmetadata", onVideoReady);
      videoRefreshRef.current = () => {
        heroVideo.removeEventListener("loadedmetadata", onVideoReady);
      };
    }

    const heroImg = document.querySelector(".hero-scene img");
    if (heroImg) {
      const obs = new ResizeObserver(() => {
        debouncedRefresh();
      });
      obs.observe(heroImg);
      imageObsRef.current = obs;
    }

    return () => {
      if (refreshTimeout) clearTimeout(refreshTimeout);
      cancelAnimationFrame(resizeRaf);
      window.removeEventListener("resize", resizeFnRef.current!);
      resizeFnRef.current = null;
      dimensionObs.disconnect();
      if (realScrollSyncRef.current) {
        window.removeEventListener("scroll", realScrollSyncRef.current);
        realScrollSyncRef.current = null;
      }
      if (rafCancelRef.current) {
        rafCancelRef.current();
        rafCancelRef.current = null;
      }
      if (scrollFnRef.current) {
        lenis.off("scroll", scrollFnRef.current);
        scrollFnRef.current = null;
      }
      if (fontRefreshRef.current) {
        document.fonts.removeEventListener("done", fontRefreshRef.current);
        fontRefreshRef.current = null;
      }
      if (videoRefreshRef.current) {
        videoRefreshRef.current();
        videoRefreshRef.current = null;
      }
      if (imageObsRef.current) {
        imageObsRef.current.disconnect();
        imageObsRef.current = null;
      }
      lenis.destroy();
      lenisRef.current = null;
      setLenis(null);
      setLenisReady(false);
    };
  }, [reducedMotion]);

  return <>{children}</>;
}