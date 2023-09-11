/*
  Warnings:

  - You are about to drop the column `bio` on the `photos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "photos" DROP COLUMN "bio";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "bio" TEXT;
