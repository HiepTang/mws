import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

// ─── Domain tables ────────────────────────────────────────────────────

export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),

  coupleNames: text("couple_names").notNull(),
  emailPrivate: text("email_private").notNull(),
  // Free-text on the form ("August 2025", "sometime last fall"), so we keep
  // this as `text`. We never query/sort by date — moderation queue is by
  // `created_at` instead.
  weddingDate: text("wedding_date"),
  city: text("city"),
  rating: smallint("rating").notNull(),
  body: text("body").notNull(),
  serviceTags: text("service_tags").array().notNull().default([]),
  language: text("language").notNull(),

  consentShare: boolean("consent_share").notNull().default(false),
  consentGallery: boolean("consent_gallery").notNull().default(false),

  imageKey: text("image_key"),
  imageWidth: integer("image_width"),
  imageHeight: integer("image_height"),
  imageSize: integer("image_size"),

  // Admin-set bucket the photo lands in on the public /gallery. Defaults to
  // "family" if admin doesn't pick one. Only matters when consent_gallery is
  // true and status='approved'.
  galleryCategory: text("gallery_category").notNull().default("family"),

  status: text("status").notNull().default("pending"),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  approvedBy: text("approved_by"),

  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
});

export const contacts = pgTable("contacts", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),

  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  // Free-text on the form ("June 2026", "sometime next fall"), so this is
  // text — not a strict date — to accept whatever the couple types.
  eventDate: text("event_date"),
  eventType: text("event_type"),
  // Optional in the form; partner/services info is also stitched in here,
  // so the column can end up empty if the couple skips everything.
  message: text("message"),
  language: text("language").notNull(),

  status: text("status").notNull().default("new"),

  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
});

// Owner-curated gallery photos. Sits alongside review-submitted photos —
// the public /gallery merges both sources, filtered by category tab.
export const galleryImages = pgTable("gallery_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),

  // MinIO object key, e.g. "gallery/{id}/original.webp".
  imageKey: text("image_key").notNull(),
  imageWidth: integer("image_width"),
  imageHeight: integer("image_height"),
  imageSize: integer("image_size"),

  category: text("category").notNull(),  // tea_ceremony | ao_dai | reception | family | details
  caption: text("caption"),

  // Smaller numbers render first within a category. Admin re-orders via
  // up/down arrows in /admin/gallery.
  sortOrder: integer("sort_order").notNull().default(0),

  // Soft-delete: hidden images stay in S3 but stop rendering publicly. Admin
  // can unhide later. `deleteGalleryImage` does the hard delete + S3 cleanup.
  hidden: boolean("hidden").notNull().default(false),

  uploadedBy: text("uploaded_by"),  // admin email
});

// ─── Auth.js v5 tables ────────────────────────────────────────────────
// Schema matches @auth/drizzle-adapter's DefaultPostgresSchema exactly.
// This means a few SQL column names use camelCase (e.g. `userId`, `emailVerified`)
// rather than the snake_case we use elsewhere — this is a constraint of the
// adapter, not a style choice. Don't fight it.

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date", withTimezone: true }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [primaryKey({ columns: [account.provider, account.providerAccountId] })],
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date", withTimezone: true }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date", withTimezone: true }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })],
);
