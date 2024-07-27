import prisma from "../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";

export async function customer_engagement_increased(payload, userId) {
  const { customerId, engagementScore, engagementDate } = payload;
  await prisma.customerEngagement.create({
    data: {
      customerId,
      engagementScore,
      engagementDate,
      userId,
    },
  });
  await dispatchEvent('customer_engagement_increased', payload);
}

export async function customer_engagement_decreased(payload, userId) {
  const { customerId, engagementScore, engagementDate } = payload;
  await prisma.customerEngagement.create({
    data: {
      customerId,
      engagementScore,
      engagementDate,
      userId,
    },
  });
  await dispatchEvent('customer_engagement_decreased', payload);
}

export async function customer_engagement_score_updated(payload, userId) {
  const { customerId, newEngagementScore } = payload;
  await prisma.customerEngagement.update({
    where: { customerId },
    data: {
      engagementScore: newEngagementScore,
    },
  });
  await dispatchEvent('customer_engagement_score_updated', payload);
}
