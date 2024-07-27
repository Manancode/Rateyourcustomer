import prisma from "../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";

export async function customer_satisfaction_score_updated(payload, userId) {
  const { customerId, satisfactionScore, updatedDate } = payload;
  await prisma.feedbackScores.update({
    where: { customerId },
    data: {
      satisfactionScore,
      updatedDate,
    },
  });
  await dispatchEvent('customer_satisfaction_score_updated', payload);
}
