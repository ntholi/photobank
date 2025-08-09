ALTER TABLE `content` RENAME COLUMN "location" TO "location_id";--> statement-breakpoint
CREATE TABLE `locations` (
	`id` text(21) PRIMARY KEY NOT NULL,
	`place_id` text NOT NULL,
	`name` text NOT NULL,
	`formatted_address` text,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `locations_placeId_unique` ON `locations` (`place_id`);--> statement-breakpoint
ALTER TABLE `content` ALTER COLUMN "location_id" TO "location_id" text REFERENCES locations(id) ON DELETE no action ON UPDATE no action;