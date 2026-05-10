CREATE TABLE "gallery_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"image_key" text NOT NULL,
	"image_width" integer,
	"image_height" integer,
	"image_size" integer,
	"category" text NOT NULL,
	"caption" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"hidden" boolean DEFAULT false NOT NULL,
	"uploaded_by" text
);
--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "gallery_category" text DEFAULT 'family' NOT NULL;