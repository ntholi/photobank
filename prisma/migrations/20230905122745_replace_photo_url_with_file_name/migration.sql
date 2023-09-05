/*
  Warnings:

  - You are about to drop the column `name` on the `photos` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `photos` table. All the data in the column will be lost.
  - Added the required column `fileName` to the `photos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "photos" DROP COLUMN "name",
DROP COLUMN "url",
ADD COLUMN     "fileName" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'approved';
