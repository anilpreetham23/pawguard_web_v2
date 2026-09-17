"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Heart, Truck, Stethoscope, Activity, Navigation } from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { getErrorMessage, QUERY_KEYS } from "@/lib/api";
import { queryClient } from "@/lib/react-query";
import { donationService, openAndViewReceipt } from "@/services/api/donation";
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
  razorpay_order_id?: string;
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
    modal?: {
      ondismiss?: () => void;
      escape?: boolean;
      backdropclose?: boolean;
    };
    handler: (response: RazorpayResponse) => void;
  }): {
    open: () => void;
    on: (event: string, callback: (response: any) => void) => void;
  };
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
  customAmountError: string;
  activeTier: DonationTier;
  submitted: boolean;
  hasError: boolean;
  isLoading: boolean;
  progress: number;
  errorMsg: string;
  confirmedDonation: DonationResponse | null;
  receiptUrl: string | null;
  isReceiptLoading: boolean;
  receiptError: boolean;
  setFrequency: (f: DonationFrequency) => void;
  selectPreset: (amount: number) => void;
  setCustom: (value: string) => void;
  getImpactLine: (amount: number | null) => string;
  handleSubmit: (e: React.FormEvent) => void;
  fetchReceipt: (donationId?: string) => Promise<void>;
  viewReceipt: () => Promise<void>;
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
  const [selectedAmount, setSelectedAmount] = useState<number | null>(2000);
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
  const [receiptError, setReceiptError] = useState(false);

  // Guards against duplicate clicks, event firing, and concurrent submissions
  const isSubmittingRef = useRef(false);
  const isVerifyingRef = useRef(false);
  const paymentCompletedRef = useRef(false);
  const verifiedDonationIdsRef = useRef<Set<string>>(new Set());

  const customValidation = useMemo(() => {
    if (!customAmount || customAmount.trim() === "") {
      return { amount: selectedAmount, error: "" };
    }

    const trimmed = customAmount.trim();

    // 1. Reject scientific notation (e/E), signs (+/-), and special non-finite terms
    if (
      /[eE]/.test(trimmed) ||
      /^[+-]/.test(trimmed) ||
      /^[+-]?Infinity$/i.test(trimmed) ||
      /^NaN$/i.test(trimmed)
    ) {
      return {
        amount: null,
        error: "Scientific notation and special characters (+, -, e, E) are not allowed.",
      };
    }

    // 2. Strict positive decimal format with at most 2 decimal places
    if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) {
      return {
        amount: null,
        error: "Please enter a valid decimal amount (e.g. 50, 150.50) with at most 2 decimal places.",
      };
    }

    const num = Number(trimmed);

    // 3. Require finite positive number >= 1
    if (!Number.isFinite(num) || isNaN(num) || num < 1) {
      return {
        amount: null,
        error: "Donation amount must be at least ₹1.",
      };
    }

    // 4. Enforce standard maximum online donation limit (₹5,00,000.00)
    if (num > 500000) {
      return {
        amount: null,
        error:
          "Maximum online donation per transaction is ₹5,00,000. For larger institutional grants or corporate contributions, please contact our donation team directly.",
      };
    }

    return { amount: num, error: "" };
  }, [customAmount, selectedAmount]);

  const displayAmount = customValidation.amount;
  const customAmountError = customValidation.error;

  const activeTier = useMemo(() => {
    const amt = displayAmount || 0;
    return DONATION_TIERS.reduce(
      (prev, curr) => (curr.amount <= amt ? curr : prev),
      DONATION_TIERS[0],
    );
  }, [displayAmount]);

  useEffect(() => {
    if (!submitted || confirmedDonation?.status !== "success") return;
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
  }, [submitted, confirmedDonation?.status]);

  function selectPreset(amount: number) {
    setSelectedAmount(amount);
    setCustomAmount("");
  }

  function setCustom(value: string) {
    setCustomAmount(value);
    if (value.trim() !== "") {
      setSelectedAmount(null);
    } else {
      setSelectedAmount(2000);
    }
  }

  const fetchReceipt = useCallback(
    async (donationIdOverride?: string) => {
      const targetId = donationIdOverride || confirmedDonation?.id;
      if (!targetId) return;
      setIsReceiptLoading(true);
      setReceiptError(false);
      try {
        const res = await donationService.getReceiptUrl(targetId);
        setReceiptUrl(res.download_url);
      } catch (err) {
        setReceiptError(true);
      } finally {
        setIsReceiptLoading(false);
      }
    },
    [confirmedDonation],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      // Guard against rapid duplicate clicks or submissions while loading
      if (isSubmittingRef.current || isLoading) {
        return;
      }
      if (!isAuthenticated) {
        openAuthDialog();
        return;
      }
      const amount = displayAmount;
      if (!amount || !Number.isFinite(amount) || amount < 1 || amount > 500000 || customAmountError) {
        setHasError(true);
        setErrorMsg(
          customAmountError ||
            (amount && amount > 500000
              ? "Maximum online donation per transaction is ₹5,00,000. For larger institutional grants or corporate contributions, please contact our donation team directly."
              : "Please enter a valid donation amount (minimum ₹1, maximum ₹5,00,000).")
        );
        return;
      }

      isSubmittingRef.current = true;
      paymentCompletedRef.current = false;
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
                // If payment was not completed and verification is not running, treat as cancellation
                if (!paymentCompletedRef.current && !isVerifyingRef.current) {
                  isSubmittingRef.current = false;
                  setIsLoading(false);
                  toast.info("Donation checkout cancelled", {
                    description:
                      "You closed the payment window before completing the transaction. Your donation was not processed.",
                  });
                }
              },
            },
            handler: async (response: RazorpayResponse) => {
              // Mark payment completed by gateway so ondismiss does not treat it as cancellation
              paymentCompletedRef.current = true;

              // Duplicate submission guard: prevent duplicate verification requests
              if (
                isVerifyingRef.current ||
                verifiedDonationIdsRef.current.has(order.donation_id)
              ) {
                return;
              }

              // Verify required payment credentials from gateway
              if (
                !response.razorpay_payment_id ||
                !response.razorpay_signature
              ) {
                paymentCompletedRef.current = false;
                isSubmittingRef.current = false;
                setIsLoading(false);
                setHasError(true);
                const errText =
                  "Incomplete payment credentials received from gateway.";
                setErrorMsg(errText);
                toast.error("Payment verification failed", {
                  description: errText,
                });
                return;
              }

              isVerifyingRef.current = true;
              setIsLoading(true);

              try {
                // Preserving the original PawGuard donation_id from initiateCheckout
                const gatewayOrderId =
                  response.razorpay_order_id || order.order_id;
                const donation = await donationService.verifyDonation({
                  donation_id: order.donation_id,
                  gateway_order_id: gatewayOrderId,
                  gateway_payment_id: response.razorpay_payment_id,
                  gateway_signature: response.razorpay_signature,
                });

                verifiedDonationIdsRef.current.add(order.donation_id);
                isVerifyingRef.current = false;
                isSubmittingRef.current = false;
                setIsLoading(false);

                // Status-aware verification: NEVER treat HTTP 200 alone as confirmation!
                // donation.status is the single source of truth.
                if (donation.status === "success") {
                  setConfirmedDonation(donation);
                  setSubmitted(true);
                  setHasError(false);
                  setErrorMsg("");

                  toast.success("Donation received", {
                    description: `Your ${frequency === "monthly" ? "monthly " : ""}donation of ${new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)} is confirmed. Thank you!`,
                  });

                  // Refresh/invalidate donation history and account dashboard summary queries
                  void Promise.allSettled([
                    queryClient.invalidateQueries({
                      queryKey: QUERY_KEYS.donation.history,
                    }),
                    queryClient.invalidateQueries({
                      queryKey: QUERY_KEYS.community.meDashboard,
                    }),
                  ]);
                } else if (donation.status === "pending") {
                  // Payment captured by provider but verification/settlement remains pending
                  setConfirmedDonation(donation);
                  setSubmitted(true);
                  setHasError(false);
                  setErrorMsg("");

                  toast.info("Payment verification pending", {
                    description:
                      "Your payment was received and is currently being verified. Your status will update once verification finishes.",
                  });

                  // Invalidate history so pending record is visible in account donations
                  void Promise.allSettled([
                    queryClient.invalidateQueries({
                      queryKey: QUERY_KEYS.donation.history,
                    }),
                    queryClient.invalidateQueries({
                      queryKey: QUERY_KEYS.community.meDashboard,
                    }),
                  ]);
                } else {
                  // status === "failed" or other terminal failure status
                  paymentCompletedRef.current = false;
                  setConfirmedDonation(null);
                  setSubmitted(false);
                  setHasError(true);
                  const failureMsg =
                    donation.notes ||
                    "Payment verification failed. Your transaction could not be confirmed.";
                  setErrorMsg(failureMsg);
                  toast.error("Payment not completed", {
                    description: failureMsg,
                  });
                }
              } catch (verifyErr) {
                isVerifyingRef.current = false;
                isSubmittingRef.current = false;
                paymentCompletedRef.current = false;
                setIsLoading(false);
                setHasError(true);
                const errMsg =
                  getErrorMessage(verifyErr) ||
                  "Payment verification failed. Please contact support if your account was debited.";
                setErrorMsg(errMsg);
                toast.error("Payment verification failed", {
                  description: errMsg,
                });
              }
            },
          });

          // Handle gateway-side payment failure event
          checkout.on("payment.failed", (failedRes: any) => {
            paymentCompletedRef.current = false;
            isVerifyingRef.current = false;
            isSubmittingRef.current = false;
            setIsLoading(false);
            setHasError(true);
            const desc =
              failedRes?.error?.description ||
              "Payment could not be completed by the payment provider. Please try again.";
            setErrorMsg(desc);
            toast.error("Payment unsuccessful", { description: desc });
          });

          checkout.open();
        } catch (err) {
          clearInterval(interval);
          isSubmittingRef.current = false;
          isVerifyingRef.current = false;
          paymentCompletedRef.current = false;
          setIsLoading(false);
          setHasError(true);
          setErrorMsg(getErrorMessage(err));
        }
      };

      void run();
    },
    [
      displayAmount,
      customAmountError,
      frequency,
      isAuthenticated,
      openAuthDialog,
      userName,
      userEmail,
      isLoading,
    ],
  );

  const viewReceipt = useCallback(async () => {
    if (!confirmedDonation || confirmedDonation.status !== "success") return;
    setIsReceiptLoading(true);
    setReceiptError(false);
    try {
      await openAndViewReceipt(confirmedDonation.id);
    } catch (err) {
      setReceiptError(true);
      const errMsg =
        getErrorMessage(err) ||
        "Could not load receipt at this moment. Please try again.";
      toast.error("Receipt preparation failed", {
        description: errMsg,
      });
    } finally {
      setIsReceiptLoading(false);
    }
  }, [confirmedDonation]);

  const downloadReceipt = useCallback(async () => {
    return viewReceipt();
  }, [viewReceipt]);

  function makeAnotherDonation() {
    isSubmittingRef.current = false;
    isVerifyingRef.current = false;
    paymentCompletedRef.current = false;
    setSubmitted(false);
    setHasError(false);
    setErrorMsg("");
    setConfirmedDonation(null);
    setReceiptUrl(null);
    setReceiptError(false);
    setSelectedAmount(2000);
    setCustomAmount("");
  }

  function clearError() {
    isSubmittingRef.current = false;
    isVerifyingRef.current = false;
    paymentCompletedRef.current = false;
    setHasError(false);
    setErrorMsg("");
    setIsLoading(false);
  }

  return {
    frequency,
    selectedAmount,
    customAmount,
    displayAmount,
    customAmountError,
    activeTier,
    submitted,
    hasError,
    isLoading,
    progress,
    errorMsg,
    confirmedDonation,
    receiptUrl,
    isReceiptLoading,
    receiptError,
    setFrequency,
    selectPreset,
    setCustom,
    getImpactLine: (amount) => getImpactLine(amount, frequency),
    handleSubmit,
    fetchReceipt,
    viewReceipt,
    downloadReceipt,
    makeAnotherDonation,
    clearError,
  };
}
