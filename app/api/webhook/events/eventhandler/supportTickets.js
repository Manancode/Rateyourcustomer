import prisma from "../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";

export async function ticket_satisfaction_score_updated(payload, userId) {
  const { customerId, ticketId, satisfactionScore, updateDate } = payload;
  await prisma.supportTicket.update({
    where: { id: ticketId },
    data: {
      satisfactionScore,
      lastUpdate: updateDate,
      userId
    },
  });
  await dispatchEvent('ticket_satisfaction_score_updated', payload);
}
