"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMotionStore } from "../../motion";
import { getLenis } from "../../motion/lenis-instance";
import { cn } from "./ui/utils";
import { duration, ease } from "../../motion/motion.config";
import { useEmergencyShortcut } from "../hooks/useEmergencyShortcut";
import TopEmergencyBar from "./TopEmergencyBar";
import { AuthNavControls, AuthMobileControls } from "./AuthNavControls";


const NAV_LINKS = [
  { label: "Home",      to: "/" },
  { label: "Adopt",     to: "/adopt" },
  { label: "Veterinary", to: "/veterinary" },
  { label: "Lost & Found", to: "/lost-found" },
  { label: "Volunteer", to: "/volunteer" },
  { label: "Guides",    to: "/education" },
  { label: "About",     to: "/about" },
  { label: "Stories",   to: "/stories" },
  { label: "Contact",   to: "/contact" },
];

// Adaptive glass constants
const GLASS_BASE   = "rgba(248,245,239,0.72)";
const GLASS_SCROLL = "rgba(248,245,239,0.95)";
const TRANSITION   = "background 350ms cubic-bezier(.22,1,.36,1), box-shadow 350ms cubic-bezier(.22,1,.36,1), border-color 350ms cubic-bezier(.22,1,.36,1)";
const TRANSITION_REDUCED = undefined;

export default function Navbar() {
  const [menuOpen,        setMenuOpen]        = useState(false);
  const [scrolled,        setScrolled]        = useState(false);
  const [hidden,          setHidden]          = useState(false);

  const pathname      = usePathname();
  const menuRef       = useRef<HTMLDivElement>(null);
  const toggleRef     = useRef<HTMLButtonElement>(null);
  const lastScrollRef = useRef(0);
  const scrolledRef   = useRef(false);
  const hiddenRef     = useRef(false);

  const ready          = useMotionStore((s) => s.ready);
  const reduced        = useMotionStore((s) => s.motionTier) !== "full";
  useEmergencyShortcut();

  // ── Keyboard trap ──────────────────────────────────────────────────────────
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!menuOpen || !menuRef.current) return;
    const focusable = menuRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.key === "Tab") {
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    if (e.key === "Escape") { setMenuOpen(false); toggleRef.current?.focus(); }
  }, [menuOpen]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // ── Body scroll lock ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!menuOpen) return;
    const docEl = document.documentElement;
    document.body.style.overflow = "hidden";
    docEl.style.overflow = "hidden";
    docEl.style.overscrollBehavior = "none";
    const lenis = getLenis(); lenis?.stop();
    const t = setTimeout(() => menuRef.current?.querySelector<HTMLElement>("a")?.focus(), 80);
    return () => {
      document.body.style.overflow = "";
      docEl.style.overflow = "";
      docEl.style.overscrollBehavior = "";
      getLenis()?.start();
      clearTimeout(t);
    };
  }, [menuOpen]);

  // ── Scroll state (imperative subscribe — avoid per-frame re-renders) ──────
  useEffect(() => {
    const applyScroll = (scrollY: number, scrollVelocity: number) => {
      const nextScrolled = scrollY > 40;
      if (nextScrolled !== scrolledRef.current) {
        scrolledRef.current = nextScrolled;
        setScrolled(nextScrolled);
      }

      let nextHidden = hiddenRef.current;
      if (scrollY < lastScrollRef.current) {
        nextHidden = false;
      } else if (scrollY > 80 && scrollVelocity > 0.5 && !menuOpen) {
        nextHidden = true;
      }
      if (nextHidden !== hiddenRef.current) {
        hiddenRef.current = nextHidden;
        setHidden(nextHidden);
      }
      lastScrollRef.current = scrollY;
    };

    const { scrollY, scrollVelocity } = useMotionStore.getState();
    applyScroll(scrollY, scrollVelocity);

    const unsubscribe = useMotionStore.subscribe((state) => {
      applyScroll(state.scrollY, state.scrollVelocity);
    });

    return () => unsubscribe();
  }, [menuOpen]);

  // ── Derived state ──────────────────────────────────────────────────────────
  const trans        = reduced ? TRANSITION_REDUCED : TRANSITION;

  // Glass background: 72% at top, 95% after scroll
  const glassBg      = scrolled ? GLASS_SCROLL : GLASS_BASE;
  // Border + shadow only after scroll
  const glassBorder  = scrolled
    ? "1px solid rgba(255,255,255,0.22)"
    : "1px solid transparent";
  const glassShadow  = scrolled
    ? "0 4px 20px rgba(0,0,0,0.04)"
    : "none";

  return (
    <>
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[var(--z-skip)] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-btn focus:text-sm font-semibold"
      >
        Skip to main content
      </a>

      <motion.div
        className="fixed top-0 left-0 right-0 z-[var(--z-header)]"
        initial={reduced ? false : { y: -24, opacity: 0 }}
        animate={reduced ? undefined : ready ? { y: 0, opacity: 1 } : { y: -24, opacity: 0 }}
        transition={{ duration: 0.6, ease: ease.gentle, delay: 0.12 }}
      >
        {/* ── Emergency top bar — pinned at top, shrinks on scroll, never hides ── */}
        <TopEmergencyBar scrolled={scrolled} />

        <motion.header
          className="relative"
          animate={{ y: hidden && !menuOpen ? -120 : 0 }}
          transition={{ duration: duration.scroll / 1000, ease: ease.standard }}
        >
          {/* ── Adaptive gradient overlay (Layer 1) ─────────────────────── */}
          {/* Prevents bright video frames from washing out text */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, rgba(248,245,239,0.22) 0%, rgba(248,245,239,0.72) 100%)",
            }}
          />

          {/* ── Glass panel (Layer 2) ────────────────────────────────────── */}
          <div
            className="relative"
            style={{
              background:           glassBg,
              backdropFilter:       "blur(16px) saturate(170%)",
              WebkitBackdropFilter: "blur(16px) saturate(170%)",
              borderBottom:         glassBorder,
              boxShadow:            glassShadow,
              transition:           trans,
            }}
          >
            {/* ── Layer 3: Navigation content ─────────────────────────── */}
            <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 h-[var(--navbar-height)] flex md:grid md:grid-cols-[1fr_auto_1fr] items-center justify-between gap-4">

              {/* Logo — left column */}
              <Link
                href="/"
                className="group flex items-center gap-3 shrink-0 origin-left transition-transform duration-fast ease-gentle relative z-10"
                aria-label="PawGuard home"
              >
                <div className="relative w-8 h-8 bg-primary rounded-lg flex items-center justify-center overflow-hidden group-hover:shadow-md transition-shadow duration-fast">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M10 1C7.5 1 5.5 3 5.5 5.5C5.5 6.8 6.1 7.9 7 8.6C5.2 9.3 4 11 4 13C4 15.8 6.2 18 9 18H11C13.8 18 16 15.8 16 13C16 11 14.8 9.3 13 8.6C13.9 7.9 14.5 6.8 14.5 5.5C14.5 3 12.5 1 10 1Z" fill="white" />
                  </svg>
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-gentle"
                  />
                </div>
                <span className="font-bold text-primary text-xl tracking-tight">PawGuard</span>
              </Link>

              {/* Desktop nav links — center column, mathematically centered */}
              <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
                {NAV_LINKS.map(({ label, to }) => {
                  const active = pathname === to;
                  return (
                    <Link
                      key={to}
                      href={to}
                      data-analytics-nav={label.toLowerCase()}
                      className={cn(
                        "group relative px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-[200ms] ease-gentle",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring/60",
                      )}
                      style={{
                        color:                  active ? "var(--primary)" : "var(--foreground)",
                        letterSpacing:          "0.02em",
                        WebkitFontSmoothing:    "subpixel-antialiased",
                        background:             active ? "rgba(37,99,235,0.08)" : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        if (!active) {
                          el.style.background = "rgba(37,99,235,0.05)";
                          el.style.color      = "var(--primary)";
                        }
                        const underline = el.querySelector(".nav-hover-underline") as HTMLElement;
                        if (underline) underline.style.transform = "scaleX(1)";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        if (!active) {
                          el.style.background = "transparent";
                          el.style.color      = "var(--foreground)";
                        }
                        const underline = el.querySelector(".nav-hover-underline") as HTMLElement;
                        if (underline) underline.style.transform = "scaleX(0)";
                      }}
                    >
                      {label}
                      {/* Hover underline — grows from center on hover */}
                      <span
                        aria-hidden="true"
                        className="nav-hover-underline absolute -bottom-px left-3 right-3 h-[1.5px] rounded-full bg-primary/40 origin-center"
                        style={{ transform: "scaleX(0)", transition: "transform 200ms ease" }}
                      />
                      {/* Active underline — always visible */}
                      {active && (
                        <motion.span
                          layoutId="nav-active-underline"
                          className="absolute -bottom-px left-3 right-3 h-[2px] rounded-full bg-primary"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Right column — empty, balances logo for true center */}
              <div className="hidden md:flex items-center justify-end h-full">
                <AuthNavControls />
              </div>

              {/* Mobile hamburger — visible only on mobile */}
              <button
                ref={toggleRef}
                className="md:hidden ml-auto md:ml-0 p-2 rounded-btn hover:bg-secondary transition-all duration-fast ease-gentle min-h-[44px] min-w-[44px] flex items-center justify-center relative z-10"
                style={{ color: "var(--foreground)" }}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu-panel"
              >
                {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
              </button>
            </div>
          </div>
        </motion.header>

        {/* ── Mobile navigation panel ──────────────────────────────────────── */}
        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-[var(--z-drawer)] bg-black/30 backdrop-blur-sm md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: duration.fast / 1000 }}
                onClick={() => setMenuOpen(false)}
                aria-hidden="true"
              />
              <motion.div
                id="mobile-menu-panel"
                ref={menuRef}
                className="fixed left-0 right-0 top-[calc(var(--navbar-height)+var(--top-strip-compact-height))] bottom-0 z-[var(--z-drawer)] md:hidden bg-background/90 backdrop-blur-xl border-t border-border flex flex-col overflow-hidden"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: duration.scroll / 1000, ease: ease.gentle }}
              >
                <nav aria-label="Mobile navigation" className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 py-6 flex flex-col gap-1">
                  {NAV_LINKS.map(({ label, to }, i) => {
                    const active = pathname === to;
                    return (
                      <motion.div
                        key={to}
                        initial={reduced ? false : { opacity: 0, x: 18 }}
                        animate={reduced ? undefined : { opacity: 1, x: 0 }}
                        transition={{ delay: reduced ? 0 : 0.05 + i * 0.05, duration: duration.fast / 1000, ease: ease.gentle }}
                      >
                        <Link
                          href={to}
                          onClick={() => setMenuOpen(false)}
                          className={cn(
                            "flex items-center justify-between min-h-[52px] px-4 rounded-card text-base font-semibold tracking-normal transition-colors duration-fast",
                            active ? "text-primary bg-primary/8" : "text-foreground hover:bg-secondary/60",
                          )}
                        >
                          {label}
                          {active && (
                            <motion.span
                              layoutId="mobile-active"
                              className="h-[2px] w-6 rounded-full bg-primary"
                              style={{ boxShadow: "0 0 8px rgba(0,35,111,0.45)" }}
                              transition={{ type: "spring", stiffness: 380, damping: 32 }}
                            />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                <motion.div
                  className="px-6 py-4 border-t border-border bg-background/60 flex flex-col gap-2 shrink-0"
                  initial={reduced ? false : { opacity: 0, y: 12 }}
                  animate={reduced ? undefined : { opacity: 1, y: 0 }}
                  transition={{ delay: reduced ? 0 : 0.35, duration: duration.fast / 1000, ease: ease.gentle }}
                >
                  <AuthMobileControls onNavigate={() => setMenuOpen(false)} />
                  <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
                    <span className="tracking-wide">
                      Emergency and Donate actions are in the top bar ↑
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
