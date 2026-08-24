import type { VetClinicResponse } from "@/lib/api";

/**
 * Normalizes a string for comparison by lowercasing and stripping non-alphanumeric characters.
 */
export function normalizeString(str: string | null | undefined): string {
  if (!str) return "";
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Normalizes a phone number by removing non-digit characters.
 */
export function normalizePhone(phone: string | null | undefined): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

/**
 * Resolves a public `VeterinaryPartner` to its active `VetClinicResponse` booking record.
 * Uses a 4-tier matching strategy:
 * 1. Normalized phone number match
 * 2. Exact normalized name match
 * 3. Email match
 * 4. Substring name match
 */
export function findMatchingClinic(
  partner: { name: string; phone?: string; email?: string | null; address?: string } | null | undefined,
  clinics: VetClinicResponse[]
): VetClinicResponse | null {
  if (!partner || !clinics || clinics.length === 0) return null;

  const partnerPhone = normalizePhone(partner.phone);
  const partnerName = normalizeString(partner.name);
  const partnerEmail = normalizeString(partner.email);

  // Strategy 1: Match by phone number if present
  if (partnerPhone) {
    const phoneMatch = clinics.find((c) => {
      const clinicPhone = normalizePhone(c.phone);
      return Boolean(clinicPhone) && clinicPhone === partnerPhone;
    });
    if (phoneMatch) return phoneMatch;
  }

  // Strategy 2: Match by exact normalized name
  if (partnerName) {
    const nameMatch = clinics.find((c) => normalizeString(c.name) === partnerName);
    if (nameMatch) return nameMatch;
  }

  // Strategy 3: Match by email if present
  if (partnerEmail) {
    const emailMatch = clinics.find((c) => normalizeString(c.email) === partnerEmail);
    if (emailMatch) return emailMatch;
  }

  // Strategy 4: Fuzzy name containment match
  if (partnerName && partnerName.length > 5) {
    const fuzzyMatch = clinics.find((c) => {
      const cName = normalizeString(c.name);
      return cName.length > 5 && (cName.includes(partnerName) || partnerName.includes(cName));
    });
    if (fuzzyMatch) return fuzzyMatch;
  }

  return null;
}
