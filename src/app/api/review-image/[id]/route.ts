import { GetObjectCommand } from "@aws-sdk/client-s3";
import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { db, schema } from "@/db";
import { getS3Client, S3_BUCKET } from "@/lib/s3";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Streams a review image from MinIO. Approved-and-publicly-shared images are
 * cacheable; pending or rejected images require an admin session. Customers
 * never see the raw S3 URL.
 */
export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;

  const [review] = await db
    .select({
      status: schema.reviews.status,
      consentShare: schema.reviews.consentShare,
      consentGallery: schema.reviews.consentGallery,
      imageKey: schema.reviews.imageKey,
    })
    .from(schema.reviews)
    .where(eq(schema.reviews.id, id))
    .limit(1);

  if (!review || !review.imageKey) {
    return new NextResponse("Not found", { status: 404 });
  }

  const isPublic =
    review.status === "approved" && (review.consentShare || review.consentGallery);

  if (!isPublic) {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  let object;
  try {
    object = await getS3Client().send(
      new GetObjectCommand({ Bucket: S3_BUCKET, Key: review.imageKey }),
    );
  } catch (err) {
    console.error("[review-image] S3 fetch failed:", err);
    return new NextResponse("Image unavailable", { status: 502 });
  }

  if (!object.Body) {
    return new NextResponse("Empty body", { status: 502 });
  }

  // Body is a Node Readable in Node runtime. Convert to a Web ReadableStream
  // so NextResponse can pipe it. AWS SDK v3's Body.transformToWebStream() does
  // this when available.
  const body =
    typeof (object.Body as { transformToWebStream?: unknown }).transformToWebStream === "function"
      ? (object.Body as { transformToWebStream: () => ReadableStream }).transformToWebStream()
      : (object.Body as ReadableStream);

  const headers = new Headers();
  headers.set("Content-Type", object.ContentType ?? "image/webp");
  if (object.ContentLength !== undefined) {
    headers.set("Content-Length", String(object.ContentLength));
  }
  // Approved + share/gallery consent: long-lived cache (Next/Image will fetch
  // and re-cache its own optimized variants). Pending/rejected: never cache.
  headers.set(
    "Cache-Control",
    isPublic ? "public, max-age=31536000, immutable" : "private, no-store",
  );

  return new NextResponse(body, { status: 200, headers });
}
