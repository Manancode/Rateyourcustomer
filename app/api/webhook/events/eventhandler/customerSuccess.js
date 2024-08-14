import prisma from "../../../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";


export async function success_milestone_achieved(payload, userId) {
  const { customerId, milestone, achievedAt, details } = payload;

  await prisma.customerSuccess.create({
    data: {
      customerId,
      successScore: 100, // Or any default score or calculation
      milestone,
      achievedAt: new Date(achievedAt),
      details,
    }
  });

  await dispatchEvent('SUCCESS_MILESTONE_ACHIEVED', payload);
}

export async function customer_success_updated(payload, userId) {
  const { customerId, successScore, milestone, achievedAt, details } = payload;

  await prisma.customerSuccess.update({
    where: {
      customerId: customerId
    },
    data: {
      successScore,
      milestone,
      achievedAt: new Date(achievedAt),
      details
    }
  });

  await dispatchEvent('CUSTOMER_SUCCESS_UPDATED', payload);
}

