import prisma from "../../../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";

export async function account_health_updated(payload, userId) {
  const { customerId, healthScore, status, details, updateDate } = payload;

  try {
    // Update or create the AccountHealth record
    const accountHealth = await prisma.accountHealth.upsert({
      where: {
        customerId: parseInt(customerId, 10),
      },
      update: {
        healthScore,
        status,
        details,
        createdAt: new Date(updateDate), // Updating createdAt might not be necessary; it depends on your use case
      },
      create: {
        customerId: parseInt(customerId, 10),
        healthScore,
        status,
        details,
        createdAt: new Date(updateDate),
      },
    });

    // Dispatch event after upsert operation
    await dispatchEvent('ACCOUNT_HEALTH_UPDATED', payload);

    return accountHealth;
  } catch (error) {
    console.error('Error updating account health:', error);
    throw error;
  }
}

export async function account_at_risk(payload, userId) {
  const { customerId, riskFactors, identifiedDate } = payload;

  await prisma.eventLog.create({
    data: {
      eventType: 'ACCOUNT_AT_RISK',
      payload: {
        customerId,
        riskFactors,
        identifiedDate,
      },
      companyId: userId,
    },
  });

  await dispatchEvent('ACCOUNT_AT_RISK', payload);
}
