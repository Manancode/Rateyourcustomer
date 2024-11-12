/*
  Warnings:

  - You are about to drop the column `userId` on the `AccountHealth` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `AverageOrderValue` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `CustomerEngagement` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `CustomerSuccess` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `FeedbackScores` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `LifetimeValue` table. All the data in the column will be lost.
  - The primary key for the `OrderValue` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `OrderValue` table. All the data in the column will be lost.
  - You are about to drop the column `updateDate` on the `OrderValue` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `OrderValue` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `OrderValue` table. All the data in the column will be lost.
  - You are about to drop the column `userid` on the `PaymentHistory` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ProductUsage` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `PurchaseFrequency` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `RenewalRate` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ReturnRate` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `SupportTicket` table. All the data in the column will be lost.
  - You are about to drop the column `opportunityId` on the `UpsellOpportunity` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UpsellOpportunity` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[customerId]` on the table `AccountHealth` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customerId]` on the table `AverageOrderValue` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customerId]` on the table `Contract` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customerId]` on the table `CustomerEngagement` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customerId]` on the table `CustomerSuccess` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customerId]` on the table `FeedbackScores` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customerId]` on the table `LifetimeValue` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customerId]` on the table `PaymentHistory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customerId]` on the table `ProductUsage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customerId]` on the table `PurchaseFrequency` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customerId]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customerId]` on the table `ReferralRate` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customerId]` on the table `RenewalRate` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customerId]` on the table `ReturnRate` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customerId]` on the table `SupportTicket` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customerId]` on the table `UpsellOpportunity` will be added. If there are existing duplicate values, this will fail.
  - The required column `orderId` was added to the `OrderValue` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `updatedAt` to the `PaymentHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UpsellOpportunity_opportunityId_key";

-- AlterTable
ALTER TABLE "AccountHealth" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "AverageOrderValue" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "userId",
ADD COLUMN     "terminationDetails" TEXT;

-- AlterTable
ALTER TABLE "CustomerEngagement" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "CustomerSuccess" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "DataSync" ALTER COLUMN "syncType" DROP NOT NULL;

-- AlterTable
ALTER TABLE "FeedbackScores" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "LifetimeValue" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "OrderValue" DROP CONSTRAINT "OrderValue_pkey",
DROP COLUMN "id",
DROP COLUMN "updateDate",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "orderId" TEXT NOT NULL,
ADD CONSTRAINT "OrderValue_pkey" PRIMARY KEY ("orderId");

-- AlterTable
ALTER TABLE "PaymentHistory" DROP COLUMN "userid",
ADD COLUMN     "paymentTerms" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ProductUsage" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "PurchaseFrequency" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "RenewalRate" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "ReturnRate" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "SupportTicket" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "UpsellOpportunity" DROP COLUMN "opportunityId",
DROP COLUMN "userId",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "value" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Webhook" ADD COLUMN     "failureCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastFailedDispatch" TIMESTAMP(3),
ADD COLUMN     "lastSuccessfulDispatch" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "AccountHealth_customerId_key" ON "AccountHealth"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "AverageOrderValue_customerId_key" ON "AverageOrderValue"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_customerId_key" ON "Contract"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerEngagement_customerId_key" ON "CustomerEngagement"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerSuccess_customerId_key" ON "CustomerSuccess"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackScores_customerId_key" ON "FeedbackScores"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "LifetimeValue_customerId_key" ON "LifetimeValue"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentHistory_customerId_key" ON "PaymentHistory"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductUsage_customerId_key" ON "ProductUsage"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseFrequency_customerId_key" ON "PurchaseFrequency"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_customerId_key" ON "Rating"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralRate_customerId_key" ON "ReferralRate"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "RenewalRate_customerId_key" ON "RenewalRate"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "ReturnRate_customerId_key" ON "ReturnRate"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "SupportTicket_customerId_key" ON "SupportTicket"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "UpsellOpportunity_customerId_key" ON "UpsellOpportunity"("customerId");
