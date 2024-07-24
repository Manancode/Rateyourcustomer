/*
  Warnings:

  - You are about to drop the column `averageOrderValue` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the column `contractLength` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the column `feedbackScores` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the column `lifetimeValue` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the column `overallScore` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the column `paymentHistory` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseFrequency` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the column `referralRate` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the column `renewalRate` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the column `returnRate` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the column `supportTickets` on the `Rating` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[url]` on the table `Webhook` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryId` to the `Rating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodId` to the `Rating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Rating` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Company_id_key";

-- AlterTable
ALTER TABLE "Rating" DROP COLUMN "averageOrderValue",
DROP COLUMN "contractLength",
DROP COLUMN "feedbackScores",
DROP COLUMN "lifetimeValue",
DROP COLUMN "overallScore",
DROP COLUMN "paymentHistory",
DROP COLUMN "purchaseFrequency",
DROP COLUMN "referralRate",
DROP COLUMN "renewalRate",
DROP COLUMN "returnRate",
DROP COLUMN "supportTickets",
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "periodId" TEXT NOT NULL,
ADD COLUMN     "value" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "RatingCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "weightage" DOUBLE PRECISION NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "RatingCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RatingPeriod" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RatingPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Webhook_url_key" ON "Webhook"("url");

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "RatingCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "RatingPeriod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingCategory" ADD CONSTRAINT "RatingCategory_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
