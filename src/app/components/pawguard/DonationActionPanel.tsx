"use client";

import { Lock } from "lucide-react";
import { Button } from "./Button";
import type { DonationFrequency, DonationTier } from "../../hooks/useDonationState";

interface DonationActionPanelProps {
  displayAmount: number | null;
  frequency: DonationFrequency;
  activeTier: DonationTier;
  isLoading: boolean;
  progress: number;
}

function formatSummary(amount: number | null, frequency: DonationFrequency): string {
  if (!amount) return "Select an amount";
  const fmt = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
  const unit = frequency === "monthly" ? "/ month" : "/ one-time";
  return `${fmt}${unit}`;
}

function formatCta(amount: number | null): string {
  if (!amount) return "Donate Now";
  return `Give ${new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)}`;
}

export function DonationActionPanel({
  displayAmount,
  frequency,
  activeTier,
  isLoading,
  progress,
}: DonationActionPanelProps) {
  const summary = formatSummary(displayAmount, frequency);
  const cta = formatCta(displayAmount);

  const progressBar = isLoading ? (
    <div
      className="h-1 w-full overflow-hidden rounded-full bg-secondary"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
    >
      <div
        className="h-full bg-primary transition-all duration-gentle ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  ) : null;

  return (
    <>
      {/* ── Desktop sticky action panel (lg and above) ─────────────────────── */}
      <div className="hidden lg:block lg:sticky lg:top-[calc(var(--header-height)+var(--space-6))]" data-donation-action-panel>
        <div className="flex flex-col gap-[var(--space-5)] rounded-card border border-border bg-card p-[var(--space-7)] shadow-hover-card">
          <div className="flex flex-col gap-1">
            <span className="text-2xs font-semibold uppercase tracking-widest font-condensed text-muted-foreground">
              Your donation
            </span>
            <span aria-live="polite" className="flex items-baseline gap-1.5">
              <span className="font-mono text-3xl font-bold tabular-nums text-foreground">{formatSummary(displayAmount, frequency)}</span>
            </span>
            <span className="text-sm leading-relaxed text-muted-foreground">
              {activeTier.impact}
            </span>
          </div>

          <div className="h-px bg-border" />

          <div className="flex flex-col gap-3">
            {progressBar}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              context="donate"
              className="w-full"
              data-analytics-cta="donate-submit"
            >
              {cta}
            </Button>
          </div>

          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock size={12} className="shrink-0" aria-hidden="true" />
            Secure, encrypted payment. Your information is never shared or sold.
          </p>
        </div>
      </div>

      {/* ── Mobile sticky bottom action bar (below lg) ─────────────────────── */}
      <div className="lg:hidden sticky bottom-0 z-[var(--z-drawer)] -mx-6 lg:-mx-8" data-donation-mobile-bar>
        <div className="flex flex-col gap-2 rounded-t-card border border-b-0 border-border bg-card p-4 pb-[calc(var(--space-4)+env(safe-area-inset-bottom))] shadow-hover-card">
          <div className="flex items-center gap-3">
            <span aria-live="polite" className="flex-1 truncate text-sm font-semibold text-foreground">
              {summary}
            </span>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              context="donate"
              className="shrink-0"
              data-analytics-cta="donate-submit"
            >
              {cta}
            </Button>
          </div>
          <span className="pr-1 text-2xs text-muted-foreground">{activeTier.impact}</span>
        </div>
      </div>
    </>
  );
}