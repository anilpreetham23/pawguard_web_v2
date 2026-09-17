import { describe, it, expect } from "vitest";
import {
  dogSchema,
  lostFoundReportSchema,
  userSchema,
  safeValidateResponse,
} from "@/lib/api/schemas";

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

  it("safeValidateResponse falls back gracefully without throwing errors", () => {
    const invalidUserPayload = {
      id: 12345, // invalid type (number instead of string)
      email: "not-an-email",
    };

    // Should not throw, logs warning and returns payload as fallback
    const result = safeValidateResponse(userSchema, invalidUserPayload, "TestUser");
    expect(result).toBeDefined();
  });
});
