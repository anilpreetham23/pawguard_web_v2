"use server";

import { revalidateTag, revalidatePath } from "next/cache";

export type PublicCacheTag =
  | "public-blog"
  | "public-stories"
  | "public-stats"
  | "public-dogs"
  | "public-lost-found";

/**
 * On-demand cache invalidation action for public web mutations.
 * Triggers Next.js tag and path revalidation when mutations affect public content.
 */
export async function revalidatePublicData(tag?: PublicCacheTag, path?: string) {
  try {
    if (tag) {
      revalidateTag(tag);
    }
    if (path) {
      revalidatePath(path);
    }
    return { success: true };
  } catch (err) {
    console.warn(`[Revalidation Warning] Failed to revalidate tag ${tag} path ${path}:`, err);
    return { success: false, error: String(err) };
  }
}
