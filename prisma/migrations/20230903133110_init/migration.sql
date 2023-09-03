/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `labels` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "labels_name_key" ON "labels"("name");
