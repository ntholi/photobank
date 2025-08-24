CREATE TABLE "saved_contents" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"content_id" varchar(21) NOT NULL,
	"user_id" varchar(21) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "user_id" SET DATA TYPE varchar(21);--> statement-breakpoint
ALTER TABLE "authenticators" ALTER COLUMN "user_id" SET DATA TYPE varchar(21);--> statement-breakpoint
ALTER TABLE "content" ALTER COLUMN "user_id" SET DATA TYPE varchar(21);--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "user_id" SET DATA TYPE varchar(21);--> statement-breakpoint
ALTER TABLE "saved_contents" ADD CONSTRAINT "saved_contents_content_id_content_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_contents" ADD CONSTRAINT "saved_contents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user_content" ON "saved_contents" USING btree ("user_id","content_id");