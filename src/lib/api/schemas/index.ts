import { z } from "zod";

/* -------------------------------------------------------------------------- */
/* Generic Envelopes & Meta                                                   */
/* -------------------------------------------------------------------------- */

export const paginationMetaSchema = z.object({
  total: z.number(),
  page: z.number(),
  page_size: z.number(),
  total_pages: z.number(),
});

export function createApiResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    success: z.boolean(),
    data: dataSchema.nullable(),
    message: z.string().nullable().optional(),
  });
}

export function createPaginatedResponseSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    success: z.boolean(),
    data: z.array(itemSchema),
    meta: paginationMetaSchema,
  });
}

/* -------------------------------------------------------------------------- */
/* Core DTO Schemas                                                           */
/* -------------------------------------------------------------------------- */

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  full_name: z.string(),
  phone: z.string().optional().nullable(),
  role: z.string().optional().nullable(),
  is_active: z.boolean().optional(),
});

export const authResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string().optional().nullable(),
  token_type: z.string().default("bearer"),
  user: userSchema.optional().nullable(),
});

export const dogSchema = z.object({
  id: z.string(),
  name: z.string(),
  breed: z.string().optional().nullable(),
  age_months: z.number().optional().nullable(),
  gender: z.enum(["male", "female", "unknown"]).optional().nullable(),
  size: z.enum(["small", "medium", "large", "extra_large"]).optional().nullable(),
  status: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  primary_photo_url: z.string().optional().nullable(),
  photos: z.array(z.string()).optional().default([]),
  medical_notes: z.string().optional().nullable(),
  is_vaccinated: z.boolean().optional(),
  is_neutered: z.boolean().optional(),
  location: z.string().optional().nullable(),
  slug: z.string().optional().nullable(),
});

export const lostFoundReportSchema = z.object({
  id: z.string(),
  type: z.enum(["lost", "found"]),
  pet_name: z.string().optional().nullable(),
  species: z.string().optional().default("dog"),
  breed: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  location_name: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  description: z.string().optional().nullable(),
  photo_urls: z.array(z.string()).optional().default([]),
  status: z.string().optional().default("active"),
  reported_at: z.string().optional().nullable(),
  contact_phone: z.string().optional().nullable(),
});

export const blogPostSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  content: z.string().optional().nullable(),
  excerpt: z.string().optional().nullable(),
  cover_image: z.string().optional().nullable(),
  author: z.string().optional().nullable(),
  published_at: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  read_time: z.string().optional().nullable(),
});

export const successStorySchema = z.object({
  id: z.string(),
  dog_name: z.string().optional().nullable(),
  adopter_name: z.string().optional().nullable(),
  title: z.string(),
  story: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  body: z.string().optional().nullable(),
  photo_url: z.string().optional().nullable(),
  hero_image_url: z.string().optional().nullable(),
  cover_image_url: z.string().optional().nullable(),
  adopted_date: z.string().optional().nullable(),
  published_at: z.string().optional().nullable(),
});

export const rescueRequestSchema = z.object({
  id: z.string(),
  ticket_number: z.string(),
  reporter_name: z.string().optional().nullable(),
  reporter_phone: z.string().optional().nullable(),
  location_address: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
});

export const publicHeroStatsSchema = z.object({
  total_rescued: z.number().optional().default(0),
  active_care_count: z.number().optional().default(0),
  successful_adoptions: z.number().optional().default(0),
  urgent_rescue_count: z.number().optional().default(0),
});

/* -------------------------------------------------------------------------- */
/* Runtime Validation Helper                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Validates data against a Zod schema.
 * In development / testing, throws or logs validation warnings.
 * In production, logs error and returns data cleanly (graceful fallback).
 */
export function safeValidateResponse<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context: string = "API Response"
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.warn(`[Zod Validation Warning] ${context}:`, result.error.format());
    // Return unparsed data cast as T for safe graceful runtime degradation
    return data as T;
  }
  return result.data;
}
