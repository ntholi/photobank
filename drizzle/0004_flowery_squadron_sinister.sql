ALTER TABLE "content" ADD COLUMN "file_url" text;--> statement-breakpoint
ALTER TABLE "content" ADD COLUMN "s3_key" text;--> statement-breakpoint
ALTER TABLE "content" ADD COLUMN "file_size" integer;