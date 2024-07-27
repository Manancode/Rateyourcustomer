import prisma from "../../../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";


export async function upsell_opportunity_created(payload, userId) {
  const { customerId, opportunityId, createdDate } = payload;
  await prisma.upsellOpportunity.create({
    data: {
      customerId,
      opportunityId,
      createdAt: createdDate,
      status: 'open', // Initial status
      userId
    },
  });
  await dispatchEvent('upsell_opportunity_created', payload);
}




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
