"use client";

import { useEffect } from "react";
import Link from "next/link";
import { QrCode, Download, Printer, ExternalLink, CheckCircle2, ShieldCheck, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button, Badge } from "./index";
import { QrCodeView, downloadQrPng, printQrTag } from "./QrCodeView";
import { PUBLIC_SITE_URL } from "@/lib/api";
import type { CompanionPetResponse, SafetyTagResponse, SafetyTagProvisionResponse } from "@/lib/api";

interface SafetyTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: CompanionPetResponse;
  safetyTag: SafetyTagResponse | SafetyTagProvisionResponse | null;
  provisionedToken?: string | null;
}

/**
 * Sanitizes and extracts raw token strings from raw candidates or legacy URL strings.
 */
export function extractRawToken(input: string | null | undefined): string {
  if (!input) return "";
  let str = input.trim();
  if (!str) return "";

  if (str.includes("token=")) {
    try {
      const match = str.match(/token=([^&]+)/);
      if (match && match[1]) {
        str = decodeURIComponent(match[1]);
      }
    } catch {
      // ignore
    }
  }

  if (str.startsWith("http://") || str.startsWith("https://")) {
    try {
      const url = new URL(str);
      const queryToken = url.searchParams.get("token");
      if (queryToken) {
        str = queryToken;
      } else {
        const parts = url.pathname.split("/").filter(Boolean);
        str = parts[parts.length - 1] || str;
      }
    } catch {
      // ignore
    }
  }

  return str;
}

export function SafetyTagModal({
  isOpen,
  onClose,
  pet,
  safetyTag,
  provisionedToken,
}: SafetyTagModalProps) {
  const storedToken =
    typeof window !== "undefined"
      ? localStorage.getItem(`pawguard_safety_tag_token_${pet.id}`)
      : null;

  const rawCandidate =
    provisionedToken ||
    (safetyTag as any)?.raw_token ||
    (safetyTag as any)?.token ||
    storedToken ||
    safetyTag?.token_prefix ||
    pet.id;

  const cleanRawToken = extractRawToken(rawCandidate);

  // Store sanitized raw token in localStorage for persistence across reloads
  useEffect(() => {
    if (provisionedToken && pet.id) {
      try {
        const sanitized = extractRawToken(provisionedToken);
        localStorage.setItem(`pawguard_safety_tag_token_${pet.id}`, sanitized);
      } catch (err) {
        console.error("Failed to store safety tag token locally:", err);
      }
    }
  }, [provisionedToken, pet.id]);

  // Canonical production URL is strictly enforced for all scannable/downloadable/printable QR outputs
  const baseUrl = PUBLIC_SITE_URL.replace(/\/+$/, "");
  const scanUrl = `${baseUrl}/scan?token=${encodeURIComponent(cleanRawToken)}`;

  if (typeof window !== "undefined") {
    console.log("[PawGuard QR Runtime Check] Final Encoded QR Payload URL:", scanUrl);
  }

  const isActive = safetyTag?.is_active ?? true;
  const scanCount = safetyTag?.scan_count ?? 0;
  const lastScanned = safetyTag?.last_scanned_at
    ? new Date(safetyTag.last_scanned_at).toLocaleString()
    : "Never";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[480px] w-full p-6 sm:p-8 rounded-card border-border bg-card shadow-2xl gap-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left gap-1">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-primary/10 text-primary">
                <QrCode size={20} />
              </span>
              <DialogTitle className="font-serif font-bold text-2xl text-foreground">
                QR Safety Tag
              </DialogTitle>
            </div>
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${isActive ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/25" : "bg-muted text-muted-foreground border border-border"}`}>
              <span className={`h-2 w-2 rounded-full ${isActive ? "bg-emerald-500" : "bg-muted-foreground"}`} />
              {isActive ? "Tag Active" : "Inactive"}
            </span>
          </div>
          <DialogDescription className="text-xs text-muted-foreground pt-1">
            Authoritative PawGuard Safety Tag for <span className="font-semibold text-foreground">{pet.name}</span>.
          </DialogDescription>
        </DialogHeader>

        {/* ── QR CODE DISPLAY ─────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-200 rounded-card gap-4">
          <QrCodeView value={scanUrl} size={210} />
          <div className="text-center">
            <p className="text-foreground font-bold text-lg">{pet.name}</p>
            <p className="text-muted-foreground text-xs">
              {pet.species.toUpperCase()} {pet.breed ? `· ${pet.breed}` : ""}
            </p>
          </div>
          <p className="text-[11px] text-muted-foreground text-center max-w-xs leading-relaxed">
            Scan this physical QR tag using any smartphone camera to safely reunite <span className="font-medium text-foreground">{pet.name}</span> if lost.
          </p>
          {/* Debug/inspection bar for UAT verification */}
          <div className="w-full bg-slate-100 p-2.5 rounded-lg border border-slate-200 text-center">
            <p className="text-[10px] text-slate-500 font-mono font-semibold uppercase tracking-wider mb-0.5">Scannable QR Target URL</p>
            <p className="text-[11px] font-mono text-primary break-all select-all font-medium">{scanUrl}</p>
          </div>
        </div>

        {/* ── METADATA DETAILS ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3 text-xs bg-secondary/40 p-4 rounded-xl border border-border/60">
          <div>
            <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-condensed font-semibold">Token Prefix</span>
            <span className="font-mono font-semibold text-foreground text-xs">{safetyTag?.token_prefix || "PROVISIONED"}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-condensed font-semibold">Total Scans</span>
            <span className="font-semibold text-foreground">{scanCount}</span>
          </div>
          <div className="col-span-2 pt-2 border-t border-border/50 flex items-center justify-between">
            <span className="text-muted-foreground text-[11px]">Last Scanned</span>
            <span className="text-foreground font-medium text-[11px]">{lastScanned}</span>
          </div>
        </div>

        {/* ── ACTION BUTTONS ─────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-2.5 pt-2 border-t border-border">
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => downloadQrPng(scanUrl, pet.name)}
              className="gap-1.5 w-full text-xs font-semibold"
            >
              <Download size={14} className="text-primary" />
              Download QR
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => printQrTag(scanUrl, pet.name, pet.species, pet.breed ?? undefined)}
              className="gap-1.5 w-full text-xs font-semibold"
            >
              <Printer size={14} className="text-primary" />
              Print QR
            </Button>
          </div>

          <Link
            href={`/scan?token=${encodeURIComponent(cleanRawToken)}`}
            target="_blank"
            className="w-full"
          >
            <Button
              type="button"
              variant="primary"
              size="sm"
              className="gap-1.5 w-full text-xs font-semibold"
            >
              <ExternalLink size={14} />
              Test Scanner Route
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
