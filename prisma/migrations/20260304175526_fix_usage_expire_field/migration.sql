/*
  Warnings:

  - You are about to drop the column `expiryDate` on the `Usage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Usage" DROP COLUMN "expiryDate",
ADD COLUMN     "expire" TIMESTAMP(3);
