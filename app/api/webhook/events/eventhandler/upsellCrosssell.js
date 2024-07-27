import prisma from "../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";

export async function upsell_opportunity_lost(payload, userId) {
  const { customerId, opportunityId, lossReason, lossDate } = payload;
  await prisma.upsellOpportunity.update({
    where: { id: opportunityId },
    data: {
      status: 'lost',
      lossReason,
      lossDate,
      userId
    },
  });
  await dispatchEvent('upsell_opportunity_lost', payload);
}
