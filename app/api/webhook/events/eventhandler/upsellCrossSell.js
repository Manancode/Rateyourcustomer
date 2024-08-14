import prisma from "../../../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";


export async function upsell_opportunity_created(payload, userId) {
  const { customerId, opportunityId, status } = payload;

  await prisma.upsellOpportunity.create({
    data: {
      customerId,
      opportunityId,
      status,
      userId
    }
  });

  await dispatchEvent('UPSELL_OPPORTUNITY_CREATED', payload);
}



export async function upsell_opportunity_lost(payload, userId) {
  const { opportunityId, lossReason, lossDate } = payload;

  await prisma.upsellOpportunity.update({
    where: {
      opportunityId: opportunityId
    },
    data: {
      status: 'lost',
      lossReason,
      lossDate: new Date(lossDate)
    }
  });

  await dispatchEvent('UPSELL_OPPORTUNITY_LOST', payload);
}
