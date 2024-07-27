/*
  Warnings:

  - You are about to drop the column `numberOfRenewals` on the `RenewalRate` table. All the data in the column will be lost.
  - You are about to drop the column `renewalDates` on the `RenewalRate` table. All the data in the column will be lost.
  - You are about to drop the column `renewalDetails` on the `RenewalRate` table. All the data in the column will be lost.
  - The primary key for the `UpsellOpportunity` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `opportunityDetails` on the `UpsellOpportunity` table. All the data in the column will be lost.
  - You are about to drop the column `potentialRevenue` on the `UpsellOpportunity` table. All the data in the column will be lost.
  - You are about to drop the column `productSuggested` on the `UpsellOpportunity` table. All the data in the column will be lost.
  - You are about to drop the `ContractLength` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SupportTickets` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[opportunityId]` on the table `UpsellOpportunity` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lastRenewalUpdate` to the `RenewalRate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `renewalRate` to the `RenewalRate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `RenewalRate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `opportunityId` to the `UpsellOpportunity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `UpsellOpportunity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ContractLength" DROP CONSTRAINT "ContractLength_customerId_fkey";

-- DropForeignKey
ALTER TABLE "ContractLength" DROP CONSTRAINT "ContractLength_userId_fkey";

-- AlterTable
ALTER TABLE "RenewalRate" DROP COLUMN "numberOfRenewals",
DROP COLUMN "renewalDates",
DROP COLUMN "renewalDetails",
ADD COLUMN     "lastRenewalUpdate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "renewalRate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "UpsellOpportunity" DROP CONSTRAINT "UpsellOpportunity_pkey",
DROP COLUMN "opportunityDetails",
DROP COLUMN "potentialRevenue",
DROP COLUMN "productSuggested",
ADD COLUMN     "lossDate" TIMESTAMP(3),
ADD COLUMN     "lossReason" TEXT,
ADD COLUMN     "opportunityId" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "UpsellOpportunity_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "UpsellOpportunity_id_seq";

-- DropTable
DROP TABLE "ContractLength";

-- DropTable
DROP TABLE "SupportTickets";

-- CreateTable
CREATE TABLE "SupportTicket" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "ticketId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "satisfactionScore" DOUBLE PRECISION,
    "lastUpdate" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "contractLength" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "renewalDate" TIMESTAMP(3),
    "terminationDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SupportTicket_ticketId_key" ON "SupportTicket"("ticketId");

-- CreateIndex
CREATE UNIQUE INDEX "UpsellOpportunity_opportunityId_key" ON "UpsellOpportunity"("opportunityId");

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
