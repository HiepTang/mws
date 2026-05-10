"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin-guard";
import { isGalleryCategory } from "@/lib/gallery-categories";

// ─── Reviews moderation ───────────────────────────────────────────────

export async function approveReview(reviewId: string): Promise<void> {
  const { email } = await requireAdmin();
  await db
    .update(schema.reviews)
    .set({
      status: "approved",
      approvedAt: new Date(),
      approvedBy: email,
    })
    .where(eq(schema.reviews.id, reviewId));
  revalidatePath("/admin");
  revalidatePath("/reviews");
  revalidatePath("/gallery");
}

export async function rejectReview(reviewId: string): Promise<void> {
  await requireAdmin();
  await db
    .update(schema.reviews)
    .set({
      status: "rejected",
      approvedAt: null,
      approvedBy: null,
    })
    .where(eq(schema.reviews.id, reviewId));
  revalidatePath("/admin");
  revalidatePath("/reviews");
  revalidatePath("/gallery");
}

/**
 * Override the customer's `consent_gallery` flag. Admins use this when:
 *  - A review's photo would be a great gallery feature even if the customer
 *    didn't tick the box (must verify with them out-of-band first).
 *  - A previously-approved gallery image needs to come down.
 *
 * The customer's consent_share decision is NEVER overridden here — that's
 * what governs whether the review text shows publicly.
 */
export async function setGalleryFlag(reviewId: string, value: boolean): Promise<void> {
  await requireAdmin();
  await db
    .update(schema.reviews)
    .set({ consentGallery: value })
    .where(eq(schema.reviews.id, reviewId));
  revalidatePath("/admin");
  revalidatePath("/gallery");
}

/**
 * Sets which tab a review's photo lands under on the public /gallery.
 * Defaults to "family" at insert time; admin reassigns from the moderation
 * queue once they've seen what the photo actually depicts.
 */
export async function setReviewGalleryCategory(
  reviewId: string,
  category: string,
): Promise<void> {
  await requireAdmin();
  if (!isGalleryCategory(category)) {
    throw new Error("Invalid category");
  }
  await db
    .update(schema.reviews)
    .set({ galleryCategory: category })
    .where(eq(schema.reviews.id, reviewId));
  revalidatePath("/admin");
  revalidatePath("/gallery");
}

// ─── Contacts moderation ──────────────────────────────────────────────

export async function markContactReplied(contactId: string): Promise<void> {
  await requireAdmin();
  await db
    .update(schema.contacts)
    .set({ status: "replied" })
    .where(eq(schema.contacts.id, contactId));
  revalidatePath("/admin");
}

export async function markContactArchived(contactId: string): Promise<void> {
  await requireAdmin();
  await db
    .update(schema.contacts)
    .set({ status: "archived" })
    .where(eq(schema.contacts.id, contactId));
  revalidatePath("/admin");
}

export async function reopenContact(contactId: string): Promise<void> {
  await requireAdmin();
  await db
    .update(schema.contacts)
    .set({ status: "new" })
    .where(eq(schema.contacts.id, contactId));
  revalidatePath("/admin");
}
