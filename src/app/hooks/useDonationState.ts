"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Heart, Truck, Stethoscope, Activity, Navigation } from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api";
import { donationService } from "@/services/api/donation";
import type { DonationOrderResponse, DonationResponse } from "@/lib/api";

export type DonationFrequency = "monthly" | "once";

export interface DonationTier {
  amount: number;
  label: string;
  impact: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  activeBg: string;
}

export const PRESET_AMOUNTS = [2000, 4000, 8000, 20000, 40000];

export const DONATION_TIERS: DonationTier[] = [
  {
    amount: 2000,
    label: "₹2,000",
    impact: "Funds one week of foster care for a recovering dog",
    icon: Heart,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
    activeBg: "bg-emerald-500",
  },
  {
    amount: 4000,
    label: "₹4,000",
    impact: "Covers emergency transport and initial veterinary assessment",
    icon: Truck,
    color: "text-amber-600",
    bg: "bg-amber-100",
    activeBg: "bg-amber-500",
  },
  {
    amount: 8000,
    label: "₹8,000",
    impact: "Provides emergency triage treatment for an injured dog",
    icon: Stethoscope,
    color: "text-blue-600",
    bg: "bg-blue-100",
    activeBg: "bg-blue-500",
  },
  {
    amount: 20000,
    label: "₹20,000",
    impact: "Sponsors one dog's full rehabilitation program",
    icon: Activity,
    color: "text-purple-600",
    bg: "bg-purple-100",
    activeBg: "bg-purple-500",
  },
  {
    amount: 40000,
    label: "₹40,000",
    impact: "Funds a rescue operation including team deployment",
    icon: Navigation,
    color: "text-rose-600",
    bg: "bg-rose-100",
    activeBg: "bg-rose-500",
  },
];

export function getImpactLine(
  amount: number | null,
  frequency: DonationFrequency,
): string {
  if (!amount) return "Donate Now";
  const fmt = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
  if (amount >= 40000) return `Give ${fmt} — Fund a Rescue Operation`;
  if (amount >= 20000) return `Give ${fmt} — Sponsor Full Rehabilitation`;
  if (amount >= 8000) return `Give ${fmt} — Fund Emergency Triage`;
  if (amount >= 4000) return `Give ${fmt} — Fund Emergency Transport`;
  return `Give ${fmt} — Fund Foster Care`;
}

/** Minimal Razorpay Checkout.js surface used by the donation flow. */
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayConstructor {
  new (options: {
    key: string;
    order_id: string;
    amount: number;
    currency: string;
    name: string;
    description?: string;
    prefill?: { name?: string; email?: string };
    theme?: { color?: string };
    modal?: { ondismiss?: () => void };
    handler: (response: RazorpayResponse) => void;
  }): { open: () => void };
}

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

/** Lazily inject the Razorpay Checkout.js script (idempotent). */
function loadRazorpay(): Promise<RazorpayConstructor> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      if (window.Razorpay) resolve(window.Razorpay);
      else reject(new Error("Payment provider failed to initialise."));
    };
    script.onerror = () =>
      reject(
        new Error("Could not load the payment provider. Please try again."),
      );
    document.head.appendChild(script);
  });
}

export interface DonationState {
  frequency: DonationFrequency;
  selectedAmount: number | null;
  customAmount: string;
  displayAmount: number | null;
  activeTier: DonationTier;
  submitted: boolean;
  hasError: boolean;
  isLoading: boolean;
  progress: number;
  errorMsg: string;
  confirmedDonation: DonationResponse | null;
  receiptUrl: string | null;
  isReceiptLoading: boolean;
  setFrequency: (f: DonationFrequency) => void;
  selectPreset: (amount: number) => void;
  setCustom: (value: string) => void;
  getImpactLine: (amount: number | null) => string;
  handleSubmit: (e: React.FormEvent) => void;
  downloadReceipt: () => Promise<void>;
  makeAnotherDonation: () => void;
  clearError: () => void;
}

interface DonationStateOptions {
  isAuthenticated: boolean;
  openAuthDialog: () => void;
  userEmail?: string | null;
  userName?: string | null;
}

export function useDonationState({
  isAuthenticated,
  openAuthDialog,
  userEmail,
  userName,
}: DonationStateOptions): DonationState {
  const [frequency, setFrequency] = useState<DonationFrequency>("monthly");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [confirmedDonation, setConfirmedDonation] =
    useState<DonationResponse | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [isReceiptLoading, setIsReceiptLoading] = useState(false);

  const displayAmount = customAmount
    ? parseFloat(customAmount)
    : selectedAmount;

  const activeTier = useMemo(() => {
    const amt = displayAmount || 0;
    return DONATION_TIERS.reduce(
      (prev, curr) => (curr.amount <= amt ? curr : prev),
      DONATION_TIERS[0],
    );
  }, [displayAmount]);

  useEffect(() => {
    if (!submitted) return;
    const end = Date.now() + 1000;
    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }
      confetti({
        particleCount: 4,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#1E3A8A", "#DC2626", "#F8FAFC"],
      });
    }, 80);
    return () => clearInterval(interval);
  }, [submitted]);

  function selectPreset(amount: number) {
    setSelectedAmount(amount);
    setCustomAmount("");
  }

  function setCustom(value: string) {
    setCustomAmount(value);
    setSelectedAmount(null);
  }

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!isAuthenticated) {
        openAuthDialog();
        return;
      }
      const amount = displayAmount;
      if (!amount || amount < 1) {
        setHasError(true);
        setErrorMsg("Please choose an amount to donate.");
        return;
      }
      setIsLoading(true);
      setHasError(false);
      setErrorMsg("");
      setProgress(0);
      const interval = setInterval(
        () => setProgress((p) => Math.min(p + 8, 92)),
        120,
      );

      const run = async () => {
        try {
          await donationService.registerDonor({});
          const order: DonationOrderResponse =
            await donationService.initiateCheckout({
              amount,
              currency: "INR",
              donation_type: frequency === "monthly" ? "recurring" : "one_time",
              notes: "Donation via public website",
            });
          clearInterval(interval);
          setProgress(100);

          const Razorpay = await loadRazorpay();
          const checkout = new Razorpay({
            key: order.checkout_key,
            order_id: order.order_id,
            amount: Math.round(order.amount * 100),
            currency: order.currency,
            name: "PawGuard",
            description: "Donation to PawGuard",
            prefill: {
              name: userName ?? undefined,
              email: userEmail ?? undefined,
            },
            theme: { color: "#1E3A8A" },
            modal: {
              ondismiss: () => {
                setIsLoading(false);
              },
            },
            handler: async (response) => {
              try {
                const donation = await donationService.verifyDonation({
                  donation_id: order.donation_id,
                  gateway_order_id: response.razorpay_order_id,
                  gateway_payment_id: response.razorpay_payment_id,
                  gateway_signature: response.razorpay_signature,
                });
                setConfirmedDonation(donation);
                setIsLoading(false);
                setSubmitted(true);
                toast.success("Donation received", {
                  description: `Your ${frequency === "monthly" ? "monthly " : ""}donation of ${new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)} is helping dogs in need.`,
                });
              } catch (verifyErr) {
                setIsLoading(false);
                setHasError(true);
                setErrorMsg(getErrorMessage(verifyErr));
              }
            },
          });
          checkout.open();
        } catch (err) {
          clearInterval(interval);
          setIsLoading(false);
          setHasError(true);
          setErrorMsg(getErrorMessage(err));
        }
      };

      void run();
    },
    [
      displayAmount,
      frequency,
      isAuthenticated,
      openAuthDialog,
      userName,
      userEmail,
    ],
  );

  const downloadReceipt = useCallback(async () => {
    if (!confirmedDonation) return;
    setIsReceiptLoading(true);
    try {
      const res = await donationService.getReceiptUrl(confirmedDonation.id);
      setReceiptUrl(res.download_url);
      window.open(res.download_url, "_blank", "noopener,noreferrer");
    } catch (err) {
      toast.error("Receipt not ready yet", {
        description: "Your tax receipt will be emailed to you within 24 hours.",
      });
    } finally {
      setIsReceiptLoading(false);
    }
  }, [confirmedDonation]);

  function makeAnotherDonation() {
    setSubmitted(false);
    setHasError(false);
    setErrorMsg("");
    setConfirmedDonation(null);
    setReceiptUrl(null);
    setSelectedAmount(50);
    setCustomAmount("");
  }

  function clearError() {
    setHasError(false);
    setErrorMsg("");
    setIsLoading(false);
  }

  return {
    frequency,
    selectedAmount,
    customAmount,
    displayAmount,
    activeTier,
    submitted,
    hasError,
    isLoading,
    progress,
    errorMsg,
    confirmedDonation,
    receiptUrl,
    isReceiptLoading,
    setFrequency,
    selectPreset,
    setCustom,
    getImpactLine: (amount) => getImpactLine(amount, frequency),
    handleSubmit,
    downloadReceipt,
    makeAnotherDonation,
    clearError,
  };
}
