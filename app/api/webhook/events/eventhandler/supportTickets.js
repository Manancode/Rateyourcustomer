import prisma from "../../../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";

export async function support_ticket_created(payload, userId) {
  const { customerId, ticketId, createdDate } = payload;
  await prisma.supportTicket.create({
    data: {
      customerId,
      ticketId,
      createdAt: createdDate,
      userId,
    },
  });
  await dispatchEvent('support_ticket_created', payload);
}



export async function support_ticket_resolved(payload, userId) {
  const { ticketId, resolvedDate } = payload;
  await prisma.supportTicket.update({
    where: { id: ticketId },
    data: {
      resolvedAt: resolvedDate,
      userId,
    },
  });
  await dispatchEvent('support_ticket_resolved', payload);
}
