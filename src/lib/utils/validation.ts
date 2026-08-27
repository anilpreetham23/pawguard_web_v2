/**
 * Shared Mobile Number Validation & Country Configuration Utility.
 *
 * Supports India (+91) as default with strict 10-digit / starting 6-9 rules,
 * alongside common international calling codes (US, UK, UAE, AU, CA, SG).
 */

export interface CountryConfig {
  code: string;        // e.g. "IN"
  name: string;        // e.g. "India"
  flag: string;        // e.g. "🇮🇳"
  dialCode: string;    // e.g. "+91"
  maxLength: number;   // e.g. 10
  minLength: number;   // e.g. 10
  placeholder: string; // e.g. "98765 43210"
}

export const SUPPORTED_COUNTRIES: CountryConfig[] = [
  {
    code: "IN",
    name: "India",
    flag: "🇮🇳",
    dialCode: "+91",
    maxLength: 10,
    minLength: 10,
    placeholder: "98765 43210",
  },
  {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    dialCode: "+1",
    maxLength: 10,
    minLength: 10,
    placeholder: "202 555 0123",
  },
  {
    code: "GB",
    name: "United Kingdom",
    flag: "🇬🇧",
    dialCode: "+44",
    maxLength: 11,
    minLength: 10,
    placeholder: "7911 123456",
  },
  {
    code: "AE",
    name: "United Arab Emirates",
    flag: "🇦🇪",
    dialCode: "+971",
    maxLength: 9,
    minLength: 9,
    placeholder: "50 123 4567",
  },
  {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    dialCode: "+61",
    maxLength: 9,
    minLength: 9,
    placeholder: "412 345 678",
  },
  {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    dialCode: "+1",
    maxLength: 10,
    minLength: 10,
    placeholder: "416 555 0123",
  },
  {
    code: "SG",
    name: "Singapore",
    flag: "🇸🇬",
    dialCode: "+65",
    maxLength: 8,
    minLength: 8,
    placeholder: "8123 4567",
  },
];

export const DEFAULT_COUNTRY = SUPPORTED_COUNTRIES[0]; // India (+91)

export function getCountryByCode(code: string): CountryConfig {
  return SUPPORTED_COUNTRIES.find((c) => c.code.toUpperCase() === code.toUpperCase()) ?? DEFAULT_COUNTRY;
}

/**
 * Normalise an Indian phone entry to exactly 10 digits (if possible).
 * Strips +91 / 91 prefixes, spaces, and hyphens.
 */
export function normalizeIndianPhone(value: string): string {
  let v = value.replace(/\s+/g, "");
  if (v.startsWith("+91")) {
    v = v.slice(3);
  } else if (v.startsWith("91") && v.length === 12) {
    v = v.slice(2);
  }
  v = v.replace(/-/g, "");
  return v;
}

/**
 * Sanitizes live mobile input as user types or pastes based on selected country.
 * Strips non-digit characters, leading dial codes if pasted, and enforces country max length.
 */
export function sanitizePhoneInput(value: string, countryCode: string = "IN"): string {
  const country = getCountryByCode(countryCode);
  let v = value.trim();

  // Strip leading international prefix if user pasted a full international string
  if (v.startsWith("+")) {
    for (const c of SUPPORTED_COUNTRIES) {
      if (v.startsWith(c.dialCode)) {
        v = v.slice(c.dialCode.length);
        break;
      }
    }
  } else if (v.startsWith("91") && countryCode === "IN" && v.replace(/\D/g, "").length > 10) {
    v = v.slice(2);
  }

  // Strip all non-digit characters
  v = v.replace(/\D/g, "");

  // Enforce country max length
  return v.slice(0, country.maxLength);
}

/**
 * Legacy wrapper for live sanitization of Indian phone input.
 */
export function sanitizeIndianPhoneInput(value: string): string {
  return sanitizePhoneInput(value, "IN");
}

/**
 * Validates phone number based on selected country configuration.
 *
 * @param nationalNumber National phone number string (digits only)
 * @param countryCode Country ISO code (default "IN")
 * @param isRequired Whether the field is mandatory (default true)
 * @returns Error string or null if valid.
 */
export function validatePhone(
  nationalNumber: string,
  countryCode: string = "IN",
  isRequired: boolean = true
): string | null {
  const raw = nationalNumber.trim();
  if (!raw) {
    return isRequired ? "Mobile number is required." : null;
  }

  const country = getCountryByCode(countryCode);
  const sanitized = raw.replace(/\D/g, "");

  // India-specific strict validation
  if (country.code === "IN") {
    if (sanitized.length !== 10) {
      return "Enter a valid 10-digit Indian mobile number starting with 6–9.";
    }
    const firstDigit = sanitized[0];
    if (!["6", "7", "8", "9"].includes(firstDigit)) {
      return "Enter a valid 10-digit Indian mobile number starting with 6–9.";
    }
    return null;
  }

  // Country-specific length validation for other supported countries
  if (sanitized.length < country.minLength || sanitized.length > country.maxLength) {
    return `Enter a valid phone number for ${country.name} (${country.dialCode}).`;
  }

  return null;
}

/**
 * Validate an Indian mobile number (required field).
 */
export function validateIndianPhone(value: string): string | null {
  return validatePhone(value, "IN", true);
}

/**
 * Validate an optional Indian phone field (profile page etc.).
 */
export function validateOptionalIndianPhone(value: string): string | null {
  return validatePhone(value, "IN", false);
}

/**
 * Combines national number and country dial code into appropriate payload format.
 * For India ("IN"), preserves the exact 10-digit Indian format ("9876543210") expected by existing backend contracts.
 * For international countries, prepends country dial code (e.g. "+12025550123").
 */
export function normalizePhonePayload(nationalNumber: string, countryCode: string = "IN"): string {
  const sanitized = nationalNumber.replace(/\D/g, "");
  if (!sanitized) return "";
  const country = getCountryByCode(countryCode);
  if (country.code === "IN") {
    return sanitized; // Exactly 10 digits e.g. "9876543210"
  }
  return `${country.dialCode}${sanitized}`; // e.g. "+12025550123"
}
