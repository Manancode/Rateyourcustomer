import prisma from "../../../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";

export async function renewal_risk_identified(payload, userId) {
  const { customerId, riskDetails, identifiedDate } = payload;

  // Fetch the user associated with the given customerId
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    select: { user: { select: { companyId: true } } },
  });

  if (!customer) {
    throw new Error('Customer not found');
  }

  const companyId = customer.user.companyId;

  // Create the event log
  await prisma.eventLog.create({
    data: {
      eventType: 'RENEWAL_RISK_IDENTIFIED',
      payload: {
        customerId,
        riskDetails,
        identifiedDate,
      },
      companyId: companyId,
    },
  });

  await dispatchEvent('RENEWAL_RISK_IDENTIFIED', payload);
}



export async function renewal_rate_updated(payload, userId) {
  const { customerId, renewalRate, lastRenewalUpdate } = payload;

  // Fetch the user associated with the given customerId
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    select: { user: { select: { companyId: true } } },
  });

  if (!customer) {
    throw new Error('Customer not found');
  }

  const companyId = customer.user.companyId;

  // Update or create the renewal rate record
  await prisma.renewalRate.upsert({
    where: { customerId },
    update: {
      renewalRate,
      lastRenewalUpdate,
    },
    create: {
      customerId,
      renewalRate,
      lastRenewalUpdate,
    },
  });

  // Create the event log
  await prisma.eventLog.create({
    data: {
      eventType: 'RENEWAL_RATE_UPDATED',
      payload: {
        customerId,
        renewalRate,
        lastRenewalUpdate,
      },
      companyId: companyId,
    },
  });

  await dispatchEvent('RENEWAL_RATE_UPDATED', payload);
}