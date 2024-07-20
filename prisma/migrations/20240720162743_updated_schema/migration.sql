/*
  Warnings:

  - You are about to drop the column `categoryA` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the column `categoryB` on the `Rating` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[apikey]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `churnRate` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `upsellRate` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userid` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `averageOrderValue` to the `Rating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contractLength` to the `Rating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `feedbackScores` to the `Rating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lifetimeValue` to the `Rating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `overallScore` to the `Rating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentHistory` to the `Rating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchaseFrequency` to the `Rating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referralRate` to the `Rating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `renewalRate` to the `Rating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `returnRate` to the `Rating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supportTickets` to the `Rating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Rating` table without a default value. This is not possible if the table is not empty.
  - Made the column `apikey` on table `Subscription` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `companyId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Rating_userid_key";

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "churnRate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "companyId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "upsellRate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "userid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Rating" DROP COLUMN "categoryA",
DROP COLUMN "categoryB",
ADD COLUMN     "averageOrderValue" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "contractLength" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "feedbackScores" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "lifetimeValue" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "overallScore" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "paymentHistory" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "purchaseFrequency" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "referralRate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "renewalRate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "returnRate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "supportTickets" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "apikey" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "companyId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_id_key" ON "Company"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_apikey_key" ON "Subscription"("apikey");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
