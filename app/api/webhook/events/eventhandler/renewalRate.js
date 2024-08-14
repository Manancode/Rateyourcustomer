import prisma from "../../../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";


export async function renewal_risk_identified(payload, userId) {
  const { customerId, riskDetails, identifiedDate } = payload;

  await prisma.eventLog.create({
    data: {
      eventType: 'RENEWAL_RISK_IDENTIFIED',
      payload: {
        customerId,
        riskDetails,
        identifiedDate
      },
      companyId: userId // Assuming userId is the companyId; adjust as needed
    }
  });

  await dispatchEvent('RENEWAL_RISK_IDENTIFIED', payload);
}



export async function renewal_rate_updated(payload, userId) {
  const { customerId, renewalRate, lastRenewalUpdate } = payload;

  await prisma.renewalRate.upsert({
    where: {
      customerId: customerId
    },
    update: {
      renewalRate,
      lastRenewalUpdate
    },
    create: {
      customerId,
      renewalRate,
      lastRenewalUpdate,
      userId
    }
  });

  await dispatchEvent('RENEWAL_RATE_UPDATED', payload);
}