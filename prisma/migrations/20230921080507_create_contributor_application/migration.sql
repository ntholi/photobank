-- CreateTable
CREATE TABLE "contributor_applications" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "contributor_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contributor_applications_user_id_key" ON "contributor_applications"("user_id");

-- AddForeignKey
ALTER TABLE "contributor_applications" ADD CONSTRAINT "contributor_applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
