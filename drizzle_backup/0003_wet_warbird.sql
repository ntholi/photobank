DROP INDEX "authenticators_credentialID_unique";--> statement-breakpoint
DROP INDEX "locations_placeId_unique";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
ALTER TABLE `content` ALTER COLUMN "type" TO "type" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `authenticators_credentialID_unique` ON `authenticators` (`credential_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `locations_placeId_unique` ON `locations` (`place_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
ALTER TABLE `content` ALTER COLUMN "status" TO "status" text NOT NULL DEFAULT 'published';