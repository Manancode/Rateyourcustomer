import prisma from "../../../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";

export async function customer_engagement_updated(payload, userId) {
  const { customerId, engagementScore, lastEngaged, details } = payload;

  await prisma.customerEngagement.update({
    where: {
      customerId: customerId
    },
    data: {
      engagementScore,
      lastEngaged: new Date(lastEngaged),
      details
    }
  });

  await dispatchEvent('CUSTOMER_ENGAGEMENT_UPDATED', payload);
}