import prisma from "../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";

export async function account_health_score_updated(payload, userId) {
  const { customerId, healthScore } = payload;
  await prisma.accountHealth.upsert({
    where: { customerId },
    update: { healthScore },
    create: { customerId, healthScore, userId },
  });
  await dispatchEvent('account_health_score_updated', payload);
}

export async function account_at_risk(payload, userId) {
  const { customerId, riskReason } = payload;
  await prisma.accountRisk.create({
    data: {
      customerId,
      riskReason,
      reportedAt: new Date(),
      userId
    },
  });
  await dispatchEvent('account_at_risk', payload);
}
