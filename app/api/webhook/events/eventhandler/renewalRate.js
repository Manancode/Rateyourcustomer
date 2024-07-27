import prisma from "../../../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";


export async function renewal_risk_identified(payload, userId) {
  const { customerId, riskLevel, identifiedDate } = payload;
  await prisma.renewalRate.update({
    where: { customerId },
    data: {
      riskLevel,
      lastRiskAssessment: identifiedDate,
      userId
    },
  });
  await dispatchEvent('renewal_risk_identified', payload);
}



export async function renewal_rate_updated(payload, userId) {
  const { customerId, renewalRate, updateDate } = payload;
  
  
  await prisma.renewalRate.update({
    where: { customerId },
    data: {
      renewalRate,
      lastRenewalUpdate: updateDate,
      userId
    },
  });

  // Dispatch the event after updating the rate
  await dispatchEvent('renewal_rate_updated', payload);
}
