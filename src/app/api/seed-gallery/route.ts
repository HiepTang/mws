import { PutObjectCommand } from "@aws-sdk/client-s3";
import { desc, eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import sharp from "sharp";
import { db, schema } from "@/db";
import { isGalleryCategory } from "@/lib/gallery-categories";
import { getS3Client, S3_BUCKET } from "@/lib/s3";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * One-shot gallery seeder. Bearer-token gated; only enabled when
 * SEED_GALLERY_TOKEN is set in the runtime environment. After the seed
 * batch is loaded, unset the env var (or delete this route entirely).
 *
 * Accepts multipart/form-data with fields:
 *   - image    : the photo file
 *   - category : one of the GALLERY_CATEGORIES values
 *   - caption  : optional caption string
 */
export async function POST(req: NextRequest) {
  const expected = process.env.SEED_GALLERY_TOKEN;
  if (!expected) {
    return new NextResponse("Seeder disabled", { status: 410 });
  }

  const auth = req.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (token !== expected) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch (err) {
    return NextResponse.json({ ok: false, message: "Invalid multipart body", err: String(err) }, { status: 400 });
  }

  const file = form.get("image");
  const category = String(form.get("category") ?? "");
  const captionRaw = form.get("caption");
  const caption = captionRaw ? String(captionRaw).trim().slice(0, 200) || null : null;

  if (!isGalleryCategory(category)) {
    return NextResponse.json({ ok: false, message: "Invalid category" }, { status: 400 });
  }
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ ok: false, message: "Missing image file" }, { status: 400 });
  }

  // Sharp pipeline mirrors src/app/admin/gallery/actions.ts createGalleryImage.
  let processed;
  try {
    const buf = Buffer.from(await file.arrayBuffer());
    processed = await sharp(buf, { failOn: "none" })
      .rotate()
      .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 84 })
      .toBuffer({ resolveWithObject: true });
  } catch (err) {
    console.error("[seed-gallery] sharp failed:", err);
    return NextResponse.json({ ok: false, message: "Image processing failed" }, { status: 500 });
  }

  // Append to the end of this category (max sort_order + 10).
  const [maxRow] = await db
    .select({ max: schema.galleryImages.sortOrder })
    .from(schema.galleryImages)
    .where(eq(schema.galleryImages.category, category))
    .orderBy(desc(schema.galleryImages.sortOrder))
    .limit(1);
  const nextOrder = (maxRow?.max ?? 0) + 10;

  let row: { id: string };
  try {
    const [inserted] = await db
      .insert(schema.galleryImages)
      .values({
        imageKey: "pending",
        imageWidth: processed.info.width,
        imageHeight: processed.info.height,
        imageSize: processed.info.size,
        category,
        caption,
        sortOrder: nextOrder,
        uploadedBy: "seed",
      })
      .returning({ id: schema.galleryImages.id });
    row = inserted;
  } catch (err) {
    console.error("[seed-gallery] db insert failed:", err);
    return NextResponse.json({ ok: false, message: "DB insert failed" }, { status: 500 });
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
    console.error("[seed-gallery] S3 upload failed:", err);
    await db.delete(schema.galleryImages).where(eq(schema.galleryImages.id, row.id));
    return NextResponse.json({ ok: false, message: "S3 upload failed" }, { status: 500 });
  }

  await db
    .update(schema.galleryImages)
    .set({ imageKey: key })
    .where(eq(schema.galleryImages.id, row.id));

  return NextResponse.json({
    ok: true,
    id: row.id,
    category,
    caption,
    dimensions: { width: processed.info.width, height: processed.info.height },
    sizeKB: Math.round(processed.info.size / 1024),
  });
}
