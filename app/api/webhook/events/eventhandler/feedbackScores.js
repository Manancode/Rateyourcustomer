import prisma from "../../../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";


export async function feedback_score_updated(payload, userId) {
  const { customerId, feedbackScore, feedbackDate, feedbackType, details } = payload;

  await prisma.feedbackScores.upsert({
    where: {
      customerId_feedbackDate_feedbackType: {
        customerId,
        feedbackDate: new Date(feedbackDate),
        feedbackType
      }
    },
    update: {
      feedbackScore,
      details
    },
    create: {
      customerId,
      feedbackScore,
      feedbackDate: new Date(feedbackDate),
      feedbackType,
      details,
      userId
    }
  });

  await dispatchEvent('FEEDBACK_SCORE_UPDATED', payload);
}
