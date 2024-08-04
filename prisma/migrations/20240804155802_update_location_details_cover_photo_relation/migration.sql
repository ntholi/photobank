-- CreateTable
CREATE TABLE "location_details" (
    "id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "cover_photo_id" TEXT,
    "about" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "location_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "location_details_location_id_key" ON "location_details"("location_id");

-- CreateIndex
CREATE UNIQUE INDEX "location_details_cover_photo_id_key" ON "location_details"("cover_photo_id");

-- AddForeignKey
ALTER TABLE "location_details" ADD CONSTRAINT "location_details_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "location_details" ADD CONSTRAINT "location_details_cover_photo_id_fkey" FOREIGN KEY ("cover_photo_id") REFERENCES "photos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
