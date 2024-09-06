/*
  Warnings:

  - You are about to drop the column `caption` on the `photos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "photos" DROP COLUMN "caption",
ADD COLUMN     "description" TEXT;
