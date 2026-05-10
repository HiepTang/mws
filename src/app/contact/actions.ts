"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";
import { db, schema } from "@/db";

// ─── Validation ───────────────────────────────────────────────────────

const ContactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  partner: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().email("Please enter a valid email").max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  eventDate: z.string().trim().max(120).optional().or(z.literal("")),
  guests: z.string().trim().max(40).optional().or(z.literal("")),
  services: z.array(z.string()).max(20).optional().default([]),
  message: z.string().trim().max(5000).optional().or(z.literal("")),
  language: z.enum(["en", "vi"]).default("en"),
  // Cloudflare Turnstile token. Empty in dev when TURNSTILE_SECRET_KEY isn't set.
  turnstileToken: z.string().optional().default(""),
});

export type ContactValues = {
  name: string;
  partner: string;
  email: string;
  phone: string;
  eventDate: string;
  guests: string;
  services: string[];
  message: string;
};

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<keyof z.infer<typeof ContactSchema>, string>>;
  values?: ContactValues;
  attempt?: number;
};

// ─── Turnstile verification ───────────────────────────────────────────

async function verifyTurnstile(token: string, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // Dev / preview without Turnstile configured: skip the check so local
  // development keeps working. Production must set TURNSTILE_SECRET_KEY.
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.warn("[contact] TURNSTILE_SECRET_KEY is not set in production");
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
      // Don't let Turnstile dragging slow the response forever.
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error("[contact] Turnstile verify failed:", err);
    return false;
  }
}

// ─── Email notification ───────────────────────────────────────────────

async function sendOwnerNotification(
  contact: z.infer<typeof ContactSchema>,
  contactId: string,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const to = process.env.EMAIL_TO_OWNER;

  if (!apiKey || !from || !to) {
    console.warn(
      "[contact] Resend not fully configured (need RESEND_API_KEY, EMAIL_FROM, EMAIL_TO_OWNER); skipping notification",
    );
    return;
  }

  const resend = new Resend(apiKey);

  const lines = [
    `New contact form submission`,
    ``,
    `From:        ${contact.name}${contact.partner ? ` (with ${contact.partner})` : ""}`,
    `Email:       ${contact.email}`,
    contact.phone ? `Phone:       ${contact.phone}` : null,
    contact.eventDate ? `Wedding:     ${contact.eventDate}` : null,
    contact.guests ? `Guests:      ${contact.guests}` : null,
    contact.services.length ? `Interested:  ${contact.services.join(", ")}` : null,
    `Language:    ${contact.language}`,
    ``,
    `Message:`,
    contact.message,
    ``,
    `—`,
    `Reply directly to this email to respond to ${contact.name}.`,
    `Submission ID: ${contactId}`,
  ].filter(Boolean);

  const text = lines.join("\n");
  const subject = `New contact: ${contact.name}${contact.partner ? ` & ${contact.partner}` : ""}`;

  try {
    await resend.emails.send({
      from,
      to,
      replyTo: contact.email,
      subject,
      text,
    });
  } catch (err) {
    console.error("[contact] Resend send failed:", err);
    // Don't fail the whole submission — the row is in the DB and Juliane
    // can see it in /admin. Email is best-effort.
  }
}

// ─── Server action ────────────────────────────────────────────────────

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot — bots tend to fill all fields. Real users never see this.
  if (formData.get("website")) {
    // Pretend success so the bot moves on.
    return { status: "success" };
  }

  const raw = {
    name: String(formData.get("name") ?? ""),
    partner: String(formData.get("partner") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    eventDate: String(formData.get("event-date") ?? ""),
    guests: String(formData.get("guests") ?? ""),
    services: formData.getAll("services").map((v) => String(v)),
    message: String(formData.get("message") ?? ""),
    language: String(formData.get("language") ?? "en"),
    turnstileToken: String(formData.get("cf-turnstile-response") ?? ""),
  };

  // Captured so we can re-populate the form if validation or downstream
  // submission fails — React 19 auto-resets the form after a server action,
  // so we feed these back as defaultValue + a bumped `attempt` key.
  const submittedValues: ContactValues = {
    name: raw.name,
    partner: raw.partner,
    email: raw.email,
    phone: raw.phone,
    eventDate: raw.eventDate,
    guests: raw.guests,
    services: raw.services,
    message: raw.message,
  };
  const nextAttempt = (_prev.attempt ?? 0) + 1;

  const parsed = ContactSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: ContactState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof z.infer<typeof ContactSchema>;
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

  let contactId: string;
  try {
    const [row] = await db
      .insert(schema.contacts)
      .values({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        eventDate: data.eventDate || null,
        eventType: data.guests || null,
        message: [
          data.partner ? `Partner: ${data.partner}` : null,
          data.services.length ? `Interested in: ${data.services.join(", ")}` : null,
          "",
          data.message,
        ]
          .filter((v) => v !== null)
          .join("\n"),
        language: data.language,
        ipAddress: ip,
        userAgent,
      })
      .returning({ id: schema.contacts.id });
    contactId = row.id;
  } catch (err) {
    console.error("[contact] DB insert failed:", err);
    return {
      status: "error",
      message: "Something went wrong saving your message. Please try again, or email hello@mississaugaweddsols.com directly.",
      values: submittedValues,
      attempt: nextAttempt,
    };
  }

  // Email is best-effort; don't fail the submission if it errors.
  await sendOwnerNotification(data, contactId);

  return { status: "success" };
}
