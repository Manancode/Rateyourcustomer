import prisma from "../../../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";


export async function purchase_frequency_changed(payload, userId) {
  const { customerId, newFrequency, updatedDate } = payload;
  await prisma.purchaseFrequency.update({
    where: { customerId },
    data: {
      frequency: newFrequency,
      lastUpdated: updatedDate,
      userId
    },
  });
  await dispatchEvent('purchase_frequency_changed', payload);
}
