CREATE TABLE "recognition_labels" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"content_id" varchar(21) NOT NULL,
	"name" text NOT NULL,
	"confidence" integer NOT NULL,
	"instances" text,
	"parents" text,
	"aliases" text,
	"categories" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "recognition_labels" ADD CONSTRAINT "recognition_labels_content_id_content_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;