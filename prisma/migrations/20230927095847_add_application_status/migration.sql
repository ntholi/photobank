-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('pending', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "contributor_applications" ADD COLUMN     "message" TEXT,
ADD COLUMN     "status" "ApplicationStatus" NOT NULL DEFAULT 'pending';
