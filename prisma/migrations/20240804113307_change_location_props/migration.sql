/*
  Warnings:

  - You are about to drop the column `lat` on the `locations` table. All the data in the column will be lost.
  - You are about to drop the column `lng` on the `locations` table. All the data in the column will be lost.
  - Added the required column `latitude` to the `locations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `locations` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "locations_name_key";

-- AlterTable
ALTER TABLE "locations" DROP COLUMN "lat",
DROP COLUMN "lng",
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL;
