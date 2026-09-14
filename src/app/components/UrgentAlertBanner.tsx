"use client";

import Link from "next/link";
import { AlertTriangle, Siren, Info, ArrowRight, ShieldAlert } from "lucide-react";
import type { AlertSeverity, UrgentAlertResponse } from "@/lib/api";
import { Badge } from "./pawguard/Badge";

export interface UrgentAlertBannerProps {
  alerts?: UrgentAlertResponse[] | null;
  className?: string;
}

const SEVERITY_WEIGHT: Record<AlertSeverity, number> = {
  critical: 1,
  warning: 2,
  info: 3,
};

const SEVERITY_CONFIG: Record<
  AlertSeverity,
  {
    containerClass: string;
    iconClass: string;
    badgeVariant: "urgent" | "special" | "default";
    badgeText: string;
    Icon: typeof AlertTriangle;
  }
> = {
  critical: {
    containerClass:
      "bg-destructive/10 border-l-4 border-l-destructive border-t border-r border-b border-destructive/20 shadow-md",
    iconClass: "text-destructive animate-pulse",
    badgeVariant: "urgent",
    badgeText: "Critical Emergency Alert",
    Icon: Siren,
  },
  warning: {
    containerClass:
      "bg-amber-500/10 border-l-4 border-l-amber-500 border-t border-r border-b border-amber-500/20 shadow-sm",
    iconClass: "text-amber-600 dark:text-amber-400",
    badgeVariant: "special",
    badgeText: "High Priority Alert",
    Icon: AlertTriangle,
  },
  info: {
    containerClass:
      "bg-primary/10 border-l-4 border-l-primary border-t border-r border-b border-primary/20",
    iconClass: "text-primary",
    badgeVariant: "default",
    badgeText: "Community Notice",
    Icon: Info,
  },
};

export default function UrgentAlertBanner({
  alerts,
  className = "",
}: UrgentAlertBannerProps) {
  if (!alerts || alerts.length === 0) {
    return null;
  }

  // Filter active alerts and sort by severity (critical first), then sort_order
  const activeAlerts = [...alerts]
    .filter((a) => a.is_active !== false)
    .sort((a, b) => {
      const weightA = SEVERITY_WEIGHT[a.severity] ?? 99;
      const weightB = SEVERITY_WEIGHT[b.severity] ?? 99;
      if (weightA !== weightB) return weightA - weightB;
      return (a.sort_order ?? 0) - (b.sort_order ?? 0);
    });

  if (activeAlerts.length === 0) {
    return null;
  }

  return (
    <aside
      aria-label="Urgent Rescue Alerts"
      role="region"
      className={`w-full bg-background/95 backdrop-blur-sm border-b border-border/80 py-3.5 px-4 sm:px-6 lg:px-8 z-30 ${className}`}
    >
      <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto flex flex-col gap-3">
        {activeAlerts.map((alert) => {
          const config = SEVERITY_CONFIG[alert.severity] ?? SEVERITY_CONFIG.info;
          const { containerClass, iconClass, badgeVariant, badgeText, Icon } = config;

          return (
            <div
              key={alert.id}
              role="alert"
              aria-live="polite"
              className={`p-4 sm:p-5 rounded-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-gentle ease-gentle ${containerClass}`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <Icon size={22} className={`shrink-0 mt-0.5 ${iconClass}`} />
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <Badge variant={badgeVariant}>{badgeText}</Badge>
                    <h3 className="text-foreground font-bold text-base sm:text-lg leading-snug truncate">
                      {alert.title}
                    </h3>
                  </div>
                  {alert.message && (
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-3xl">
                      {alert.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center pt-1 sm:pt-0">
                <Link
                  href="/emergency"
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-btn text-xs font-semibold uppercase tracking-wider transition-all duration-fast ${
                    alert.severity === "critical"
                      ? "bg-destructive text-destructive-foreground hover:opacity-90 shadow-sm"
                      : "bg-primary text-primary-foreground hover:bg-primary-hover"
                  }`}
                >
                  <ShieldAlert size={14} />
                  Emergency Rescue
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
