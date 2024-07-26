/*
  Warnings:

  - You are about to drop the column `churnRate` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `upsellRate` on the `Customer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "churnRate",
DROP COLUMN "upsellRate";
