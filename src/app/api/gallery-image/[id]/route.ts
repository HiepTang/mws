import { GetObjectCommand } from "@aws-sdk/client-s3";
import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { db, schema } from "@/db";
import { getS3Client, S3_BUCKET } from "@/lib/s3";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Streams a curated gallery image from MinIO. Hidden images return 404 so the
 * URL effectively disappears even if it was previously cached or shared.
 */
export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;

  const [row] = await db
    .select({
      imageKey: schema.galleryImages.imageKey,
      hidden: schema.galleryImages.hidden,
    })
    .from(schema.galleryImages)
    .where(eq(schema.galleryImages.id, id))
    .limit(1);

  if (!row || row.hidden) {
    return new NextResponse("Not found", { status: 404 });
  }

  let object;
  try {
    object = await getS3Client().send(
      new GetObjectCommand({ Bucket: S3_BUCKET, Key: row.imageKey }),
    );
  } catch (err) {
    console.error("[gallery-image] S3 fetch failed:", err);
    return new NextResponse("Image unavailable", { status: 502 });
  }

  if (!object.Body) {
    return new NextResponse("Empty body", { status: 502 });
  }

  const body =
    typeof (object.Body as { transformToWebStream?: unknown }).transformToWebStream === "function"
      ? (object.Body as { transformToWebStream: () => ReadableStream }).transformToWebStream()
      : (object.Body as ReadableStream);

  const headers = new Headers();
  headers.set("Content-Type", object.ContentType ?? "image/webp");
  if (object.ContentLength !== undefined) {
    headers.set("Content-Length", String(object.ContentLength));
  }
  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  return new NextResponse(body, { status: 200, headers });
}
