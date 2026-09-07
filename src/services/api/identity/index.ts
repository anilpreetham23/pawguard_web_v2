/**
 * Identity Verification Service Abstraction (Pre-production Sandbox Simulation).
 *
 * Provides a clean interface for Aadhaar OTP authentication and DigiLocker
 * government document verification within the public adoption application workflow.
 *
 * PRE-PRODUCTION SANDBOX DISCLAIMER:
 * - This implementation is purely a client-side frontend abstraction for previewing
 *   and testing the adoption identity verification workflow.
 * - DOES NOT call real UIDAI / Aadhaar OTP endpoints or verify mobile linkage.
 * - DOES NOT send real SMS OTPs.
 * - DOES NOT connect to real DigiLocker OAuth or government document servers.
 * - DOES NOT store or transmit real government identity records.
 *
 * FUTURE BACKEND INTEGRATION:
 * - When backend identity endpoints are ready, only the internal method
 *   implementations inside this file will be updated to execute real HTTP API calls.
 * - UI components consuming `identityVerificationService` will not require structural rewrites.
 *
 * SECURITY & PRIVACY SAFEGUARDS:
 * - Aadhaar numbers are immediately masked (`XXXX XXXX 5678`).
 * - Raw 12-digit Aadhaar values and OTP strings are NEVER logged, stored in browser storage
 *   (localStorage/sessionStorage), or exposed in URLs.
 */

export type AadhaarVerificationState =
  | "NOT_STARTED"
  | "OTP_PENDING"
  | "VERIFICATION_PENDING"
  | "VERIFIED"
  | "FAILED"
  | "MANUAL_REVIEW";

export type DigiLockerDocumentState =
  | "NOT_CONNECTED"
  | "AUTHORIZATION_REQUIRED"
  | "AUTHORIZATION_PENDING"
  | "DOCUMENT_SELECTION"
  | "DOCUMENT_RETRIEVAL_PENDING"
  | "DOCUMENT_RECEIVED"
  | "VERIFIED"
  | "FAILED"
  | "MANUAL_REVIEW";

export type GovernmentDocumentType =
  | "aadhaar_card"
  | "driving_licence"
  | "voter_id"
  | "passport"
  | "pan_card"
  | "ration_card"
  | "utility_bill";

export interface VerificationDocumentRecord {
  document_type: GovernmentDocumentType;
  document_label: string;
  is_primary: boolean;
  masked_identifier?: string;
  issuer_authority?: string;
  received_at: string;
  status: "RECEIVED" | "VERIFIED" | "PENDING_REVIEW";
}

export interface IdentityVerificationSession {
  verification_id: string;
  aadhaar_state: AadhaarVerificationState;
  digilocker_state: DigiLockerDocumentState;
  masked_aadhaar?: string;
  aadhaar_verified_at?: string;
  primary_document?: VerificationDocumentRecord | null;
  secondary_document?: VerificationDocumentRecord | null;
  overall_status: "PENDING" | "READY" | "REQUIRES_REVIEW" | "FAILED";
  expires_at?: string;
}

export interface AadhaarInitiateResponse {
  verification_id: string;
  masked_aadhaar: string;
  otp_sent_to: string;
  expires_in_seconds: number;
}

export interface AadhaarVerifyResponse {
  verification_id: string;
  masked_aadhaar: string;
  verified: boolean;
  status: AadhaarVerificationState;
  timestamp: string;
}

export const DOCUMENT_TYPE_LABELS: Record<GovernmentDocumentType, string> = {
  aadhaar_card: "Aadhaar Card (UIDAI)",
  driving_licence: "Driving Licence (MoRTH)",
  voter_id: "Voter Identity Card (ECI)",
  passport: "Indian Passport (MEA)",
  pan_card: "PAN Card (Income Tax Dept)",
  ration_card: "State Ration Card",
  utility_bill: "Electricity / Water Utility Bill",
};

export const PRIMARY_DOCUMENT_TYPES: GovernmentDocumentType[] = [
  "aadhaar_card",
  "driving_licence",
  "voter_id",
  "passport",
];

export const SECONDARY_DOCUMENT_TYPES: GovernmentDocumentType[] = [
  "pan_card",
  "ration_card",
  "utility_bill",
  "driving_licence",
];

/** Utility function to mask a 12-digit Aadhaar string safely. */
export function maskAadhaarNumber(rawAadhaar: string): string {
  const digits = rawAadhaar.replace(/\D/g, "");
  if (digits.length < 4) return "XXXX XXXX XXXX";
  const last4 = digits.slice(-4);
  return `XXXX XXXX ${last4}`;
}

/** Format 12 digits with visual dashes `XXXX-XXXX-XXXX` for input fields. */
export function formatAadhaarInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 12);
  const parts: string[] = [];
  for (let i = 0; i < digits.length; i += 4) {
    parts.push(digits.slice(i, i + 4));
  }
  return parts.join("-");
}

export const identityVerificationService = {
  /**
   * [SANDBOX SIMULATION] `initiateAadhaarVerification`
   *
   * Validates 12-digit Aadhaar input and creates a simulated OTP challenge session.
   * Returns a masked representation. Does NOT send real SMS or call UIDAI APIs.
   */
  async initiateAadhaarVerification(rawAadhaar: string): Promise<AadhaarInitiateResponse> {
    const digits = rawAadhaar.replace(/\D/g, "");
    if (digits.length !== 12) {
      throw new Error("Aadhaar Number must contain exactly 12 numeric digits.");
    }
    const masked = maskAadhaarNumber(digits);
    const verificationId = `sbx_adh_${Math.random().toString(36).substring(2, 10)}`;

    return {
      verification_id: verificationId,
      masked_aadhaar: masked,
      otp_sent_to: "Simulated Mobile Sandbox (****)",
      expires_in_seconds: 600,
    };
  },

  /**
   * [SANDBOX SIMULATION] `verifyAadhaarOtp`
   *
   * Simulates 6-digit OTP verification. Accepts any valid 6-digit code for sandbox testing.
   * Does NOT connect to UIDAI authentication servers.
   */
  async verifyAadhaarOtp(verificationId: string, otp: string): Promise<AadhaarVerifyResponse> {
    const cleanOtp = otp.replace(/\D/g, "");
    if (cleanOtp.length !== 6) {
      throw new Error("OTP must be a 6-digit verification code.");
    }

    return {
      verification_id: verificationId,
      masked_aadhaar: "XXXX XXXX ****",
      verified: true,
      status: "VERIFIED",
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * [SANDBOX SIMULATION] `resendAadhaarOtp`
   *
   * Simulates OTP re-issuance for sandbox preview.
   */
  async resendAadhaarOtp(verificationId: string): Promise<{ success: boolean; message: string }> {
    if (!verificationId) throw new Error("Active verification ID required.");
    return {
      success: true,
      message: "Simulated 6-digit OTP code dispatched in sandbox mode.",
    };
  },

  /**
   * [SANDBOX SIMULATION] `retrievePrimaryDocument`
   *
   * Simulates DigiLocker primary document retrieval by returning a synthetic sandbox record.
   * Does NOT connect to DigiLocker OAuth or government servers.
   */
  async retrievePrimaryDocument(documentType: GovernmentDocumentType): Promise<VerificationDocumentRecord> {
    return {
      document_type: documentType,
      document_label: DOCUMENT_TYPE_LABELS[documentType] || "Sandbox Government Document",
      is_primary: true,
      masked_identifier: `SANDBOX-DOC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      issuer_authority: "Sandbox Identity Provider (Pre-Production)",
      received_at: new Date().toISOString(),
      status: "VERIFIED",
    };
  },

  /**
   * [SANDBOX SIMULATION] `retrieveSecondaryDocument`
   *
   * Simulates DigiLocker secondary document retrieval by returning a synthetic sandbox record.
   * Does NOT connect to DigiLocker OAuth or government servers.
   */
  async retrieveSecondaryDocument(documentType: GovernmentDocumentType): Promise<VerificationDocumentRecord> {
    return {
      document_type: documentType,
      document_label: DOCUMENT_TYPE_LABELS[documentType] || "Sandbox Secondary Document",
      is_primary: false,
      masked_identifier: `SANDBOX-SEC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      issuer_authority: "Sandbox Identity Provider (Pre-Production)",
      received_at: new Date().toISOString(),
      status: "VERIFIED",
    };
  },
};
