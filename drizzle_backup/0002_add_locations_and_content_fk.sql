CREATE TABLE IF NOT EXISTS `locations` (
  `id` text(21) PRIMARY KEY NOT NULL,
  `place_id` text NOT NULL UNIQUE,
  `name` text NOT NULL,
  `formatted_address` text,
  `created_at` integer DEFAULT (unixepoch()),
  `updated_at` integer
);

ALTER TABLE `content` RENAME COLUMN `location` TO `location_tmp`;
ALTER TABLE `content` ADD COLUMN `location_id` text REFERENCES `locations`(`id`);
UPDATE `content` SET `location_id` = NULL;
ALTER TABLE `content` DROP COLUMN `location_tmp`;

