import prisma from "../../../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";


export async function account_health_updated(payload, userId) {
  const { customerId, healthScore, updateDate } = payload;

  await prisma.accountHealth.upsert({
    where: {
      customerId_updateDate: {
        customerId,
        updateDate: new Date(updateDate),
      },
    },
    update: { healthScore },
    create: {
      customerId,
      healthScore,
      updateDate: new Date(updateDate),
      userId,
    },
  });

  await dispatchEvent('ACCOUNT_HEALTH_UPDATED', payload);
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
