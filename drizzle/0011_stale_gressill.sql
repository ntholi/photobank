CREATE TABLE "home_content" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"position" integer NOT NULL,
	"content_id" varchar(21) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "home_content" ADD CONSTRAINT "home_content_content_id_content_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;