import prisma from "../../../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";


export async function upsell_opportunity_created(payload, userId) {
  const { customerId, description, value, status } = payload;

  // Fetch companyId from the user associated with the customer
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    select: { user: { select: { companyId: true } } }
  });

  if (!customer) {
    throw new Error('Customer not found');
  }

  const companyId = customer.user.companyId;

  await prisma.upsellOpportunity.create({
    data: {
      customerId,
      description,
      value,
      status,
    }
  });

  await prisma.eventLog.create({
    data: {
      eventType: 'UPSELL_OPPORTUNITY_CREATED',
      payload: {
        customerId,
        description,
        value,
        status
      },
      companyId
    }
  });

  await dispatchEvent('UPSELL_OPPORTUNITY_CREATED', payload);
}


export async function upsell_opportunity_lost(payload, userId) {
  const { customerId, lossReason, lossDate } = payload;

  // Fetch companyId from the user associated with the customer
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    select: { user: { select: { companyId: true } } }
  });

  if (!customer) {
    throw new Error('Customer not found');
  }

  const companyId = customer.user.companyId;

  await prisma.upsellOpportunity.update({
    where: {
      customerId
    },
    data: {
      status: 'lost',
      lossReason,
      lossDate: new Date(lossDate)
    }
  });

  await prisma.eventLog.create({
    data: {
      eventType: 'UPSELL_OPPORTUNITY_LOST',
      payload: {
        customerId,
        lossReason,
        lossDate
      },
      companyId
    }
  });

  await dispatchEvent('UPSELL_OPPORTUNITY_LOST', payload);
}
