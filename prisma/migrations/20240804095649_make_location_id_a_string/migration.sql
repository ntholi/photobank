/*
  Warnings:

  - The primary key for the `locations` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "photos" DROP CONSTRAINT "photos_locationId_fkey";

-- AlterTable
ALTER TABLE "locations" DROP CONSTRAINT "locations_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "locations_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "locations_id_seq";

-- AlterTable
ALTER TABLE "photos" ALTER COLUMN "locationId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
