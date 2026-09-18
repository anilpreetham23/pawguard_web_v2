import { describe, it, expect } from "vitest";
import {
  dogSchema,
  lostFoundReportSchema,
  userSchema,
  createApiResponseSchema,
  safeValidateResponse,
} from "@/lib/api/schemas";
import { ApiError } from "@/lib/api/errors";

describe("Zod API Response Validation Schemas", () => {
  it("validates a valid dog DTO payload", () => {
    const validDog = {
      id: "dog-123",
      name: "Buddy",
      breed: "Golden Retriever",
      gender: "male",
      size: "large",
      status: "available",
      photos: ["https://example.com/dog.jpg"],
    };

    const parsed = dogSchema.safeParse(validDog);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.name).toBe("Buddy");
    }
  });

  it("validates a lost/found report payload", () => {
    const validReport = {
      id: "report-456",
      type: "found",
      pet_name: "Unknown Dog",
      species: "dog",
      status: "active",
      location_name: "Central Park",
    };

    const parsed = lostFoundReportSchema.safeParse(validReport);
    expect(parsed.success).toBe(true);
  });

  it("safeValidateResponse throws ApiError on invalid field types", () => {
    const invalidUserPayload = {
      id: 12345, // invalid type (number instead of string)
      email: "not-an-email",
    };

    expect(() =>
      safeValidateResponse(userSchema, invalidUserPayload, "TestUser")
    ).toThrowError(ApiError);
  });

  it("safeValidateResponse throws ApiError on missing required fields", () => {
    const missingFieldPayload = {
      name: "No ID",
    };

    expect(() =>
      safeValidateResponse(dogSchema, missingFieldPayload, "TestDog")
    ).toThrowError(ApiError);
  });

  it("validates malformed envelopes securely", () => {
    const malformedEnvelope = {
      success: "yes", // boolean expected
      data: null,
    };

    const envelopeSchema = createApiResponseSchema(userSchema);
    const parsed = envelopeSchema.safeParse(malformedEnvelope);
    expect(parsed.success).toBe(false);
  });
});
