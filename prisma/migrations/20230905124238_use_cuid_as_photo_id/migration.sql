/*
  Warnings:

  - The primary key for the `photos` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "photo_labels" DROP CONSTRAINT "photo_labels_photo_id_fkey";

-- DropForeignKey
ALTER TABLE "purchased_photos" DROP CONSTRAINT "purchased_photos_photo_id_fkey";

-- DropForeignKey
ALTER TABLE "saved_photos" DROP CONSTRAINT "saved_photos_photo_id_fkey";

-- AlterTable
ALTER TABLE "photo_labels" ALTER COLUMN "photo_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "photos" DROP CONSTRAINT "photos_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "photos_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "photos_id_seq";

-- AlterTable
ALTER TABLE "purchased_photos" ALTER COLUMN "photo_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "saved_photos" ALTER COLUMN "photo_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "photo_labels" ADD CONSTRAINT "photo_labels_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "photos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchased_photos" ADD CONSTRAINT "purchased_photos_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "photos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_photos" ADD CONSTRAINT "saved_photos_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "photos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
