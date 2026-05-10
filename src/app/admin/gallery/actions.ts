"use server";

import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { and, asc, desc, eq, gt, lt } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin-guard";
import { isGalleryCategory } from "@/lib/gallery-categories";
import { getS3Client, S3_BUCKET } from "@/lib/s3";

const MAX_IMAGE_BYTES = 12 * 1024 * 1024; // matches /reviews + Caddy
const ACCEPTED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

export type GalleryActionResult =
  | { ok: true }
  | { ok: false; message: string };

// ─── Create ───────────────────────────────────────────────────────────

export async function createGalleryImage(
  _prev: GalleryActionResult,
  formData: FormData,
): Promise<GalleryActionResult> {
  const { email } = await requireAdmin();

  const file = formData.get("image");
  const caption = String(formData.get("caption") ?? "").trim().slice(0, 200) || null;
  const category = String(formData.get("category") ?? "");

  if (!isGalleryCategory(category)) {
    return { ok: false, message: "Pick a category." };
  }
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Pick a photo to upload." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    return { ok: false, message: `Photo is too large (${mb} MB). Limit is 12 MB.` };
  }
  if (!ACCEPTED_MIME.has(file.type)) {
    return { ok: false, message: "Unsupported format. Use JPEG, PNG, WebP, or HEIC." };
  }

  // Sharp resize + EXIF strip + WebP, same as the review pipeline.
  let processed;
  try {
    const buf = Buffer.from(await file.arrayBuffer());
    processed = await sharp(buf, { failOn: "none" })
      .rotate()
      .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 84 })
      .toBuffer({ resolveWithObject: true });
  } catch (err) {
    console.error("[gallery] sharp processing failed:", err);
    return { ok: false, message: "Couldn't process that image. Try a different file." };
  }

  // Insert first so we have an id for the bucket key. We do INSERT...RETURNING
  // so we don't have to roundtrip a SELECT.
  let row: { id: string };
  try {
    // sort_order: append to the end of the chosen category (max + 10).
    const [maxRow] = await db
      .select({ max: schema.galleryImages.sortOrder })
      .from(schema.galleryImages)
      .where(eq(schema.galleryImages.category, category))
      .orderBy(desc(schema.galleryImages.sortOrder))
      .limit(1);
    const nextOrder = (maxRow?.max ?? 0) + 10;

    const [inserted] = await db
      .insert(schema.galleryImages)
      .values({
        imageKey: "pending", // overwrite below once we have the id
        imageWidth: processed.info.width,
        imageHeight: processed.info.height,
        imageSize: processed.info.size,
        category,
        caption,
        sortOrder: nextOrder,
        uploadedBy: email,
      })
      .returning({ id: schema.galleryImages.id });
    row = inserted;
  } catch (err) {
    console.error("[gallery] DB insert failed:", err);
    return { ok: false, message: "Database error. Please try again." };
  }

  const key = `gallery/${row.id}/original.webp`;

  try {
    await getS3Client().send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: processed.data,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
  } catch (err) {
    console.error("[gallery] S3 upload failed:", err);
    // Roll back the row so we don't leave dangling records.
    await db.delete(schema.galleryImages).where(eq(schema.galleryImages.id, row.id));
    return { ok: false, message: "Storage error. Please try again." };
  }

  await db
    .update(schema.galleryImages)
    .set({ imageKey: key })
    .where(eq(schema.galleryImages.id, row.id));

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");

  return { ok: true };
}

// ─── Update / move / hide / delete ────────────────────────────────────

export async function updateGalleryImage(
  id: string,
  data: { caption?: string; category?: string },
): Promise<void> {
  await requireAdmin();

  const patch: { caption?: string | null; category?: string } = {};
  if (data.caption !== undefined) {
    patch.caption = data.caption.trim().slice(0, 200) || null;
  }
  if (data.category !== undefined) {
    if (!isGalleryCategory(data.category)) throw new Error("Invalid category");
    patch.category = data.category;
  }
  if (Object.keys(patch).length === 0) return;

  await db.update(schema.galleryImages).set(patch).where(eq(schema.galleryImages.id, id));
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function moveGalleryImage(id: string, direction: "up" | "down"): Promise<void> {
  await requireAdmin();

  const [row] = await db
    .select({
      id: schema.galleryImages.id,
      category: schema.galleryImages.category,
      sortOrder: schema.galleryImages.sortOrder,
    })
    .from(schema.galleryImages)
    .where(eq(schema.galleryImages.id, id))
    .limit(1);
  if (!row) return;

  const cmp = direction === "up" ? lt : gt;
  const order = direction === "up" ? desc : asc;

  const [neighbor] = await db
    .select({
      id: schema.galleryImages.id,
      sortOrder: schema.galleryImages.sortOrder,
    })
    .from(schema.galleryImages)
    .where(
      and(
        eq(schema.galleryImages.category, row.category),
        cmp(schema.galleryImages.sortOrder, row.sortOrder),
      ),
    )
    .orderBy(order(schema.galleryImages.sortOrder))
    .limit(1);

  if (!neighbor) return; // already at top/bottom

  // Swap sort orders.
  await db.transaction(async (tx) => {
    await tx
      .update(schema.galleryImages)
      .set({ sortOrder: neighbor.sortOrder })
      .where(eq(schema.galleryImages.id, row.id));
    await tx
      .update(schema.galleryImages)
      .set({ sortOrder: row.sortOrder })
      .where(eq(schema.galleryImages.id, neighbor.id));
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function toggleGalleryImageHidden(id: string): Promise<void> {
  await requireAdmin();

  const [row] = await db
    .select({ hidden: schema.galleryImages.hidden })
    .from(schema.galleryImages)
    .where(eq(schema.galleryImages.id, id))
    .limit(1);
  if (!row) return;

  await db
    .update(schema.galleryImages)
    .set({ hidden: !row.hidden })
    .where(eq(schema.galleryImages.id, id));

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function deleteGalleryImage(id: string): Promise<void> {
  await requireAdmin();

  const [row] = await db
    .select({ imageKey: schema.galleryImages.imageKey })
    .from(schema.galleryImages)
    .where(eq(schema.galleryImages.id, id))
    .limit(1);
  if (!row) return;

  // Delete from S3 first; if that fails we keep the row so we can retry,
  // rather than ending up with an orphaned object in the bucket.
  try {
    await getS3Client().send(
      new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: row.imageKey }),
    );
  } catch (err) {
    console.error("[gallery] S3 delete failed:", err);
    throw new Error("Storage error — image not deleted. Please try again.");
  }

  await db.delete(schema.galleryImages).where(eq(schema.galleryImages.id, id));
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}
