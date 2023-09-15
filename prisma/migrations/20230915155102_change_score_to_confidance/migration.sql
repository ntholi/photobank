/*
  Warnings:

  - You are about to drop the column `score` on the `photo_labels` table. All the data in the column will be lost.
  - Added the required column `confidence` to the `photo_labels` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "photo_labels" DROP COLUMN "score",
ADD COLUMN     "confidence" DOUBLE PRECISION NOT NULL;
