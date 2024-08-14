import prisma from "../../../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";

export async function purchase_frequency_changed(payload, userId) {
  const { customerId, numberOfPurchases, purchaseDates, frequency } = payload;

  await prisma.purchaseFrequency.upsert({
    where: {
      customerId: customerId,
    },
    update: {
      numberOfPurchases,
      purchaseDates: purchaseDates.map(date => new Date(date)), 
      frequency,
    },
    create: {
      customerId,
      numberOfPurchases,
      purchaseDates: purchaseDates.map(date => new Date(date)),
      frequency,
      createdAt: new Date(),
    },
  });

  await dispatchEvent('PURCHASE_FREQUENCY_CHANGED', payload);
}
