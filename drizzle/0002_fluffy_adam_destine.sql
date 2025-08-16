CREATE TYPE "public"."content_status" AS ENUM('draft', 'pending', 'published', 'rejected', 'archived');--> statement-breakpoint
CREATE TYPE "public"."content_type" AS ENUM('image', 'video');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'contributor', 'moderator', 'admin');--> statement-breakpoint
ALTER TABLE "content" ALTER COLUMN "type" SET DEFAULT 'image'::"public"."content_type";--> statement-breakpoint
ALTER TABLE "content" ALTER COLUMN "type" SET DATA TYPE "public"."content_type" USING "type"::"public"."content_type";--> statement-breakpoint
ALTER TABLE "content" ALTER COLUMN "status" SET DEFAULT 'published'::"public"."content_status";--> statement-breakpoint
ALTER TABLE "content" ALTER COLUMN "status" SET DATA TYPE "public"."content_status" USING "status"::"public"."content_status";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user'::"public"."user_role";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."user_role" USING "role"::"public"."user_role";