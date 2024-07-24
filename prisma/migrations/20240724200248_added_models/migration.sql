-- CreateTable
CREATE TABLE "PaymentHistory" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "timelyPayments" INTEGER NOT NULL,
    "latePayments" INTEGER NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "paymentDates" TIMESTAMP(3)[],
    "userid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AverageOrderValue" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "orderCount" INTEGER NOT NULL,
    "orderDates" TIMESTAMP(3)[],
    "userid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AverageOrderValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LifetimeValue" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "totalRevenue" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "userid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LifetimeValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseFrequency" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "numberOfPurchases" INTEGER NOT NULL,
    "purchaseDates" TIMESTAMP(3)[],
    "frequency" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PurchaseFrequency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportTickets" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "numberOfTickets" INTEGER NOT NULL,
    "resolutionTime" DOUBLE PRECISION NOT NULL,
    "ticketCategories" TEXT[],
    "ticketDates" TIMESTAMP(3)[],
    "userid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportTickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackScores" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "feedbackScore" DOUBLE PRECISION NOT NULL,
    "feedbackDate" TIMESTAMP(3) NOT NULL,
    "feedbackType" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedbackScores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReturnRate" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "numberOfReturns" INTEGER NOT NULL,
    "totalOrders" INTEGER NOT NULL,
    "returnDates" TIMESTAMP(3)[],
    "userid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReturnRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralRate" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "numberOfReferrals" INTEGER NOT NULL,
    "referralDetails" TEXT[],
    "referralDates" TIMESTAMP(3)[],
    "userid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReferralRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContractLength" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "contractDetails" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContractLength_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RenewalRate" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "numberOfRenewals" INTEGER NOT NULL,
    "renewalDates" TIMESTAMP(3)[],
    "contractDetails" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RenewalRate_pkey" PRIMARY KEY ("id")
);
