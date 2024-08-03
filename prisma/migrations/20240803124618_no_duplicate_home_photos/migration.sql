/*
  Warnings:

  - A unique constraint covering the columns `[photo_id]` on the table `home_photos` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "home_photos_photo_id_key" ON "home_photos"("photo_id");
