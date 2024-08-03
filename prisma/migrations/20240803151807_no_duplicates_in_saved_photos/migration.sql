/*
  Warnings:

  - A unique constraint covering the columns `[photo_id]` on the table `saved_photos` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "saved_photos_photo_id_key" ON "saved_photos"("photo_id");
