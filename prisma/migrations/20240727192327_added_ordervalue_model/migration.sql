-- CreateTable
CREATE TABLE "OrderValue" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "orderValue" DOUBLE PRECISION NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "updateDate" TIMESTAMP(3),
    "cancelDate" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "OrderValue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderValue" ADD CONSTRAINT "OrderValue_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderValue" ADD CONSTRAINT "OrderValue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
