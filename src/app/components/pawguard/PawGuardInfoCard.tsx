"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";

export type InfoCardVisualType =
  | "health-guarantee"
  | "adjustment-period"
  | "lifetime-support"
  | "verified-clinics"
  | "full-circle-care"
  | "emergency-care";

export interface PawGuardInfoCardProps {
  icon: LucideIcon;
  title: string;
  desc: string;
  visualType: InfoCardVisualType;
  accentVariant?: "emerald" | "blue" | "indigo" | "sky" | "amber";
  badgeText?: string;
  className?: string;
}

const ACCENT_STYLES = {
  emerald: {
    iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    visualBg: "from-emerald-500/10 via-teal-500/5 to-emerald-600/10 border-emerald-500/20",
    badgeBg: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/60",
    accentFill: "#10B981",
  },
  blue: {
    iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    visualBg: "from-blue-500/10 via-sky-500/5 to-blue-600/10 border-blue-500/20",
    badgeBg: "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200/60",
    accentFill: "#3B82F6",
  },
  indigo: {
    iconBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    visualBg: "from-indigo-500/10 via-purple-500/5 to-indigo-600/10 border-indigo-500/20",
    badgeBg: "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200/60",
    accentFill: "#6366F1",
  },
  sky: {
    iconBg: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    visualBg: "from-sky-500/10 via-teal-500/5 to-sky-600/10 border-sky-500/20",
    badgeBg: "bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200/60",
    accentFill: "#0EA5E9",
  },
  amber: {
    iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    visualBg: "from-amber-500/10 via-orange-500/5 to-amber-600/10 border-amber-500/20",
    badgeBg: "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/60",
    accentFill: "#F59E0B",
  },
};

function CardVisual({ type }: { type: InfoCardVisualType }) {
  switch (type) {
    case "health-guarantee":
      return (
        <svg viewBox="0 0 160 120" className="w-full h-full object-contain" fill="none">
          {/* Subtle background paw/health aura */}
          <circle cx="80" cy="60" r="48" fill="#10B981" fillOpacity="0.08" />
          <circle cx="80" cy="60" r="34" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.3" />
          
          {/* Health Shield */}
          <path
            d="M80 25 C96 25 110 32 110 32 V62 C110 82 80 97 80 97 C80 97 50 82 50 62 V32 C50 32 64 25 80 25 Z"
            fill="url(#healthShieldGrad)"
            stroke="#10B981"
            strokeWidth="2"
          />
          {/* Shield Inner Cross */}
          <path d="M80 44 V68 M68 56 H92" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />

          {/* Happy Dog Silhouette Bubble */}
          <g transform="translate(104, 30)">
            <circle cx="16" cy="16" r="16" fill="#1E3A8A" />
            <path d="M10 14 C10 10 22 10 22 14 C22 20 10 20 10 14 Z" fill="#FFFFFF" />
            <circle cx="13" cy="14" r="1.5" fill="#1E3A8A" />
            <circle cx="19" cy="14" r="1.5" fill="#1E3A8A" />
            {/* Ear */}
            <path d="M8 10 C6 6 10 5 12 9 Z" fill="#FFFFFF" />
          </g>

          {/* Verified Check Badge */}
          <circle cx="56" cy="74" r="12" fill="#10B981" />
          <path d="M51 74 L55 78 L62 70" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          <defs>
            <linearGradient id="healthShieldGrad" x1="50" y1="25" x2="110" y2="97" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34D399" />
              <stop offset="1" stopColor="#059669" />
            </linearGradient>
          </defs>
        </svg>
      );

    case "adjustment-period":
      return (
        <svg viewBox="0 0 160 120" className="w-full h-full object-contain" fill="none">
          {/* Background Aura */}
          <circle cx="80" cy="60" r="48" fill="#3B82F6" fillOpacity="0.08" />
          
          {/* Calendar Card */}
          <rect x="42" y="30" width="76" height="64" rx="12" fill="#FFFFFF" stroke="#60A5FA" strokeWidth="2" />
          <path d="M42 42 H118" stroke="#93C5FD" strokeWidth="1.5" />
          <rect x="42" y="30" width="76" height="14" rx="12" fill="#2563EB" />
          {/* Calendar Binder Rings */}
          <rect x="56" y="24" width="4" height="10" rx="2" fill="#1D4ED8" />
          <rect x="100" y="24" width="4" height="10" rx="2" fill="#1D4ED8" />

          {/* Large "30" Indicator */}
          <text x="80" y="74" textAnchor="middle" fill="#1E3A8A" fontSize="24" fontWeight="800" fontFamily="sans-serif">
            30
          </text>
          <text x="80" y="86" textAnchor="middle" fill="#2563EB" fontSize="9" fontWeight="700" letterSpacing="1.2">
            DAYS
          </text>

          {/* Refresh / Adjustment Arrows Loop */}
          <g transform="translate(100, 68)">
            <circle cx="16" cy="16" r="16" fill="#3B82F6" />
            <path d="M11 16 A5 5 0 1 1 20 19 M20 19 L17 19 M20 19 L20 16" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* Soft Heart Paw Badge */}
          <circle cx="48" cy="74" r="11" fill="#F43F5E" />
          <path d="M48 78 C48 78 43 74 43 71 C43 69.5 44.5 68 46 68 C47 68 47.7 68.6 48 69.2 C48.3 68.6 49 68 50 68 C51.5 68 53 69.5 53 71 C53 74 48 78 48 78 Z" fill="#FFFFFF" />
        </svg>
      );

    case "lifetime-support":
      return (
        <svg viewBox="0 0 160 120" className="w-full h-full object-contain" fill="none">
          <circle cx="80" cy="60" r="48" fill="#6366F1" fillOpacity="0.08" />

          {/* Shield of Lifetime Care */}
          <path
            d="M80 26 C94 26 106 31 106 31 V60 C106 78 80 92 80 92 C80 92 54 78 54 60 V31 C54 31 66 26 80 26 Z"
            fill="url(#lifetimeGrad)"
            stroke="#4F46E5"
            strokeWidth="2"
          />

          {/* Caring Paw in Hand Motif */}
          <path
            d="M72 68 C72 68 76 60 80 60 C84 60 88 68 88 68 C92 68 96 74 94 80 C92 84 80 84 80 84 C80 84 68 84 66 80 C64 74 68 68 72 68 Z"
            fill="#FFFFFF"
          />
          <circle cx="80" cy="52" r="4.5" fill="#FFFFFF" />
          <circle cx="72" cy="55" r="3" fill="#FFFFFF" />
          <circle cx="88" cy="55" r="3" fill="#FFFFFF" />

          {/* 24/7 Helpline Badge */}
          <g transform="translate(102, 28)">
            <rect x="0" y="0" width="34" height="20" rx="10" fill="#1E3A8A" stroke="#818CF8" strokeWidth="1.5" />
            <text x="17" y="13" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="800" fontFamily="sans-serif">
              24/7
            </text>
          </g>

          {/* Heart Chat Bubble */}
          <g transform="translate(32, 54)">
            <circle cx="14" cy="14" r="14" fill="#6366F1" />
            <path d="M14 19 C14 19 9 15.5 9 12.5 C9 11 10.2 9.8 11.7 9.8 C12.6 9.8 13.4 10.3 14 11 C14.6 10.3 15.4 9.8 16.3 9.8 C17.8 9.8 19 11 19 12.5 C19 15.5 14 19 14 19 Z" fill="#FFFFFF" />
          </g>

          <defs>
            <linearGradient id="lifetimeGrad" x1="54" y1="26" x2="106" y2="92" gradientUnits="userSpaceOnUse">
              <stop stopColor="#818CF8" />
              <stop offset="1" stopColor="#4F46E5" />
            </linearGradient>
          </defs>
        </svg>
      );

    case "verified-clinics":
      return (
        <svg viewBox="0 0 160 120" className="w-full h-full object-contain" fill="none">
          <circle cx="80" cy="60" r="48" fill="#10B981" fillOpacity="0.08" />

          {/* Clinic Building Silhouette */}
          <rect x="48" y="44" width="64" height="50" rx="8" fill="#FFFFFF" stroke="#10B981" strokeWidth="2" />
          <path d="M48 44 L80 24 L112 44" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Clinic Medical Cross */}
          <rect x="74" y="52" width="12" height="24" rx="2" fill="#10B981" />
          <rect x="68" y="58" width="24" height="12" rx="2" fill="#10B981" />

          {/* Doors */}
          <rect x="73" y="78" width="14" height="16" rx="2" fill="#1E3A8A" />

          {/* Official PawGuard Verified Seal */}
          <g transform="translate(98, 30)">
            <circle cx="16" cy="16" r="16" fill="#059669" />
            <circle cx="16" cy="16" r="13" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="2 2" />
            <path d="M11 16 L15 20 L22 12" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* Small Star Accents */}
          <path d="M44 32 L46 36 L50 36 L47 39 L48 43 L44 40 L40 43 L41 39 L38 36 L42 36 Z" fill="#F59E0B" />
        </svg>
      );

    case "full-circle-care":
      return (
        <svg viewBox="0 0 160 120" className="w-full h-full object-contain" fill="none">
          <circle cx="80" cy="60" r="48" fill="#0EA5E9" fillOpacity="0.08" />

          {/* 360 Full Circle Track */}
          <circle cx="80" cy="60" r="38" stroke="url(#fullCircleGrad)" strokeWidth="3" strokeDasharray="180 30" strokeLinecap="round" />

          {/* Central Pet & Stethoscope Emblem */}
          <circle cx="80" cy="60" r="26" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />

          {/* Syringe / Vaccine Motif */}
          <g transform="translate(68, 48)">
            <rect x="8" y="4" width="8" height="16" rx="2" fill="#38BDF8" />
            <path d="M12 0 V4 M12 20 V24" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
            <line x1="8" y1="9" x2="16" y2="9" stroke="#FFFFFF" strokeWidth="1.5" />
            <line x1="8" y1="14" x2="16" y2="14" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>

          {/* Stethoscope Arc */}
          <path d="M52 64 C52 78 64 84 80 84 C96 84 108 78 108 64" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="108" cy="64" r="4" fill="#0EA5E9" />

          {/* Top Heart Badge */}
          <circle cx="80" cy="22" r="10" fill="#EC4899" />
          <path d="M80 26 C80 26 76 23 76 20.5 C76 19 77.2 18 78.5 18 C79.3 18 80 18.5 80 19 C80 18.5 80.7 18 81.5 18 C82.8 18 84 19 84 20.5 C84 23 80 26 80 26 Z" fill="#FFFFFF" />

          <defs>
            <linearGradient id="fullCircleGrad" x1="40" y1="20" x2="120" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38BDF8" />
              <stop offset="0.5" stopColor="#0EA5E9" />
              <stop offset="1" stopColor="#1E3A8A" />
            </linearGradient>
          </defs>
        </svg>
      );

    case "emergency-care":
      return (
        <svg viewBox="0 0 160 120" className="w-full h-full object-contain" fill="none">
          <circle cx="80" cy="60" r="48" fill="#F59E0B" fillOpacity="0.08" />

          {/* Emergency Shield Container */}
          <path
            d="M80 24 C96 24 108 30 108 30 V58 C108 76 80 90 80 90 C80 90 52 76 52 58 V30 C52 30 64 24 80 24 Z"
            fill="url(#emergencyGrad)"
            stroke="#D97706"
            strokeWidth="2"
          />

          {/* Emergency Cross / Beacon */}
          <rect x="74" y="44" width="12" height="26" rx="2" fill="#FFFFFF" />
          <rect x="67" y="51" width="26" height="12" rx="2" fill="#FFFFFF" />

          {/* 24/7 Pill Badge */}
          <g transform="translate(56, 78)">
            <rect x="0" y="0" width="48" height="18" rx="9" fill="#1E3A8A" stroke="#FBBF24" strokeWidth="1.5" />
            <text x="24" y="12" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="800" fontFamily="sans-serif">
              24 / 7
            </text>
          </g>

          {/* Sun & Moon Day/Night Symbol */}
          <g transform="translate(102, 34)">
            <circle cx="14" cy="14" r="14" fill="#1E3A8A" />
            {/* Crescent moon */}
            <path d="M16 8 C12 8 9 11 9 15 C9 19 12 22 16 22 C14.5 21 13.5 19 13.5 17 C13.5 13.5 16 11 19.5 11 C18.5 9 17 8 16 8 Z" fill="#FBBF24" />
          </g>

          {/* Phone Call Waves */}
          <path d="M34 52 C30 57 30 63 34 68" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M28 46 C22 55 22 65 28 74" stroke="#F59E0B" strokeWidth="2" strokeOpacity="0.6" strokeLinecap="round" />

          <defs>
            <linearGradient id="emergencyGrad" x1="52" y1="24" x2="108" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FBBF24" />
              <stop offset="1" stopColor="#D97706" />
            </linearGradient>
          </defs>
        </svg>
      );

    default:
      return null;
  }
}

export function PawGuardInfoCard({
  icon: Icon,
  title,
  desc,
  visualType,
  accentVariant = "emerald",
  badgeText,
  className = "",
}: PawGuardInfoCardProps) {
  const styles = ACCENT_STYLES[accentVariant] || ACCENT_STYLES.emerald;

  return (
    <div
      className={`group relative bg-background dark:bg-slate-900/80 border border-border/80 dark:border-slate-800 rounded-2xl lg:rounded-3xl p-6 sm:p-7 lg:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md hover:border-primary/30 dark:hover:border-primary/40 transition-all duration-300 ease-out h-full overflow-hidden ${className}`}
    >
      {/* Subtle background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* LEFT / MAIN CONTENT */}
      <div className="flex-1 flex flex-col items-start gap-4 text-left w-full z-10">
        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
          {/* Rounded Icon Container */}
          <div
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center border shadow-xs shrink-0 transition-transform duration-300 group-hover:scale-105 ${styles.iconBg}`}
          >
            <Icon size={22} className="shrink-0" />
          </div>

          {badgeText && (
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border shrink-0 ${styles.badgeBg}`}
            >
              {badgeText}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <h3 className="text-foreground font-bold text-lg sm:text-xl tracking-tight leading-snug group-hover:text-primary transition-colors duration-200">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            {desc}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Contextual Visual Illustration */}
      <div
        className={`w-full sm:w-36 lg:w-44 xl:w-48 h-32 sm:h-36 shrink-0 rounded-2xl border bg-gradient-to-br flex items-center justify-center p-3 relative overflow-hidden transition-transform duration-300 group-hover:scale-[1.02] ${styles.visualBg}`}
      >
        <CardVisual type={visualType} />
      </div>
    </div>
  );
}
