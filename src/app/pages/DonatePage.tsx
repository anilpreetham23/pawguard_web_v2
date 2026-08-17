"use client";

import { CheckCircle2, Download, Lock } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../providers/auth-provider";
import {
  PageShell,
  Section,
  Button,
  Card,
  Reveal,
  DonationTransparencyLedger,
} from "../components/pawguard";
import { DonationActionPanel } from "../components/pawguard/DonationActionPanel";
import {
  useDonationState,
  PRESET_AMOUNTS,
  DONATION_TIERS,
} from "../hooks/useDonationState";

export default function DonatePage() {
  const { isAuthenticated, openAuthDialog, user } = useAuth();
  const {
    frequency,
    selectedAmount,
    customAmount,
    displayAmount,
    activeTier,
    submitted,
    hasError,
    errorMsg,
    isLoading,
    isReceiptLoading,
    progress,
    confirmedDonation,
    setFrequency,
    selectPreset,
    setCustom,
    handleSubmit,
    downloadReceipt,
    makeAnotherDonation,
    clearError,
  } = useDonationState({
    isAuthenticated,
    openAuthDialog: () => openAuthDialog("sign-in"),
    userEmail: user?.email,
    userName: user?.full_name,
  });

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <Reveal>
          <PageHeader
            variant="dark"
            eyebrow="Support Our Work"
            title="Your money goes to dogs. Not overhead."
            subtitle="78 cents of every dollar you give funds direct dog care — rescue operations, veterinary treatment, and foster support. We publish every dollar."
          />
        </Reveal>

        <Reveal>
          <Section>
            {hasError ? (
              <div className="max-w-[600px] mx-auto">
                <Card variant="elevated" role="alert">
                  <div className="w-14 h-14 bg-destructive/10 rounded-2xl flex items-center justify-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-destructive"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-foreground font-bold text-xl">
                      Payment not completed
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {errorMsg ||
                        "Your donation could not be processed. Please try again."}
                    </p>
                  </div>
                  <Button variant="primary" size="md" onClick={clearError}>
                    Try Again
                  </Button>
                </Card>
              </div>
            ) : submitted ? (
              <div className="max-w-[600px] mx-auto">
                <Card variant="elevated" role="status" aria-live="polite">
                  <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center animate-celebration-pop">
                    <CheckCircle2
                      size={28}
                      className="text-primary-foreground"
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <h2 className="text-foreground font-bold text-2xl">
                      Thank You
                    </h2>
                    <p className="text-muted-foreground text-base leading-relaxed">
                      Your {frequency === "monthly" ? "monthly" : "one-time"}{" "}
                      gift of{" "}
                      <strong>
                        {displayAmount
                          ? new Intl.NumberFormat("en-IN", {
                              style: "currency",
                              currency: "INR",
                              maximumFractionDigits: 0,
                            }).format(displayAmount)
                          : ""}
                      </strong>{" "}
                      is confirmed.{" "}
                      {user?.email ? (
                        <span>
                          We've sent a confirmation to{" "}
                          <strong>{user.email}</strong>.
                        </span>
                      ) : (
                        "We've sent a confirmation to your inbox."
                      )}
                    </p>
                    {confirmedDonation && (
                      <p className="text-muted-foreground text-sm font-mono">
                        Donation reference: {confirmedDonation.id}
                      </p>
                    )}
                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-center gap-4">
                      <span className="font-serif text-primary font-bold text-3xl">
                        {displayAmount && displayAmount >= 500 ? "1" : "7"}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-foreground font-semibold text-sm">
                          Your direct impact
                        </span>
                        <span className="text-muted-foreground text-sm leading-relaxed">
                          {displayAmount && displayAmount >= 500
                            ? "full rescue operation deployed to save a dog in crisis."
                            : displayAmount && displayAmount >= 250
                              ? "dog sponsored through full rehabilitation — from rescue to adoption."
                              : displayAmount && displayAmount >= 100
                                ? "emergency triage treatment provided for an injured dog."
                                : displayAmount && displayAmount >= 50
                                  ? "emergency transport and initial veterinary assessment covered."
                                  : "days of foster care funded for a recovering dog."}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      {confirmedDonation?.receipt_file_key && (
                        <Button
                          variant="outline"
                          size="md"
                          isLoading={isReceiptLoading}
                          onClick={() => void downloadReceipt()}
                        >
                          <Download size={14} aria-hidden="true" />
                          Download Receipt
                        </Button>
                      )}
                      <Button
                        variant={
                          confirmedDonation?.receipt_file_key
                            ? "primary"
                            : "outline"
                        }
                        size="md"
                        onClick={makeAnotherDonation}
                      >
                        Make Another Donation
                      </Button>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      A tax receipt will also be emailed to you within 24 hours.
                    </p>
                  </div>
                </Card>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--space-12)] lg:gap-[var(--space-16)]">
                  <div className="lg:col-span-7 order-2 flex flex-col gap-8">
                    <div className="flex flex-col gap-3">
                      <label className="text-foreground text-xs font-semibold tracking-wider uppercase font-condensed">
                        Giving Frequency
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setFrequency("monthly")}
                          aria-pressed={frequency === "monthly"}
                          className={`py-4 text-center font-semibold text-sm tracking-wider border-2 rounded-btn transition-all duration-ui focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring/60 ${
                            frequency === "monthly"
                              ? "bg-primary text-primary-foreground border-primary shadow-btn-glow-primary"
                              : "bg-white text-muted-foreground border-border hover:border-primary hover:shadow-sm"
                          }`}
                        >
                          Monthly
                        </button>
                        <button
                          type="button"
                          onClick={() => setFrequency("once")}
                          aria-pressed={frequency === "once"}
                          className={`py-4 text-center font-semibold text-sm tracking-wider border-2 rounded-btn transition-all duration-ui focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring/60 ${
                            frequency === "once"
                              ? "bg-primary text-primary-foreground border-primary shadow-md"
                              : "bg-white text-muted-foreground border-border hover:border-primary hover:shadow-sm"
                          }`}
                        >
                          One-Time
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="text-foreground text-xs font-semibold tracking-wider uppercase font-condensed">
                        Select Amount
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                        {PRESET_AMOUNTS.map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => selectPreset(amt)}
                            aria-pressed={
                              selectedAmount === amt && !customAmount
                            }
                            className={`py-3.5 text-center font-bold text-base border-2 rounded-btn transition-all duration-ui focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring/60 ${
                              selectedAmount === amt && !customAmount
                                ? "bg-primary text-primary-foreground border-primary shadow-btn-glow-primary scale-[1.02]"
                                : "bg-white text-foreground border-border hover:border-primary hover:shadow-sm hover:scale-[1.02]"
                            }`}
                          >
                            {new Intl.NumberFormat("en-IN", {
                              style: "currency",
                              currency: "INR",
                              maximumFractionDigits: 0,
                            }).format(amt)}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <label
                          htmlFor="custom-amount"
                          className="text-muted-foreground text-sm shrink-0"
                        >
                          Custom amount:
                        </label>
                        <div className="flex items-center border border-border rounded-input bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-standard">
                          <span className="px-3 text-muted-foreground">₹</span>
                          <input
                            id="custom-amount"
                            type="number"
                            min="1"
                            placeholder="0.00"
                            value={customAmount}
                            onChange={(e) => setCustom(e.target.value)}
                            className="py-3 pr-3 bg-transparent text-foreground focus:outline-none w-full max-w-[120px]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="text-foreground text-xs font-semibold tracking-wider uppercase font-condensed">
                        Donation Setup
                      </label>
                      <div className="border-2 border-dashed border-border rounded-card p-6 flex flex-col gap-3 bg-card">
                        <div className="flex items-start gap-3">
                          <Lock
                            size={18}
                            className="text-muted-foreground mt-0.5 shrink-0"
                          />
                          <div>
                            <p className="text-foreground font-semibold text-sm">
                              Secure checkout via Razorpay
                            </p>
                            <p className="text-muted-foreground text-xs mt-1">
                              Payment is processed securely by our payment
                              provider. We never store your card details.
                            </p>
                          </div>
                        </div>
                        {isAuthenticated ? (
                          <p className="text-muted-foreground text-xs">
                            Donating as{" "}
                            <strong className="text-foreground">
                              {user?.email}
                            </strong>
                            . Your receipt and donation history are saved to
                            your account.
                          </p>
                        ) : (
                          <p className="text-muted-foreground text-xs">
                            You'll need to sign in to donate. Clicking donate
                            will open the sign-in dialog.
                          </p>
                        )}
                      </div>
                    </div>

                    <DonationActionPanel
                      displayAmount={displayAmount}
                      frequency={frequency}
                      activeTier={activeTier}
                      isLoading={isLoading}
                      progress={progress}
                    />
                  </div>

                  <div className="lg:col-span-5 order-1 flex flex-col gap-8">
                    <div className="flex flex-col gap-5">
                      <h2 className="text-foreground font-bold text-xl">
                        Your Impact
                      </h2>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                        {DONATION_TIERS.map((item) => {
                          const Icon = item.icon;
                          const isActive = item === activeTier;
                          const isPast =
                            DONATION_TIERS.indexOf(item) <
                            DONATION_TIERS.indexOf(activeTier);
                          return (
                            <div
                              key={item.amount}
                              className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-gentle ${
                                isActive
                                  ? "border-primary bg-primary/5 shadow-md scale-105"
                                  : isPast
                                    ? "border-border bg-card opacity-60"
                                    : "border-border bg-card opacity-40"
                              }`}
                            >
                              <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-gentle ${
                                  isActive ? `${item.bg} scale-110` : item.bg
                                }`}
                              >
                                <Icon
                                  size={18}
                                  className={`transition-all duration-gentle ${
                                    isActive
                                      ? item.color
                                      : "text-muted-foreground"
                                  }`}
                                />
                              </div>
                              <span
                                className={`font-bold text-sm transition-all duration-gentle font-mono tabular-nums ${
                                  isActive
                                    ? "text-foreground scale-105"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {item.label}
                              </span>
                              <div
                                className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-gentle ${
                                  isActive
                                    ? "bg-emergency scale-100"
                                    : "scale-0"
                                }`}
                              >
                                <CheckCircle2
                                  size={12}
                                  className="text-white"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="bg-card border border-border rounded-card p-5 shadow-sm min-h-[80px] flex items-center transition-all duration-gentle">
                        {displayAmount ? (
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${activeTier.bg}`}
                            >
                              <activeTier.icon
                                size={22}
                                className={activeTier.color}
                              />
                            </div>
                            <div>
                              <p className="text-foreground font-semibold text-base">
                                Your{" "}
                                <span className="font-mono tabular-nums">
                                  {displayAmount
                                    ? new Intl.NumberFormat("en-IN", {
                                        style: "currency",
                                        currency: "INR",
                                        maximumFractionDigits: 0,
                                      }).format(displayAmount)
                                    : ""}
                                </span>{" "}
                                {frequency === "monthly" ? "monthly " : ""}gift
                              </p>
                              <p className="text-muted-foreground text-sm leading-relaxed mt-0.5">
                                {activeTier.impact}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-sm">
                            Select an amount to see your impact
                          </p>
                        )}
                      </div>
                    </div>

                    <DonationTransparencyLedger />

                    <div className="bg-card border border-border rounded-card p-6 shadow-sm">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary/30 mb-3"
                      >
                        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                        <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                      </svg>
                      <p className="text-foreground text-sm italic leading-relaxed mb-3">
                        &ldquo;I donate monthly because I know exactly where my
                        money goes. 78 cents of every dollar hits the ground
                        running. That is transparency I can trust.&rdquo;
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs font-mono">
                          AK
                        </div>
                        <div className="flex flex-col">
                          <span className="text-foreground font-semibold text-xs">
                            Amara K.
                          </span>
                          <span className="text-muted-foreground text-2xs">
                            Monthly donor since 2023
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </Section>
        </Reveal>
      </main>
    </PageShell>
  );
}
