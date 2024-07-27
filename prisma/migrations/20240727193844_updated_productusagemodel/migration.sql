/*
  Warnings:

  - You are about to drop the column `lastUsed` on the `ProductUsage` table. All the data in the column will be lost.
  - You are about to drop the column `usageCount` on the `ProductUsage` table. All the data in the column will be lost.
  - You are about to drop the column `usageDetails` on the `ProductUsage` table. All the data in the column will be lost.
  - Added the required column `featureUsed` to the `ProductUsage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usageDate` to the `ProductUsage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usageDuration` to the `ProductUsage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductUsage" DROP COLUMN "lastUsed",
DROP COLUMN "usageCount",
DROP COLUMN "usageDetails",
ADD COLUMN     "featureUsed" TEXT NOT NULL,
ADD COLUMN     "usageDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "usageDuration" DOUBLE PRECISION NOT NULL;
