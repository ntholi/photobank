CREATE TABLE "location_cover_contents" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"location_id" varchar(21) NOT NULL,
	"content_id" varchar(21) NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "location_details" DROP CONSTRAINT "location_details_cover_content_id_content_id_fk";
--> statement-breakpoint
ALTER TABLE "location_cover_contents" ADD CONSTRAINT "location_cover_contents_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location_cover_contents" ADD CONSTRAINT "location_cover_contents_content_id_content_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location_details" DROP COLUMN "cover_content_id";