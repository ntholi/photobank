/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `locations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "locations_name_key" ON "locations"("name");
