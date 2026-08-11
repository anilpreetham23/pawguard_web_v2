"use client";

import { Phone, ArrowRight } from "lucide-react";
import Link from "next/link";

interface EmergencyActionPanelProps {
  variant?: "banner" | "inline" | "compact";
}

export default function EmergencyActionPanel({ variant = "banner" }: EmergencyActionPanelProps) {
  if (variant === "compact") {
    return (
      <Link
        href="/emergency"
        className="inline-flex items-center gap-2 bg-destructive text-white text-xs font-semibold tracking-wider uppercase font-condensed px-4 py-2.5 rounded-btn hover:bg-destructive-hover hover:shadow-md transition-all duration-fast"
      >
        <Phone size={14} className="animate-pulse-soft" />
        Emergency
      </Link>
    );
  }

  if (variant === "inline") {
    return (
      <div className="bg-destructive rounded-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
            <Phone size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white/80 text-xs font-semibold tracking-wider uppercase font-condensed">Emergency</p>
            <p className="text-white font-bold text-xl">1-800-PAW-GUARD</p>
            <p className="text-white/70 text-sm">Available 24/7 — Dispatch within minutes</p>
          </div>
        </div>
        <Link
          href="/emergency"
          className="shrink-0 bg-white text-destructive font-bold text-sm px-6 py-3 rounded-btn hover:bg-white/90 hover:shadow-md transition-all duration-fast inline-flex items-center gap-2"
        >
          Report Now
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <section className="bg-destructive py-section-md lg:py-section-lg px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-50" />
      <div className="max-w-[1280px] mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-grid-lg lg:gap-[var(--space-12)] items-center">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Phone size={18} className="text-white" />
              </div>
              <span className="text-white/80 text-xs font-semibold tracking-widest uppercase font-condensed">
                24/7 Emergency Response
              </span>
            </div>
            <h2 className="text-white font-serif font-bold text-3xl lg:text-4xl leading-tight">
              Dog in immediate danger?
            </h2>
            <p className="text-white/80 text-lg leading-relaxed max-w-[500px]">
              Our emergency response teams operate 24/7. Report a situation and we will dispatch the nearest available unit immediately.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <Link
                href="/emergency"
                className="bg-white text-destructive font-bold text-sm tracking-wider uppercase px-8 py-4 rounded-btn hover:bg-white/90 hover:shadow-lg transition-all duration-fast inline-flex items-center gap-2"
              >
                Report Emergency
                <ArrowRight size={16} />
              </Link>
              <a
                href="tel:1-800-PAW-GUARD"
                className="text-white font-bold text-lg tracking-tight hover:underline underline-offset-4 transition-all duration-fast"
              >
                1-800-PAW-GUARD
              </a>
            </div>
          </div>
          <div className="hidden lg:flex flex-col gap-3">
            <div className="bg-white/10 rounded-glass px-8 py-6 border border-white/10">
              <p className="text-white/60 text-xs font-semibold tracking-wider uppercase font-condensed mb-1">Average Response</p>
              <p className="text-white font-bold text-4xl font-mono">&lt;12 min</p>
            </div>
            <p className="text-white/50 text-xs">For critical emergencies</p>
          </div>
        </div>
      </div>
    </section>
  );
}
