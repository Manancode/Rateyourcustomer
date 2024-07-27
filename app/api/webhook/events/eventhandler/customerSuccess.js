import prisma from "../../../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";


export async function success_milestone_achieved(payload, userId) {
  const { customerId, milestone, achievedDate } = payload;
  await prisma.customerSuccess.create({
    data: {
      customerId,
      milestone,
      achievedDate,
      userId,
    },
  });
  await dispatchEvent('success_milestone_achieved', payload);
}

export async function customer_success_score_updated(payload, userId) {
  const { customerId, successScore, updatedDate } = payload;
  await prisma.customerSuccess.update({
    where: { customerId },
    data: {
      successScore,
      updatedDate,
    },
  });
  await dispatchEvent('customer_success_score_updated', payload);
}
