CREATE TABLE "content_labels" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"content_id" varchar(21) NOT NULL,
	"name" text NOT NULL,
	"confidence" integer NOT NULL,
	"instances" jsonb,
	"parents" jsonb,
	"aliases" jsonb,
	"categories" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP TABLE "recognition_labels" CASCADE;--> statement-breakpoint
ALTER TABLE "content_labels" ADD CONSTRAINT "content_labels_content_id_content_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;