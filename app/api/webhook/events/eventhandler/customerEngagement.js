import prisma from "../../../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";

export async function customer_engagement_updated(payload, userId) {
  const { customerId, engagementScore, lastEngaged, details } = payload;

  // Validate required fields
  if (!customerId || engagementScore === undefined || !lastEngaged) {
    throw new Error('Missing required fields: customerId, engagementScore, or lastEngaged');
  }

  // Validate engagementScore is a number and lastEngaged is a valid date
  const parsedEngagementScore = parseFloat(engagementScore);
  const parsedLastEngaged = new Date(lastEngaged);

  if (isNaN(parsedEngagementScore) || isNaN(parsedLastEngaged.getTime())) {
    throw new Error('Invalid engagementScore or lastEngaged format');
  }

  // Upsert operation: create if doesn't exist, otherwise update
  await prisma.customerEngagement.upsert({
    where: { customerId: customerId },
    update: {
      engagementScore: parsedEngagementScore,
      lastEngaged: parsedLastEngaged,
      details
    },
    create: {
      customerId: customerId,
      engagementScore: parsedEngagementScore,
      lastEngaged: parsedLastEngaged,
      details
    }
  });

  // Dispatch event after successful upsert
  await dispatchEvent('CUSTOMER_ENGAGEMENT_UPDATED', payload);
}
