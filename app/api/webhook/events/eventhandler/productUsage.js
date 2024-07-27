import prisma from "../../../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";

export async function product_usage_updated(payload, userId) {
  const { customerId, featureUsed, usageDuration, usageDate } = payload;

  await prisma.productUsage.create({
    data: {
      customerId,
      featureUsed,
      usageDuration,
      usageDate,
      userId
    },
  });

  await dispatchEvent('product_usage_updated', payload);
}


export async function feature_usage_declined(payload, userId) {
  const { customerId, feature, declineDate } = payload;
  await prisma.productUsage.update({
    where: { customerId },
    data: {
      declinedFeatures: { push: { feature, declineDate } },
      userId
    },
  });
  await dispatchEvent('feature_usage_declined', payload);
}
