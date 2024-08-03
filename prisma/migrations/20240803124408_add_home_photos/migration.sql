-- CreateTable
CREATE TABLE "home_photos" (
    "id" SERIAL NOT NULL,
    "photo_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_photos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "home_photos" ADD CONSTRAINT "home_photos_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "photos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
