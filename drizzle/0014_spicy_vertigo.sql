CREATE TYPE "public"."notification_status" AS ENUM('unread', 'read', 'archived');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('content_status_change', 'content_updated', 'content_rejected', 'content_published', 'system');--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"recipient_user_id" varchar(21) NOT NULL,
	"type" "notification_type" DEFAULT 'system' NOT NULL,
	"status" "notification_status" DEFAULT 'unread' NOT NULL,
	"title" text,
	"body" text,
	"payload" jsonb,
	"created_at" timestamp DEFAULT now(),
	"read_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipient_user_id_users_id_fk" FOREIGN KEY ("recipient_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;