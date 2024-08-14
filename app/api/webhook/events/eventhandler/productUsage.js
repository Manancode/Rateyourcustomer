import prisma from "../../../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";

export async function product_usage_updated(payload, userId) {
  const { customerId, featureUsed, usageDuration, usageDate } = payload;

  await prisma.productUsage.upsert({
    where: {
      customerId: customerId,
    },
    update: {
      featureUsed,
      usageDuration,
      usageDate: new Date(usageDate),
    },
    create: {
      customerId,
      featureUsed,
      usageDuration,
      usageDate: new Date(usageDate),
    },
  });

  await dispatchEvent('PRODUCT_USAGE_UPDATED', payload);
}


export async function feature_usage_declined(payload, userId) {
  const { customerId, featureUsed, declineReason, declineDate } = payload;

  // Fetch the companyId associated with the user's company linked to the customer
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    select: {
      user: {
        select: {
          companyId: true,
        },
      },
    },
  });

  if (!customer || !customer.user) {
    throw new Error(`Customer with ID ${customerId} or associated user not found`);
  }

  const { companyId } = customer.user;

  await prisma.eventLog.create({
    data: {
      eventType: 'FEATURE_USAGE_DECLINED',
      payload: {
        customerId,
        featureUsed,
        declineReason,
        declineDate,
      },
      companyId, // Automatically fetched companyId
    },
  });

  await dispatchEvent('FEATURE_USAGE_DECLINED', payload);
}