CREATE TABLE "location_details" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"location_id" varchar(21) NOT NULL,
	"cover_content_id" varchar(21),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "location_details_locationId_unique" UNIQUE("location_id")
);
--> statement-breakpoint
ALTER TABLE "locations" DROP CONSTRAINT "locations_cover_content_id_content_id_fk";
--> statement-breakpoint
ALTER TABLE "location_details" ADD CONSTRAINT "location_details_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location_details" ADD CONSTRAINT "location_details_cover_content_id_content_id_fk" FOREIGN KEY ("cover_content_id") REFERENCES "public"."content"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "locations" DROP COLUMN "cover_content_id";