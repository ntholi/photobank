ALTER TABLE "content" ALTER COLUMN "s3_key" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "content" ALTER COLUMN "thumbnail_key" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "content" ALTER COLUMN "watermarked_key" SET NOT NULL;