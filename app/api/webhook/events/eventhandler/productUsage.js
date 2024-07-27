import prisma from "../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";

export async function product_adoption_score_updated(payload, userId) {
  const { customerId, newScore, updatedDate } = payload;
  await prisma.productUsage.update({
    where: { customerId },
    data: {
      adoptionScore: newScore,
      lastUpdated: updatedDate,
      userId
    },
  });
  await dispatchEvent('product_adoption_score_updated', payload);
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
