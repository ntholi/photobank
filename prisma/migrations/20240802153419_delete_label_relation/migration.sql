/*
  Warnings:

  - You are about to drop the column `label_id` on the `photo_labels` table. All the data in the column will be lost.
  - You are about to drop the `_LabelToTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `labels` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `label` to the `photo_labels` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_LabelToTag" DROP CONSTRAINT "_LabelToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_LabelToTag" DROP CONSTRAINT "_LabelToTag_B_fkey";

-- DropForeignKey
ALTER TABLE "photo_labels" DROP CONSTRAINT "photo_labels_label_id_fkey";

-- AlterTable
ALTER TABLE "photo_labels" DROP COLUMN "label_id",
ADD COLUMN     "label" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tags" ADD COLUMN     "labels" TEXT[];

-- DropTable
DROP TABLE "_LabelToTag";

-- DropTable
DROP TABLE "labels";

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "value" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
