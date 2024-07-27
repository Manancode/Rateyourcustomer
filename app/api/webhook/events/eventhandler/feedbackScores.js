import prisma from "../../../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";


export async function feedback_score_updated(payload, userId) {
  const { customerId, satisfactionScore, updatedDate } = payload;
  await prisma.feedbackScores.update({
    where: { customerId },
    data: {
      satisfactionScore,
      updatedDate,
    },
  });
  await dispatchEvent('feedback_score_updated', payload);
}
