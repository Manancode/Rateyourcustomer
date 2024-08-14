import prisma from "../../../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";

export async function feedback_score_updated(payload, userId) {
  const { customerId, feedbackScore, feedbackDate, feedbackType, details } = payload;

  // Convert feedbackDate to Date object
  const feedbackDateParsed = new Date(feedbackDate);

  // Try to find an existing feedback score entry
  const existingFeedback = await prisma.feedbackScores.findFirst({
    where: {
      customerId,
      feedbackDate: feedbackDateParsed,
      feedbackType
    }
  });

  if (existingFeedback) {
    // If found, update the existing record
    await prisma.feedbackScores.update({
      where: {
        id: existingFeedback.id
      },
      data: {
        feedbackScore,
        details
      }
    });
  } else {
    await prisma.feedbackScores.create({
      data: {
        customerId,
        feedbackScore,
        feedbackDate: feedbackDateParsed,
        feedbackType,
        details,
      }
    });
  }

  await dispatchEvent('FEEDBACK_SCORE_UPDATED', payload);
}
