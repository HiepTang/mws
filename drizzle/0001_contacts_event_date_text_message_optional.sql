ALTER TABLE "contacts" ALTER COLUMN "event_date" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "contacts" ALTER COLUMN "message" DROP NOT NULL;