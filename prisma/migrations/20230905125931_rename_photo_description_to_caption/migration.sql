/*
  Warnings:

  - You are about to drop the column `description` on the `photos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "photos" DROP COLUMN "description",
ADD COLUMN     "caption" TEXT;
