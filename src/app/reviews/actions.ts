"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { Resend } from "resend";
import sharp from "sharp";
import { z } from "zod";
import { db, schema } from "@/db";
import { parseOwnerRecipients } from "@/lib/email";
import { getS3Client, S3_BUCKET } from "@/lib/s3";

// ─── Validation ───────────────────────────────────────────────────────

const SERVICE_TAGS = [
  "Tea Ceremony",
  "Áo Dài",
  "Hair & Makeup",
  "MC",
  "Catering & Cake",
  "Flowers & Decor",
  "Live Band / DJ",
  "Photography",
  "Limousine",
  "Full Package",
] as const;

const ReviewSchema = z.object({
  coupleNames: z.string().trim().min(1, "Please tell us your names").max(120),
  emailPrivate: z.string().trim().email("Please enter a valid email").max(200),
  weddingDate: z.string().trim().max(40).optional().or(z.literal("")),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  rating: z.coerce.number().int().min(1, "Pick a star rating").max(5),
  body: z
    .string()
    .trim()
    .min(20, "A few sentences please — even short reviews help")
    .max(5000),
  serviceTags: z.array(z.string()).max(20).optional().default([]),
  language: z.enum(["en", "vi"]).default("en"),
  consentShare: z.literal("on").or(z.literal("true")).optional(),
  consentGallery: z.literal("on").or(z.literal("true")).optional(),
  turnstileToken: z.string().optional().default(""),
});

type ReviewInput = z.infer<typeof ReviewSchema>;

export type ReviewValues = {
  coupleNames: string;
  emailPrivate: string;
  weddingDate: string;
  city: string;
  rating: number;
  body: string;
  serviceTags: string[];
  consentShare: boolean;
  consentGallery: boolean;
};

export type ReviewState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<keyof ReviewInput | "image", string>>;
  values?: ReviewValues;
  attempt?: number;
};

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB hard limit at the form
const ACCEPTED_IMAGE_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);

// ─── Helpers ──────────────────────────────────────────────────────────

async function verifyTurnstile(token: string, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.warn("[reviews] TURNSTILE_SECRET_KEY is not set in production");
    }
    return true;
  }
  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error("[reviews] Turnstile verify failed:", err);
    return false;
  }
}

async function processAndUploadImage(
  file: File,
  reviewId: string,
): Promise<{ key: string; width: number; height: number; size: number } | null> {
  if (!file || file.size === 0) return null;
  if (file.size > MAX_IMAGE_BYTES) {
    throw new ImageError("Image is too large (max 10 MB).");
  }
  if (!ACCEPTED_IMAGE_MIME.has(file.type)) {
    throw new ImageError("Unsupported image format. Use JPEG, PNG, WebP, or HEIC.");
  }

  const buf = Buffer.from(await file.arrayBuffer());

  // Resize the longest edge to 2000px (no upscaling), strip EXIF / metadata,
  // and re-encode to WebP. Sharp will rotate the image based on EXIF
  // orientation before stripping metadata so the visible orientation is
  // preserved.
  const processed = await sharp(buf, { failOn: "none" })
    .rotate()
    .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer({ resolveWithObject: true });

  const key = `reviews/${reviewId}/original.webp`;

  const client = getS3Client();
  await client.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: processed.data,
      ContentType: "image/webp",
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return {
    key,
    width: processed.info.width,
    height: processed.info.height,
    size: processed.info.size,
  };
}

class ImageError extends Error {}

async function sendOwnerNotification(input: ReviewInput, reviewId: string, hasImage: boolean) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const to = parseOwnerRecipients(process.env.EMAIL_TO_OWNER);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mws.kho-ai.com";

  if (!apiKey || !from || !to) {
    console.warn(
      "[reviews] Resend not fully configured (need RESEND_API_KEY, EMAIL_FROM, EMAIL_TO_OWNER); skipping notification",
    );
    return;
  }

  const stars = "★".repeat(input.rating) + "☆".repeat(5 - input.rating);
  const lines = [
    `New review submitted — pending your approval`,
    ``,
    `${stars}  (${input.rating}/5)`,
    ``,
    `From:        ${input.coupleNames}`,
    `Email:       ${input.emailPrivate}`,
    input.weddingDate ? `Wedding:     ${input.weddingDate}` : null,
    input.city ? `City:        ${input.city}` : null,
    input.serviceTags.length ? `Services:    ${input.serviceTags.join(", ")}` : null,
    `Language:    ${input.language}`,
    `Photo:       ${hasImage ? "yes" : "no"}`,
    `Public OK:   ${input.consentShare ? "yes" : "no"}`,
    `Gallery OK:  ${input.consentGallery ? "yes" : "no"}`,
    ``,
    `Review:`,
    input.body,
    ``,
    `—`,
    `Approve or reject in the admin queue: ${siteUrl}/admin`,
    `Submission ID: ${reviewId}`,
  ].filter(Boolean) as string[];

  const resend = new Resend(apiKey);
  try {
    await resend.emails.send({
      from,
      to,
      replyTo: input.emailPrivate,
      subject: `New review: ${stars} — ${input.coupleNames}`,
      text: lines.join("\n"),
    });
  } catch (err) {
    console.error("[reviews] Resend send failed:", err);
  }
}

// ─── Server action ────────────────────────────────────────────────────

export async function submitReview(_prev: ReviewState, formData: FormData): Promise<ReviewState> {
  if (formData.get("website")) {
    // Honeypot tripped — pretend success so the bot moves on.
    return { status: "success" };
  }

  const raw = {
    coupleNames: String(formData.get("coupleNames") ?? ""),
    emailPrivate: String(formData.get("emailPrivate") ?? ""),
    weddingDate: String(formData.get("weddingDate") ?? ""),
    city: String(formData.get("city") ?? ""),
    rating: String(formData.get("rating") ?? ""),
    body: String(formData.get("body") ?? ""),
    serviceTags: formData.getAll("serviceTags").map((v) => String(v)),
    language: String(formData.get("language") ?? "en"),
    consentShare: formData.get("consentShare") ? "on" : undefined,
    consentGallery: formData.get("consentGallery") ? "on" : undefined,
    turnstileToken: String(formData.get("cf-turnstile-response") ?? ""),
  };

  const submittedValues: ReviewValues = {
    coupleNames: raw.coupleNames,
    emailPrivate: raw.emailPrivate,
    weddingDate: raw.weddingDate,
    city: raw.city,
    rating: Number(raw.rating) || 0,
    body: raw.body,
    serviceTags: raw.serviceTags,
    consentShare: raw.consentShare === "on",
    consentGallery: raw.consentGallery === "on",
  };

  const nextAttempt = (_prev.attempt ?? 0) + 1;

  const parsed = ReviewSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: ReviewState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ReviewInput;
      if (!errors[key]) errors[key] = issue.message;
    }
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      errors,
      values: submittedValues,
      attempt: nextAttempt,
    };
  }
  const data = parsed.data;

  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() ?? headerList.get("x-real-ip") ?? null;
  const userAgent = headerList.get("user-agent") ?? null;

  const turnstileOk = await verifyTurnstile(data.turnstileToken, ip);
  if (!turnstileOk) {
    return {
      status: "error",
      message: "Spam check failed. Please refresh and try again.",
      values: submittedValues,
      attempt: nextAttempt,
    };
  }

  // Insert the review row first so we have an ID for the image key.
  let reviewId: string;
  try {
    const [row] = await db
      .insert(schema.reviews)
      .values({
        coupleNames: data.coupleNames,
        emailPrivate: data.emailPrivate,
        weddingDate: data.weddingDate || null,
        city: data.city || null,
        rating: data.rating,
        body: data.body,
        serviceTags: data.serviceTags,
        language: data.language,
        consentShare: data.consentShare === "on",
        consentGallery: data.consentGallery === "on",
        status: "pending",
        ipAddress: ip,
        userAgent,
      })
      .returning({ id: schema.reviews.id });
    reviewId = row.id;
  } catch (err) {
    console.error("[reviews] DB insert failed:", err);
    return {
      status: "error",
      message:
        "Something went wrong saving your review. Please try again, or email juliane.cao@rogers.com directly.",
      values: submittedValues,
      attempt: nextAttempt,
    };
  }

  // Now process the image (if any) using the review id as the bucket prefix.
  // Image upload failure is non-fatal — the review still gets submitted, just
  // without a photo. We surface the error so the user sees what happened.
  const file = formData.get("image");
  let imageError: string | undefined;
  let imageMeta: { key: string; width: number; height: number; size: number } | null = null;

  if (file instanceof File && file.size > 0) {
    try {
      imageMeta = await processAndUploadImage(file, reviewId);
    } catch (err) {
      if (err instanceof ImageError) {
        imageError = err.message;
      } else {
        console.error("[reviews] image processing/upload failed:", err);
        imageError = "We couldn't save your photo, but the review went through.";
      }
    }
  }

  if (imageMeta) {
    try {
      await db
        .update(schema.reviews)
        .set({
          imageKey: imageMeta.key,
          imageWidth: imageMeta.width,
          imageHeight: imageMeta.height,
          imageSize: imageMeta.size,
        })
        .where(eq(schema.reviews.id, reviewId));
    } catch (err) {
      console.error("[reviews] image-meta update failed:", err);
      // Row already exists with the review content; image just won't render.
    }
  }

  await sendOwnerNotification(data, reviewId, !!imageMeta);

  return {
    status: "success",
    message: imageError, // Use this slot to surface non-fatal image issues on success screen.
  };
}
