"use client";

import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { routeTransition } from "@/motion/motion.config";
import { useMotionStore } from "@/motion/motion-store";
import type { RouteType } from "@/motion/motion.types";
import { useEffect } from "react";

import { ensureScrollUnlocked, refreshScroll } from "@/motion/scroll";

const routeToTransition: Record<RouteType, keyof typeof routeTransition> = {
  homepage: "default",
  marketing: "warm",
  emergency: "emergency",
  form: "minimal",
  auth: "minimal",
};

function getRouteType(pathname: string): RouteType {
  if (pathname === "/") return "homepage";
  if (pathname === "/emergency") return "emergency";
  if (["/adopt", "/about", "/stories"].includes(pathname)) return "marketing";
  if (["/contact", "/volunteer", "/donate"].includes(pathname)) return "form";
  return "marketing";
}

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const motionTier = useMotionStore((s) => s.motionTier);
  const setActiveRoute = useMotionStore((s) => s.setActiveRoute);
  const activeRoute = useMotionStore((s) => s.activeRoute);

  useEffect(() => {
    setActiveRoute(getRouteType(pathname));
    ensureScrollUnlocked();
    refreshScroll();
  }, [pathname, setActiveRoute]);

  if (motionTier !== "full") {
    return <>{children}</>;
  }

  const preset = routeTransition[routeToTransition[activeRoute]];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={preset.initial as any}
        animate={preset.animate as any}
        exit={preset.exit as any}
        transition={preset.transition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
