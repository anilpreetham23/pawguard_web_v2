import { describe, it, expect } from "vitest";
import {
  normalizeIndianPhone,
  sanitizePhoneInput,
  validatePhone,
  normalizePhonePayload,
  getCountryByCode,
} from "@/lib/utils/validation";

describe("Phone Validation Utility", () => {
  it("normalizes Indian phone inputs correctly", () => {
    expect(normalizeIndianPhone("+919876543210")).toBe("9876543210");
    expect(normalizeIndianPhone("919876543210")).toBe("9876543210");
    expect(normalizeIndianPhone("98765-43210")).toBe("9876543210");
  });

  it("sanitizes phone input per country max length", () => {
    expect(sanitizePhoneInput("9876543210123", "IN")).toBe("9876543210");
    expect(sanitizePhoneInput("+12025550123", "US")).toBe("2025550123");
  });

  it("validates Indian phone numbers strictly", () => {
    expect(validatePhone("9876543210", "IN")).toBeNull();
    expect(validatePhone("5876543210", "IN")).toContain("starting with 6–9");
    expect(validatePhone("98765", "IN")).toContain("10-digit");
  });

  it("formats phone payloads accurately for backend compatibility", () => {
    expect(normalizePhonePayload("9876543210", "IN")).toBe("9876543210");
    expect(normalizePhonePayload("2025550123", "US")).toBe("+12025550123");
  });

  it("retrieves country configurations fallback to IN", () => {
    expect(getCountryByCode("US").dialCode).toBe("+1");
    expect(getCountryByCode("XYZ").code).toBe("IN");
  });
});
