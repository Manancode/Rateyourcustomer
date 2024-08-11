/*
  Warnings:

  - The `events` column on the `Webhook` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('PAYMENT_RECEIVED', 'PAYMENT_MISSED', 'PAYMENT_TERMS_CHANGED', 'ORDER_PLACED', 'ORDER_UPDATED', 'ORDER_CANCELLED', 'LIFETIME_VALUE_UPDATED', 'LIFETIME_VALUE_CALCULATED', 'PRODUCT_USAGE_UPDATED', 'FEATURE_USAGE_DECLINED', 'PURCHASE_FREQUENCY_CHANGED', 'RENEWAL_RATE_UPDATED', 'RENEWAL_RISK_IDENTIFIED', 'RETURN_RATE_UPDATED', 'SUPPORT_TICKET_CREATED', 'SUPPORT_TICKET_RESOLVED', 'UPSELL_OPPORTUNITY_CREATED', 'UPSELL_OPPORTUNITY_LOST', 'CUSTOMER_ENGAGEMENT_UPDATED', 'CUSTOMER_SUCCESS_UPDATED', 'SUCCESS_MILESTONE_ACHIEVED', 'FEEDBACK_SCORE_UPDATED', 'DATA_SYNC_COMPLETED', 'CONTRACT_CREATED', 'CONTRACT_UPDATED', 'CONTRACT_TERMINATED', 'ACCOUNT_HEALTH_UPDATED', 'ACCOUNT_AT_RISK', 'RESOURCE_DOWNLOADED', 'SUPPORT_ARTICLE_VIEWED');

-- DropForeignKey
ALTER TABLE "AccountHealth" DROP CONSTRAINT "AccountHealth_userId_fkey";

-- DropForeignKey
ALTER TABLE "AverageOrderValue" DROP CONSTRAINT "AverageOrderValue_userId_fkey";

-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_userId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerEngagement" DROP CONSTRAINT "CustomerEngagement_userId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerSuccess" DROP CONSTRAINT "CustomerSuccess_userId_fkey";

-- DropForeignKey
ALTER TABLE "FeedbackScores" DROP CONSTRAINT "FeedbackScores_userId_fkey";

-- DropForeignKey
ALTER TABLE "LifetimeValue" DROP CONSTRAINT "LifetimeValue_userId_fkey";

-- DropForeignKey
ALTER TABLE "OrderValue" DROP CONSTRAINT "OrderValue_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProductUsage" DROP CONSTRAINT "ProductUsage_userId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseFrequency" DROP CONSTRAINT "PurchaseFrequency_userId_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_userid_fkey";

-- DropForeignKey
ALTER TABLE "RenewalRate" DROP CONSTRAINT "RenewalRate_userId_fkey";

-- DropForeignKey
ALTER TABLE "ReturnRate" DROP CONSTRAINT "ReturnRate_userId_fkey";

-- DropForeignKey
ALTER TABLE "SupportTicket" DROP CONSTRAINT "SupportTicket_userId_fkey";

-- DropForeignKey
ALTER TABLE "UpsellOpportunity" DROP CONSTRAINT "UpsellOpportunity_userId_fkey";

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "lastEventSent" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Webhook" ADD COLUMN     "lastDelivery" TIMESTAMP(3),
ADD COLUMN     "lastError" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active',
DROP COLUMN "events",
ADD COLUMN     "events" "EventType"[];

-- CreateTable
CREATE TABLE "WebhookEvent" (
    "id" TEXT NOT NULL,
    "webhookId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventLog" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WebhookEvent" ADD CONSTRAINT "WebhookEvent_webhookId_fkey" FOREIGN KEY ("webhookId") REFERENCES "Webhook"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventLog" ADD CONSTRAINT "EventLog_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
