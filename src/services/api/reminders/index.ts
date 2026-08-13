/**
 * Smart reminders feature service.
 *
 * Feature-level API calls for the vet-care reminder module. Request/response
 * shapes are derived from the backend OpenAPI contract:
 *   https://pawguard-backend-mqri.onrender.com/redoc
 *
 *   - `GET    /companion-pets/{pet_id}/reminders`         — the pet's reminders (auth)
 *   - `POST   /companion-pets/{pet_id}/reminders`         — create a reminder (auth)
 *   - `DELETE /companion-pets/{pet_id}/reminders/{id}`    — delete a reminder (auth)
 *
 * The list endpoint returns a plain `ApiResponse<PetReminderResponse[]>` — it
 * is NOT paginated, so `apiGet` (not `apiGetPage`) is used. Reminders whose
 * `source_key` starts with `medical_record:` are auto-created by the backend
 * when a clinic record sets `next_reminder_at` — owners see those alongside
 * manual ones and can dismiss them via the same delete call.
 */

import { API_ROUTES, apiDelete, apiGet, apiPost } from "@/lib/api";
import type { PetReminderCreate, PetReminderResponse } from "@/lib/api";

export const remindersService = {
  /**
   * `GET /companion-pets/{pet_id}/reminders` — all reminders for one pet,
   * including auto-created ones from clinic medical records.
   */
  listReminders(petId: string): Promise<PetReminderResponse[]> {
    return apiGet<PetReminderResponse[]>(API_ROUTES.companionPets.reminders(petId));
  },

  /**
   * `POST /companion-pets/{pet_id}/reminders` — create a manual reminder.
   * Posting the same `source_key` again returns `409 Conflict` (idempotency).
   */
  createReminder(
    petId: string,
    data: PetReminderCreate
  ): Promise<PetReminderResponse> {
    return apiPost<PetReminderResponse>(
      API_ROUTES.companionPets.reminders(petId),
      data
    );
  },

  /**
   * `DELETE /companion-pets/{pet_id}/reminders/{reminder_id}` — soft-delete a
   * reminder so it no longer appears in the list.
   */
  deleteReminder(petId: string, reminderId: string): Promise<null> {
    return apiDelete<null>(
      API_ROUTES.companionPets.reminder(petId, reminderId)
    );
  },
};

export type { PetReminderCreate, PetReminderResponse };