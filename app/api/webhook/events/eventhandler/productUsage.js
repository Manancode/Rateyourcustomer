import prisma from "../../../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";

export async function product_usage_updated(payload, userId) {
  const { customerId, featureUsed, usageDuration, usageDate } = payload;

  // Update or create a product usage record
  await prisma.productUsage.upsert({
    where: {
      customerId_usageDate_featureUsed: {
        customerId,
        usageDate: new Date(usageDate),
        featureUsed,
      }
    },
    update: {
      usageDuration,
    },
    create: {
      customerId,
      featureUsed,
      usageDuration,
      usageDate: new Date(usageDate),
      userId,
    },
  });

  // Dispatch the event
  await dispatchEvent('PRODUCT_USAGE_UPDATED', payload);
}

export async function feature_usage_declined(payload, userId) {
  const { customerId, featureUsed, declineReason, declineDate } = payload;

  // Optionally, you could create a separate model for feature usage declines if needed.
  // Here, we'll just log the decline or update an existing record if applicable.

  await prisma.eventLog.create({
    data: {
      eventType: 'FEATURE_USAGE_DECLINED',
      payload: {
        customerId,
        featureUsed,
        declineReason,
        declineDate,
      },
      companyId: userId, // Assuming userId is the companyId; adjust as needed
    },
  });

  // Dispatch the event
  await dispatchEvent('FEATURE_USAGE_DECLINED', payload);
}