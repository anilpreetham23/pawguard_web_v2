"use client";

import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FileCheck,
  ArrowLeft,
  KeyRound,
  FileText,
  Building2,
  Check,
} from "lucide-react";
import { Button, Input, Alert, Card } from "../pawguard";
import {
  identityVerificationService,
  formatAadhaarInput,
  PRIMARY_DOCUMENT_TYPES,
  SECONDARY_DOCUMENT_TYPES,
  DOCUMENT_TYPE_LABELS,
  type AadhaarVerificationState,
  type DigiLockerDocumentState,
  type GovernmentDocumentType,
  type VerificationDocumentRecord,
} from "@/services/api/identity";

export interface AdoptionIdentityData {
  aadhaarStatus: AadhaarVerificationState;
  maskedAadhaar?: string;
  primaryDocument: VerificationDocumentRecord | null;
  secondaryDocument: VerificationDocumentRecord | null;
  isIdentityVerified: boolean;
}

interface AdoptionIdentityVerificationProps {
  value: AdoptionIdentityData;
  onChange: (data: AdoptionIdentityData) => void;
}

export default function AdoptionIdentityVerification({
  value,
  onChange,
}: AdoptionIdentityVerificationProps) {
  // Aadhaar states
  const [formattedAadhaar, setFormattedAadhaar] = useState("");
  const [aadhaarError, setAadhaarError] = useState<string | null>(null);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // DigiLocker states
  const [primaryDocType, setPrimaryDocType] =
    useState<GovernmentDocumentType>("driving_licence");
  const [secondaryDocType, setSecondaryDocType] =
    useState<GovernmentDocumentType>("pan_card");

  const [primaryState, setPrimaryState] =
    useState<DigiLockerDocumentState>(
      value.primaryDocument ? "VERIFIED" : "NOT_CONNECTED"
    );
  const [secondaryState, setSecondaryState] =
    useState<DigiLockerDocumentState>(
      value.secondaryDocument ? "VERIFIED" : "NOT_CONNECTED"
    );

  const [isConnectingPrimary, setIsConnectingPrimary] = useState(false);
  const [isConnectingSecondary, setIsConnectingSecondary] = useState(false);
  const [primaryError, setPrimaryError] = useState<string | null>(null);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Handle Aadhaar 12-digit formatting & clear stale OTP inputs
  function handleAadhaarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatAadhaarInput(e.target.value);
    setFormattedAadhaar(formatted);
    if (aadhaarError) setAadhaarError(null);
    if (otpValue) setOtpValue("");
  }

  // Step 1: Initiate Aadhaar OTP
  async function handleSendOtp() {
    const digits = formattedAadhaar.replace(/\D/g, "");
    if (digits.length !== 12) {
      setAadhaarError("Aadhaar Number must contain exactly 12 numeric digits.");
      return;
    }
    setAadhaarError(null);
    setOtpValue("");
    setOtpError(null);
    setIsSendingOtp(true);

    try {
      const res = await identityVerificationService.initiateAadhaarVerification(digits);
      setVerificationId(res.verification_id);
      setResendTimer(60);

      onChange({
        ...value,
        aadhaarStatus: "OTP_PENDING",
        maskedAadhaar: res.masked_aadhaar,
      });
    } catch (err: any) {
      setAadhaarError(err.message || "Failed to initiate Aadhaar OTP.");
    } finally {
      setIsSendingOtp(false);
    }
  }

  // Step 2: Verify OTP
  async function handleVerifyOtp() {
    const cleanOtp = otpValue.replace(/\D/g, "");
    if (cleanOtp.length !== 6) {
      setOtpError("Please enter the complete 6-digit OTP code.");
      return;
    }
    if (!verificationId) return;

    setOtpError(null);
    setIsVerifyingOtp(true);

    try {
      const res = await identityVerificationService.verifyAadhaarOtp(
        verificationId,
        cleanOtp
      );

      const isAllVerified = Boolean(value.primaryDocument);

      onChange({
        ...value,
        aadhaarStatus: res.status,
        maskedAadhaar: value.maskedAadhaar,
        isIdentityVerified: isAllVerified,
      });
    } catch (err: any) {
      setOtpError(err.message || "Invalid OTP code. Please try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
  }

  // Resend OTP
  async function handleResendOtp() {
    if (resendTimer > 0 || !verificationId) return;
    setOtpError(null);
    try {
      await identityVerificationService.resendAadhaarOtp(verificationId);
      setResendTimer(60);
    } catch (err: any) {
      setOtpError(err.message || "Failed to resend OTP.");
    }
  }

  // Reset Aadhaar form & clear all OTP / challenge state completely
  function handleResetAadhaar() {
    setVerificationId(null);
    setOtpValue("");
    setOtpError(null);
    setAadhaarError(null);
    setResendTimer(0);
    setFormattedAadhaar("");
    onChange({
      ...value,
      aadhaarStatus: "NOT_STARTED",
      maskedAadhaar: undefined,
      isIdentityVerified: false,
    });
  }

  // Connect DigiLocker Primary ID (Required)
  async function handleConnectPrimaryDoc() {
    setIsConnectingPrimary(true);
    setPrimaryError(null);
    setPrimaryState("AUTHORIZATION_PENDING");

    try {
      const doc = await identityVerificationService.retrievePrimaryDocument(primaryDocType);
      setPrimaryState("VERIFIED");

      const isAllVerified = value.aadhaarStatus === "VERIFIED";

      onChange({
        ...value,
        primaryDocument: doc,
        isIdentityVerified: isAllVerified,
      });
    } catch (err: any) {
      setPrimaryState("FAILED");
      setPrimaryError(err.message || "Failed to retrieve primary document from DigiLocker.");
    } finally {
      setIsConnectingPrimary(false);
    }
  }

  // Connect DigiLocker Secondary ID (Optional)
  async function handleConnectSecondaryDoc() {
    setIsConnectingSecondary(true);
    setSecondaryState("AUTHORIZATION_PENDING");

    try {
      const doc = await identityVerificationService.retrieveSecondaryDocument(secondaryDocType);
      setSecondaryState("VERIFIED");
      onChange({
        ...value,
        secondaryDocument: doc,
      });
    } catch {
      setSecondaryState("FAILED");
    } finally {
      setIsConnectingSecondary(false);
    }
  }

  // Skip Secondary Document
  function handleSkipSecondary() {
    setSecondaryState("NOT_CONNECTED");
    onChange({
      ...value,
      secondaryDocument: null,
    });
  }

  const isAadhaarVerified = value.aadhaarStatus === "VERIFIED";
  const isPrimaryDocVerified = Boolean(value.primaryDocument);

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner with Explicit Simulation Sandbox Notice */}
      <div className="flex items-start gap-3 p-4 rounded-card bg-amber-500/10 border border-amber-500/20 text-amber-900">
        <AlertCircle className="text-amber-600 h-5 w-5 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-foreground text-sm">
              Adopter Identity Verification
            </h4>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-800 px-2 py-0.5 rounded">
              Simulation Mode — Pre-production Sandbox
            </span>
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Government identity verification will be connected after the required backend and provider integration is available. Actions in this section demonstrate the workflow using simulated pre-production states.
          </p>
        </div>
      </div>

      {/* Part 1: Aadhaar Authentication Card */}
      <Card variant="default" className="p-5 flex flex-col gap-4 border border-border">
        <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <KeyRound size={16} />
            </div>
            <div>
              <h5 className="font-bold text-foreground text-sm">Aadhaar Authentication</h5>
              <p className="text-muted-foreground text-2xs">Required for identity matching</p>
            </div>
          </div>
          {isAadhaarVerified ? (
            <span className="px-2.5 py-1 text-2xs font-bold uppercase tracking-wider rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 flex items-center gap-1">
              <CheckCircle2 size={12} />
              Aadhaar Match (Simulated)
            </span>
          ) : (
            <span className="px-2.5 py-1 text-2xs font-bold uppercase tracking-wider rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-700">
              Pending OTP
            </span>
          )}
        </div>

        {/* Aadhaar Input State */}
        {value.aadhaarStatus === "NOT_STARTED" && (
          <div className="flex flex-col gap-3">
            <Input
              id="aadhaar-number-input"
              label="12-Digit Aadhaar Number *"
              placeholder="XXXX-XXXX-XXXX"
              value={formattedAadhaar}
              onChange={handleAadhaarChange}
              maxLength={14}
              inputMode="numeric"
              error={aadhaarError ?? undefined}
              helper="Your complete Aadhaar number will be masked immediately after verification."
            />
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleSendOtp}
              isLoading={isSendingOtp}
              disabled={isSendingOtp || formattedAadhaar.replace(/\D/g, "").length !== 12}
              className="self-start"
            >
              Send Verification OTP
            </Button>
          </div>
        )}

        {/* OTP Pending State */}
        {value.aadhaarStatus === "OTP_PENDING" && (
          <div className="flex flex-col gap-4">
            <Alert variant="info" title="Verification OTP Sent (Sandbox Test)">
              A simulated 6-digit verification code has been dispatched. Enter any 6-digit code (e.g. 123456) to test the OTP flow.
            </Alert>

            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs font-semibold">Masked Aadhaar Number</span>
                <span className="text-foreground font-mono font-bold text-sm tracking-wider">
                  {value.maskedAadhaar || "XXXX XXXX ****"}
                </span>
              </div>
              <button
                type="button"
                onClick={handleResetAadhaar}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <ArrowLeft size={12} /> Change Number
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <Input
                id="aadhaar-otp-input"
                label="Enter 6-Digit OTP *"
                placeholder="123456"
                value={otpValue}
                onChange={(e) => {
                  setOtpValue(e.target.value.replace(/\D/g, "").slice(0, 6));
                  if (otpError) setOtpError(null);
                }}
                maxLength={6}
                inputMode="numeric"
                error={otpError ?? undefined}
              />

              <div className="flex items-center justify-between gap-4 flex-wrap">
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleVerifyOtp}
                  isLoading={isVerifyingOtp}
                  disabled={isVerifyingOtp || otpValue.replace(/\D/g, "").length !== 6}
                >
                  Submit &amp; Verify OTP
                </Button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0}
                  className="text-xs font-semibold text-primary hover:underline disabled:opacity-50 disabled:no-underline flex items-center gap-1"
                >
                  <RefreshCw size={12} className={resendTimer > 0 ? "animate-spin" : ""} />
                  {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Aadhaar Verified State */}
        {isAadhaarVerified && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-emerald-600 h-5 w-5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-foreground font-semibold text-sm">
                  Aadhaar Verification Completed (Simulated Sandbox)
                </span>
                <span className="text-muted-foreground text-xs font-mono">
                  Identity Token: {value.maskedAadhaar}
                </span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleResetAadhaar}>
              Reset
            </Button>
          </div>
        )}
      </Card>

      {/* Part 2: DigiLocker Document Verification Card */}
      <Card variant="default" className="p-5 flex flex-col gap-4 border border-border">
        <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Building2 size={16} />
            </div>
            <div>
              <h5 className="font-bold text-foreground text-sm">DigiLocker Document Verification</h5>
              <p className="text-muted-foreground text-2xs">Official Government Document Integration</p>
            </div>
          </div>
          {isPrimaryDocVerified ? (
            <span className="px-2.5 py-1 text-2xs font-bold uppercase tracking-wider rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 flex items-center gap-1">
              <CheckCircle2 size={12} />
              Primary ID Received (Sandbox)
            </span>
          ) : (
            <span className="px-2.5 py-1 text-2xs font-bold uppercase tracking-wider rounded-full bg-destructive/10 border border-destructive/25 text-destructive">
              Primary ID Required
            </span>
          )}
        </div>

        {primaryError && (
          <Alert variant="error" title="DigiLocker Error">
            {primaryError}
          </Alert>
        )}

        {/* Primary Document Section (Required) */}
        <div className="flex flex-col gap-3 p-4 rounded-lg bg-secondary/30 border border-border">
          <div className="flex items-center justify-between">
            <span className="text-foreground font-semibold text-xs uppercase tracking-wider font-condensed flex items-center gap-1.5">
              <FileCheck size={14} className="text-primary" />
              Primary Government ID <span className="text-destructive">*</span>
            </span>
            <span className="text-2xs font-bold text-destructive uppercase">Required</span>
          </div>

          {!value.primaryDocument ? (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-muted-foreground text-xs font-semibold">Select Document Type</label>
                <select
                  value={primaryDocType}
                  onChange={(e) => setPrimaryDocType(e.target.value as GovernmentDocumentType)}
                  className="h-10 px-3 rounded-input bg-background border border-border text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {PRIMARY_DOCUMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {DOCUMENT_TYPE_LABELS[type]}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleConnectPrimaryDoc}
                isLoading={isConnectingPrimary}
                disabled={isConnectingPrimary}
                className="self-start"
              >
                Connect DigiLocker &amp; Retrieve Primary ID
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
              <div className="flex items-center gap-3">
                <FileText className="text-primary h-5 w-5 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-foreground font-semibold text-sm">
                    {value.primaryDocument.document_label}
                  </span>
                  <span className="text-muted-foreground text-2xs font-mono">
                    Reference: {value.primaryDocument.masked_identifier}
                  </span>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <Check size={14} /> Received (Simulated)
              </span>
            </div>
          )}
        </div>

        {/* Secondary Document Section (Optional) */}
        <div className="flex flex-col gap-3 p-4 rounded-lg bg-secondary/30 border border-border">
          <div className="flex items-center justify-between">
            <span className="text-foreground font-semibold text-xs uppercase tracking-wider font-condensed flex items-center gap-1.5">
              <FileText size={14} className="text-muted-foreground" />
              Secondary Government ID
            </span>
            <span className="text-2xs font-bold text-muted-foreground uppercase">Optional</span>
          </div>

          {!value.secondaryDocument ? (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-muted-foreground text-xs font-semibold">Select Optional Document</label>
                <select
                  value={secondaryDocType}
                  onChange={(e) => setSecondaryDocType(e.target.value as GovernmentDocumentType)}
                  className="h-10 px-3 rounded-input bg-background border border-border text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {SECONDARY_DOCUMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {DOCUMENT_TYPE_LABELS[type]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleConnectSecondaryDoc}
                  isLoading={isConnectingSecondary}
                  disabled={isConnectingSecondary}
                >
                  Connect Secondary ID
                </Button>
                <button
                  type="button"
                  onClick={handleSkipSecondary}
                  className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
                >
                  Skip Secondary ID
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
              <div className="flex items-center gap-3">
                <FileText className="text-primary h-5 w-5 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-foreground font-semibold text-sm">
                    {value.secondaryDocument.document_label}
                  </span>
                  <span className="text-muted-foreground text-2xs font-mono">
                    Reference: {value.secondaryDocument.masked_identifier}
                  </span>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <Check size={14} /> Received (Simulated)
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Privacy Safeguards Footer Notice */}
      <div className="flex items-center gap-2 text-muted-foreground text-xs">
        <Lock size={13} className="shrink-0" />
        <span>
          Privacy Protection: Your identity documents are encrypted and masked. PawGuard never stores unmasked Aadhaar numbers or raw document files.
        </span>
      </div>
    </div>
  );
}
