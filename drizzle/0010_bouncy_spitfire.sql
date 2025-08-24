CREATE TABLE "virtual_tours" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"location_id" varchar(21) NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "virtual_tours_locationId_unique" UNIQUE("location_id")
);
--> statement-breakpoint
ALTER TABLE "virtual_tours" ADD CONSTRAINT "virtual_tours_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;