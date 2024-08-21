/*
  Warnings:

  - You are about to drop the column `use_without_watermark` on the `photos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "photos" DROP COLUMN "use_without_watermark";
