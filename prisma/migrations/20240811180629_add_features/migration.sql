/*
  Warnings:

  - You are about to drop the column `description` on the `updates` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "updates" DROP COLUMN "description",
ADD COLUMN     "features" TEXT[];
