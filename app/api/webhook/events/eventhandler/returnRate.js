import prisma from "../../../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";

export async function return_rate_updated(payload, userId) {
  const { customerId, numberOfReturns, totalOrders, returnDates, returnDetails } = payload;

  await prisma.returnRate.upsert({
    where: {
      customerId: customerId
    },
    update: {
      numberOfReturns,
      totalOrders,
      returnDates,
      returnDetails
    },
    create: {
      customerId,
      numberOfReturns,
      totalOrders,
      returnDates,
      returnDetails
    }
  });

  await dispatchEvent('RETURN_RATE_UPDATED', payload);
}
