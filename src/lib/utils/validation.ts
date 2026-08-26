/**
 * Shared Indian mobile number validation utility.
 *
 * Accepts:
 *   9876543210
 *   8765432109
 *   7654321098
 *   6543210987
 *   +91 9876543210 / +919876543210
 *
 * Rejects:
 *   numbers starting with 0–5, wrong length, non-digit characters.
 */

/**
 * Normalise an Indian phone entry to exactly 10 digits (if possible).
 * Strips +91 / 91 prefixes, spaces, and hyphens.
 */
export function normalizeIndianPhone(value: string): string {
  // Remove all whitespace
  let v = value.replace(/\s+/g, "");
  // Strip leading +91 or country-code-only 91 (when total is 12 chars)
  if (v.startsWith("+91")) {
    v = v.slice(3);
  } else if (v.startsWith("91") && v.length === 12) {
    v = v.slice(2);
  }
  // Remove hyphens that may appear in formatted numbers
  v = v.replace(/-/g, "");
  return v;
}

/**
 * Validate an Indian mobile number (required field).
 *
 * @returns `null` if valid, or a descriptive error message string if invalid.
 */
export function validateIndianPhone(value: string): string | null {
  const raw = value.trim();
  if (!raw) {
    return "Mobile number is required.";
  }

  const normalized = normalizeIndianPhone(raw);

  // Must be exactly 10 digits
  if (!/^\d{10}$/.test(normalized)) {
    return "Enter a valid 10-digit Indian mobile number (starting with 6–9).";
  }

  // First digit must be 6, 7, 8, or 9
  const firstDigit = normalized[0];
  if (!["6", "7", "8", "9"].includes(firstDigit)) {
    return "Enter a valid 10-digit Indian mobile number (starting with 6–9).";
  }

  return null; // valid
}

/**
 * Validate an optional Indian phone field (profile page etc.).
 * Empty value → null (allowed). Non-empty → full Indian format check.
 *
 * @returns `null` if valid (including empty), or an error message string.
 */
export function validateOptionalIndianPhone(value: string): string | null {
  if (!value.trim()) return null; // optional — empty is allowed
  return validateIndianPhone(value);
}
