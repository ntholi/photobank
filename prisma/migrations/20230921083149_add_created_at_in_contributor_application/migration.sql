/*
  Warnings:

  - You are about to drop the column `accepted` on the `contributor_applications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "contributor_applications" DROP COLUMN "accepted",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
