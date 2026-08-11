"use client";

import { useEffect, useMemo, useState } from "react";
import { Heart, Truck, Stethoscope, Activity, Navigation } from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";

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

export const PRESET_AMOUNTS = [25, 50, 100, 250, 500];

export const DONATION_TIERS: DonationTier[] = [
  { amount: 25, label: "$25", impact: "Funds one week of foster care for a recovering dog", icon: Heart, color: "text-emerald-600", bg: "bg-emerald-100", activeBg: "bg-emerald-500" },
  { amount: 50, label: "$50", impact: "Covers emergency transport and initial veterinary assessment", icon: Truck, color: "text-amber-600", bg: "bg-amber-100", activeBg: "bg-amber-500" },
  { amount: 100, label: "$100", impact: "Provides emergency triage treatment for an injured dog", icon: Stethoscope, color: "text-blue-600", bg: "bg-blue-100", activeBg: "bg-blue-500" },
  { amount: 250, label: "$250", impact: "Sponsors one dog's full rehabilitation program", icon: Activity, color: "text-purple-600", bg: "bg-purple-100", activeBg: "bg-purple-500" },
  { amount: 500, label: "$500", impact: "Funds a rescue operation including team deployment", icon: Navigation, color: "text-rose-600", bg: "bg-rose-100", activeBg: "bg-rose-500" },
];

export function getImpactLine(amount: number | null, frequency: DonationFrequency): string {
  if (!amount) return "Donate Now";
  if (amount >= 500) return `Give $${amount} — Fund a Rescue Operation`;
  if (amount >= 250) return `Give $${amount} — Sponsor Full Rehabilitation`;
  if (amount >= 100) return `Give $${amount} — Fund Emergency Triage`;
  if (amount >= 50) return `Give $${amount} — Fund Emergency Transport`;
  return `Give $${amount} — Fund Foster Care`;
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
  setFrequency: (f: DonationFrequency) => void;
  selectPreset: (amount: number) => void;
  setCustom: (value: string) => void;
  getImpactLine: (amount: number | null) => string;
  handleSubmit: (e: React.FormEvent) => void;
  makeAnotherDonation: () => void;
  clearError: () => void;
}

export function useDonationState(): DonationState {
  const [frequency, setFrequency] = useState<DonationFrequency>("monthly");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const displayAmount = customAmount ? parseFloat(customAmount) : selectedAmount;

  const activeTier = useMemo(() => {
    const amt = displayAmount || 0;
    return DONATION_TIERS.reduce((prev, curr) => (curr.amount <= amt ? curr : prev), DONATION_TIERS[0]);
  }, [displayAmount]);

  useEffect(() => {
    if (!submitted) return;
    const end = Date.now() + 1000;
    const interval = setInterval(() => {
      if (Date.now() > end) { clearInterval(interval); return; }
      confetti({ particleCount: 4, spread: 60, origin: { y: 0.6 }, colors: ["#00236f", "#c41a1a", "#faf6ef"] });
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setHasError(false);
    setProgress(0);
    const interval = setInterval(() => setProgress((p) => Math.min(p + 8, 92)), 120);
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        if (Math.random() < 0.15) {
          setIsLoading(false);
          setHasError(true);
          toast.error("Payment declining", {
            description: "Your payment could not be processed. Please check your details and try again.",
          });
          return;
        }
        setIsLoading(false);
        setSubmitted(true);
        toast.success("Donation received", {
          description: `Your ${frequency === "monthly" ? "monthly " : ""}donation of $${displayAmount?.toFixed(2)} is helping dogs in need.`,
        });
      }, 400);
    }, 1500);
  }

  function makeAnotherDonation() {
    setSubmitted(false);
    setHasError(false);
    setSelectedAmount(50);
    setCustomAmount("");
  }

  function clearError() {
    setHasError(false);
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
    setFrequency,
    selectPreset,
    setCustom,
    getImpactLine: (amount) => getImpactLine(amount, frequency),
    handleSubmit,
    makeAnotherDonation,
    clearError,
  };
}