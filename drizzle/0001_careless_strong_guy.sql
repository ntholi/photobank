CREATE TABLE `content` (
	`id` text(21) PRIMARY KEY NOT NULL,
	`type` text,
	`file_name` text,
	`location` text,
	`status` text,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer
);
