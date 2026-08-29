"use client";

import { CheckCircle2, Shield, FileText, ExternalLink } from "lucide-react";

interface LedgerEntry {
  pct: string;
  label: string;
  detail?: string;
}

interface AccreditationBadge {
  label: string;
  rating: string;
}

interface TrustSignal {
  icon: React.ReactNode;
  label: string;
  detail: string;
}

interface DonationTransparencyLedgerProps {
  breakdown?: LedgerEntry[];
  trustSignals?: TrustSignal[];
  accreditation?: AccreditationBadge[];
}

export function DonationTransparencyLedger({
  breakdown = [
    { pct: "78%", label: "Direct Dog Care Programs", detail: "Rescue operations, veterinary treatment, foster support" },
    { pct: "12%", label: "Administrative Operations", detail: "Staff, office, technology infrastructure" },
    { pct: "10%", label: "Reserve & Development", detail: "Emergency fund, training, system improvements" },
  ],
  trustSignals = [
    { icon: <CheckCircle2 size={16} />, label: "Verified 501(c)(3) Nonprofit", detail: "EIN: 87-1234567 · IRS Tax-Exempt" },
    { icon: <Shield size={16} />, label: "SSL Encrypted Transactions", detail: "256-bit · Powered by Stripe" },
  ],
  accreditation = [
    { label: "Charity Navigator", rating: "4/4 Stars" },
    { label: "GuideStar", rating: "Gold Seal" },
    { label: "AVMA", rating: "Member" },
  ],
}: DonationTransparencyLedgerProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="bg-card border border-border rounded-card overflow-hidden shadow-sm">
        <div className="bg-primary px-5 py-3">
          <h3 className="text-primary-foreground text-xs font-bold tracking-wider uppercase font-condensed">Where your money goes</h3>
        </div>
        <div className="p-5 flex flex-col gap-4">
          {breakdown.map((r) => (
            <div key={r.label} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-foreground font-semibold text-sm">{r.label}</span>
                  {r.detail && <span className="text-muted-foreground text-xs">{r.detail}</span>}
                </div>
                <span className="text-foreground font-bold text-sm font-mono tabular-nums">{r.pct}</span>
              </div>
              <div className="h-3 bg-secondary w-full rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-narrative ease-gentle"
                  style={{
                    width: r.pct,
                    background: r.label.includes("Direct") ? "linear-gradient(90deg, #1E3A8A, #2563eb)" : "linear-gradient(90deg, #64748b, #94a3b8)",
                  }}
                />
              </div>
            </div>
          ))}
          <p className="text-muted-foreground text-xs text-center mt-1">
            Audited financials available upon request.
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-card overflow-hidden shadow-sm">
        <div className="bg-primary px-5 py-3">
          <h3 className="text-primary-foreground text-xs font-bold tracking-wider uppercase font-condensed">Trust & verification</h3>
        </div>
        <div className="p-5 flex flex-col gap-3">
          {trustSignals.map((b, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-primary shrink-0 mt-0.5">{b.icon}</span>
              <div className="flex flex-col gap-0.5">
                <span className="text-foreground font-semibold text-sm">{b.label}</span>
                <span className="text-muted-foreground text-xs">{b.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-card overflow-hidden shadow-sm">
        <div className="bg-primary px-5 py-3">
          <h3 className="text-primary-foreground text-xs font-bold tracking-wider uppercase font-condensed">Accreditation</h3>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
          {accreditation.map((a) => (
            <div key={a.label} className="flex flex-col items-center gap-1.5 text-center">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText size={14} className="text-primary" />
              </div>
              <span className="text-foreground font-semibold text-2xs leading-tight">{a.label}</span>
              <span className="text-muted-foreground text-2xs leading-tight">{a.rating}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
