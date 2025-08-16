ALTER TABLE "authenticators" DROP CONSTRAINT "authenticators_credential_id_unique";--> statement-breakpoint
ALTER TABLE "locations" DROP CONSTRAINT "locations_place_id_unique";--> statement-breakpoint
ALTER TABLE "authenticators" ADD CONSTRAINT "authenticators_credentialID_unique" UNIQUE("credential_id");--> statement-breakpoint
ALTER TABLE "locations" ADD CONSTRAINT "locations_placeId_unique" UNIQUE("place_id");