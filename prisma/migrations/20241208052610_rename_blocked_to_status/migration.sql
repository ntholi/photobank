/*
  Warnings:

  - You are about to drop the column `blocked` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'blocked', 'pending');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "blocked",
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'active';
