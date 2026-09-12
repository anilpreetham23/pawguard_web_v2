"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  PiggyBank,
  HeartHandshake,
  CheckCircle2,
  Clock,
  AlertCircle,
  RotateCcw,
  Calendar,
  Lock,
  PawPrint,
  FileText,
  Loader2,
  CreditCard,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import {
  PageShell,
  Section,
  Card,
  Button,
  Badge,
  EmptyState,
  Alert,
  Skeleton,
  Reveal,
} from "../components/pawguard";
import { useAuth } from "../providers/auth-provider";
import { useMyDonations } from "../hooks/useMyDonations";
import { donationService, openAndViewReceipt } from "@/services/api/donation";
import { getErrorMessage } from "@/lib/api";
import type { DonationResponse } from "@/lib/api";

type FilterTab = "all" | "success" | "pending" | "other";

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(amount: number, currency = "INR"): string {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency.toUpperCase() === "INR" ? "INR" : currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `₹${amount.toLocaleString("en-IN")}`;
  }
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "success":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25">
          <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
          Completed
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25">
          <Clock size={13} className="text-amber-600 dark:text-amber-400" />
          Pending
        </span>
      );
    case "refunded":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/25">
          <RotateCcw size={13} className="text-slate-500" />
          Refunded
        </span>
      );
    case "failed":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/25">
          <AlertCircle size={13} className="text-destructive" />
          Failed
        </span>
      );
  }
}

function TypeBadge({ type }: { type: DonationResponse["donation_type"] }) {
  switch (type) {
    case "recurring":
      return (
        <Badge variant="neutral" className="text-2xs font-mono uppercase tracking-wider">
          Monthly Recurring
        </Badge>
      );
    case "sponsorship":
      return (
        <Badge variant="default" className="text-2xs font-mono uppercase tracking-wider">
          Dog Sponsorship
        </Badge>
      );
    case "one_time":
    default:
      return (
        <Badge variant="neutral" className="text-2xs font-mono uppercase tracking-wider">
          One-Time
        </Badge>
      );
  }
}

export default function MyDonationsPage() {
  const router = useRouter();
  const { isAuthenticated, status: authStatus, openAuthDialog } = useAuth();
  const { donations, isLoading, isError, error, refetch } = useMyDonations(isAuthenticated);

  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [receiptError, setReceiptError] = useState<{ id: string; message: string } | null>(null);

  // ── Calculate Summary Statistics ──────────────────────────────────────────
  const { totalDonated, totalContributions, successfulCount, primaryCurrency } = useMemo(() => {
    const totalContributions = donations.length;
    const successful = donations.filter((d) => d.status === "success");
    const successfulCount = successful.length;
    const totalDonated = successful.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
    const primaryCurrency = donations[0]?.currency || "INR";

    return {
      totalDonated,
      totalContributions,
      successfulCount,
      primaryCurrency,
    };
  }, [donations]);

  // ── Filter Records ────────────────────────────────────────────────────────
  const filteredDonations = useMemo(() => {
    switch (activeFilter) {
      case "success":
        return donations.filter((d) => d.status === "success");
      case "pending":
        return donations.filter((d) => d.status === "pending");
      case "other":
        return donations.filter((d) => d.status !== "success" && d.status !== "pending");
      case "all":
      default:
        return donations;
    }
  }, [donations, activeFilter]);

  // ── Receipt View & Download Handler ─────────────────────────────────────────
  const handleViewReceipt = useCallback(async (donationId: string) => {
    setDownloadingId(donationId);
    setReceiptError(null);
    try {
      await openAndViewReceipt(donationId);
    } catch (err) {
      setReceiptError({
        id: donationId,
        message:
          getErrorMessage(err) ||
          "Failed to retrieve receipt. Please try again.",
      });
    } finally {
      setDownloadingId(null);
    }
  }, []);

  // ── Unauthenticated Guard ─────────────────────────────────────────────────
  if (authStatus === "loading") {
    return (
      <PageShell>
        <main id="main-content" className="flex-1 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <Skeleton className="h-10 w-1/3 mb-4" />
          <Skeleton className="h-4 w-1/4 mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <Skeleton className="h-32 rounded-card" />
            <Skeleton className="h-32 rounded-card" />
            <Skeleton className="h-32 rounded-card" />
          </div>
          <div className="flex flex-col gap-4">
            <Skeleton className="h-28 rounded-card" />
            <Skeleton className="h-28 rounded-card" />
          </div>
        </main>
      </PageShell>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageShell>
        <main id="main-content" className="flex-1">
          <PageHeader
            eyebrow="My Account"
            title="My Donations"
            subtitle="View your contribution history, impact, and tax-deductible receipts."
          >
            <Link
              href="/account"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft size={14} /> Back to My Account
            </Link>
          </PageHeader>
          <Section bg="default" containerWidth="narrow">
            <Card className="p-8 sm:p-10 text-center flex flex-col items-center gap-6 border-dashed border-2">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Lock size={28} />
              </div>
              <div className="max-w-md flex flex-col gap-2">
                <h2 className="text-foreground font-bold text-2xl">Sign In Required</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Please sign in to view your verified donation records and download official tax receipts.
                </p>
              </div>
              <Button variant="primary" size="lg" onClick={() => openAuthDialog("sign-in")}>
                Sign In to View Donations
              </Button>
            </Card>
          </Section>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <PageHeader
          eyebrow="My Account"
          title="My Donations"
          subtitle="View your contribution history, impact, and tax-deductible receipts."
        >
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft size={14} /> Back to My Account
          </Link>
        </PageHeader>

        <Section bg="default">
          <div className="max-w-[1280px] mx-auto flex flex-col gap-8 w-full">
            {/* ── Summary Cards Grid ────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {/* Card 1: Total Donated */}
              <Card className="p-5 sm:p-6 transition-all duration-fast hover:border-primary/40 hover:shadow-xs">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <PiggyBank size={20} />
                  </span>
                  <Badge variant="neutral" className="text-2xs font-mono">
                    Verified
                  </Badge>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground text-xs font-medium">Total Donated</p>
                  <p className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
                    {isLoading ? <Skeleton className="h-8 w-24" /> : formatCurrency(totalDonated, primaryCurrency)}
                  </p>
                  <p className="text-muted-foreground text-2xs mt-0.5">Across completed contributions</p>
                </div>
              </Card>

              {/* Card 2: Total Contributions */}
              <Card className="p-5 sm:p-6 transition-all duration-fast hover:border-primary/40 hover:shadow-xs">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <HeartHandshake size={20} />
                  </span>
                  <span className="text-2xl font-bold text-foreground font-mono">
                    {isLoading ? <Skeleton className="h-6 w-8" /> : totalContributions}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground text-xs font-medium">Total Contributions</p>
                  <p className="text-foreground font-semibold text-sm">All Donation Records</p>
                  <p className="text-muted-foreground text-2xs mt-0.5">Lifetime contribution count</p>
                </div>
              </Card>

              {/* Card 3: Successful Donations */}
              <Card className="p-5 sm:p-6 transition-all duration-fast hover:border-primary/40 hover:shadow-xs">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 size={20} />
                  </span>
                  <span className="text-2xl font-bold text-foreground font-mono">
                    {isLoading ? <Skeleton className="h-6 w-8" /> : successfulCount}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground text-xs font-medium">Successful Donations</p>
                  <p className="text-foreground font-semibold text-sm">Processed &amp; Settled</p>
                  <p className="text-muted-foreground text-2xs mt-0.5">Eligible for 80G tax benefits</p>
                </div>
              </Card>
            </div>

            {/* ── Error Banner ──────────────────────────────────────────────── */}
            {isError && (
              <Alert variant="error" className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">Failed to load donation records</p>
                  <p className="text-xs opacity-90">{getErrorMessage(error)}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => void refetch()} className="shrink-0">
                  Retry
                </Button>
              </Alert>
            )}

            {/* ── Filter Bar & Actions ──────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                {(
                  [
                    { key: "all", label: `All (${donations.length})` },
                    { key: "success", label: `Completed (${successfulCount})` },
                    {
                      key: "pending",
                      label: `Pending (${donations.filter((d) => d.status === "pending").length})`,
                    },
                    {
                      key: "other",
                      label: `Other (${donations.filter((d) => d.status !== "success" && d.status !== "pending").length})`,
                    },
                  ] as const
                ).map((tab) => {
                  const isActive = activeFilter === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveFilter(tab.key)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider font-condensed transition-all duration-fast shrink-0 ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "bg-card border border-border text-foreground hover:border-primary/40 hover:text-primary"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push("/donate")}
                className="shrink-0 self-start sm:self-auto"
              >
                Make a Donation
              </Button>
            </div>

            {/* ── Donations List / Empty / Loading ──────────────────────────── */}
            {isLoading ? (
              <div className="flex flex-col gap-4">
                <Skeleton className="h-32 rounded-card" />
                <Skeleton className="h-32 rounded-card" />
                <Skeleton className="h-32 rounded-card" />
              </div>
            ) : filteredDonations.length === 0 ? (
              <EmptyState
                icon="heart"
                title={activeFilter === "all" ? "No donations yet" : `No ${activeFilter} donations found`}
                description={
                  activeFilter === "all"
                    ? "Your completed donations and official receipts will appear here."
                    : "No records matched your current filter criteria."
                }
                action={{
                  label: "Make a Donation",
                  onClick: () => router.push("/donate"),
                }}
              />
            ) : (
              <div className="flex flex-col gap-4">
                {filteredDonations.map((donation) => {
                  const isDownloading = downloadingId === donation.id;
                  const itemError = receiptError?.id === donation.id ? receiptError.message : null;

                  return (
                    <Reveal key={donation.id}>
                      <Card className="p-5 sm:p-6 transition-all duration-fast hover:border-primary/40 hover:shadow-xs flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          {/* Left: Amount, Badges & Date */}
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-wrap items-center gap-2.5">
                              <span className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
                                {formatCurrency(donation.amount, donation.currency)}
                              </span>
                              <StatusBadge status={donation.status} />
                              <TypeBadge type={donation.donation_type} />
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1.5 font-medium">
                                <Calendar size={14} className="text-muted-foreground/70" />
                                {formatDate(donation.created_at)}
                              </span>
                              {donation.payment_provider && (
                                <span className="flex items-center gap-1.5 font-mono text-2xs uppercase">
                                  <CreditCard size={13} className="text-muted-foreground/70" />
                                  {donation.payment_provider}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Right: Receipt Action */}
                          {donation.status === "success" && (
                            <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={isDownloading}
                                onClick={() => void handleViewReceipt(donation.id)}
                                className="inline-flex items-center gap-2 text-xs"
                              >
                                {isDownloading ? (
                                  <>
                                    <Loader2 size={14} className="animate-spin text-primary" />
                                    <span>Opening Receipt...</span>
                                  </>
                                ) : (
                                  <>
                                    <FileText size={14} className="text-primary" />
                                    <span>View Receipt</span>
                                  </>
                                )}
                              </Button>
                              <span className="text-2xs text-muted-foreground">Official 80G Tax Receipt</span>
                            </div>
                          )}
                        </div>

                        {/* Middle: Details (Dog, Notes, Transaction Ref) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-border/70 text-xs">
                          {donation.dog?.name ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <PawPrint size={14} className="text-primary shrink-0" />
                              <span>
                                Sponsoring: <strong className="text-foreground">{donation.dog.name}</strong>
                                {donation.dog.breed ? ` (${donation.dog.breed})` : ""}
                              </span>
                            </div>
                          ) : null}

                          {donation.notes ? (
                            <div className="flex items-start gap-2 text-muted-foreground md:col-span-2">
                              <FileText size={14} className="text-primary shrink-0 mt-0.5" />
                              <span className="italic line-clamp-2">&ldquo;{donation.notes}&rdquo;</span>
                            </div>
                          ) : null}

                          <div className="flex items-center gap-2 text-muted-foreground font-mono text-2xs md:col-span-2">
                            <span>
                              Ref: <span className="text-foreground select-all">{donation.transaction_id || donation.id}</span>
                            </span>
                          </div>
                        </div>

                        {/* Inline Receipt Error (if any) */}
                        {itemError && (
                          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-md flex items-center justify-between gap-2">
                            <span>{itemError}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => void handleViewReceipt(donation.id)}
                              className="text-xs shrink-0"
                            >
                              Retry
                            </Button>
                          </div>
                        )}
                      </Card>
                    </Reveal>
                  );
                })}
              </div>
            )}
          </div>
        </Section>
      </main>
    </PageShell>
  );
}
