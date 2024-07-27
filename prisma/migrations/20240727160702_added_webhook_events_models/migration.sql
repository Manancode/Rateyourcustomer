/*
  Warnings:

  - You are about to drop the column `userid` on the `AverageOrderValue` table. All the data in the column will be lost.
  - You are about to drop the column `userid` on the `ContractLength` table. All the data in the column will be lost.
  - You are about to drop the column `userid` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `userid` on the `FeedbackScores` table. All the data in the column will be lost.
  - You are about to drop the column `userid` on the `LifetimeValue` table. All the data in the column will be lost.
  - You are about to drop the column `userid` on the `PurchaseFrequency` table. All the data in the column will be lost.
  - You are about to drop the column `contractDetails` on the `RenewalRate` table. All the data in the column will be lost.
  - You are about to drop the column `userid` on the `RenewalRate` table. All the data in the column will be lost.
  - You are about to drop the column `userid` on the `ReturnRate` table. All the data in the column will be lost.
  - Added the required column `averageValue` to the `AverageOrderValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `AverageOrderValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `renewalStatus` to the `ContractLength` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `ContractLength` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `details` to the `FeedbackScores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `FeedbackScores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `details` to the `LifetimeValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `LifetimeValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `PurchaseFrequency` table without a default value. This is not possible if the table is not empty.
  - Added the required column `renewalDetails` to the `RenewalRate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `RenewalRate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `returnDetails` to the `ReturnRate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `ReturnRate` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_userid_fkey";

-- AlterTable
ALTER TABLE "AverageOrderValue" DROP COLUMN "userid",
ADD COLUMN     "averageValue" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ContractLength" DROP COLUMN "userid",
ADD COLUMN     "renewalStatus" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "userid",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FeedbackScores" DROP COLUMN "userid",
ADD COLUMN     "details" JSONB NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "LifetimeValue" DROP COLUMN "userid",
ADD COLUMN     "details" JSONB NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PurchaseFrequency" DROP COLUMN "userid",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RenewalRate" DROP COLUMN "contractDetails",
DROP COLUMN "userid",
ADD COLUMN     "renewalDetails" JSONB NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ReturnRate" DROP COLUMN "userid",
ADD COLUMN     "returnDetails" JSONB NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "AccountHealth" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "healthScore" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "AccountHealth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerEngagement" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "engagementScore" DOUBLE PRECISION NOT NULL,
    "lastEngaged" TIMESTAMP(3) NOT NULL,
    "details" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CustomerEngagement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerSuccess" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "successScore" DOUBLE PRECISION NOT NULL,
    "milestone" TEXT NOT NULL,
    "achievedAt" TIMESTAMP(3) NOT NULL,
    "details" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CustomerSuccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataSync" (
    "id" SERIAL NOT NULL,
    "syncType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "syncDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "DataSync_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductUsage" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "usageCount" INTEGER NOT NULL,
    "lastUsed" TIMESTAMP(3) NOT NULL,
    "usageDetails" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ProductUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UpsellOpportunity" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "potentialRevenue" DOUBLE PRECISION NOT NULL,
    "productSuggested" TEXT NOT NULL,
    "opportunityDetails" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UpsellOpportunity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountHealth" ADD CONSTRAINT "AccountHealth_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountHealth" ADD CONSTRAINT "AccountHealth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractLength" ADD CONSTRAINT "ContractLength_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractLength" ADD CONSTRAINT "ContractLength_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerEngagement" ADD CONSTRAINT "CustomerEngagement_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerEngagement" ADD CONSTRAINT "CustomerEngagement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerSuccess" ADD CONSTRAINT "CustomerSuccess_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerSuccess" ADD CONSTRAINT "CustomerSuccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackScores" ADD CONSTRAINT "FeedbackScores_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackScores" ADD CONSTRAINT "FeedbackScores_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataSync" ADD CONSTRAINT "DataSync_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LifetimeValue" ADD CONSTRAINT "LifetimeValue_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LifetimeValue" ADD CONSTRAINT "LifetimeValue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AverageOrderValue" ADD CONSTRAINT "AverageOrderValue_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AverageOrderValue" ADD CONSTRAINT "AverageOrderValue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductUsage" ADD CONSTRAINT "ProductUsage_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductUsage" ADD CONSTRAINT "ProductUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseFrequency" ADD CONSTRAINT "PurchaseFrequency_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseFrequency" ADD CONSTRAINT "PurchaseFrequency_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RenewalRate" ADD CONSTRAINT "RenewalRate_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RenewalRate" ADD CONSTRAINT "RenewalRate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnRate" ADD CONSTRAINT "ReturnRate_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnRate" ADD CONSTRAINT "ReturnRate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpsellOpportunity" ADD CONSTRAINT "UpsellOpportunity_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpsellOpportunity" ADD CONSTRAINT "UpsellOpportunity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
