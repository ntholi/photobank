CREATE TYPE "public"."content_update_action" AS ENUM('update', 'delete');--> statement-breakpoint
CREATE TABLE "content_update_logs" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"content_id" varchar(21) NOT NULL,
	"user_id" varchar(21) NOT NULL,
	"action" "content_update_action" NOT NULL,
	"old_values" jsonb,
	"new_values" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "content_update_logs" ADD CONSTRAINT "content_update_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;