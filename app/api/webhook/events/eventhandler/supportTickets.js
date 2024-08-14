import prisma from "../../../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";

export async function support_ticket_created(payload, userId) {
  const { customerId, ticketId, createdAt } = payload;

  await prisma.supportTicket.create({
    data: {
      customerId,
      ticketId,
      createdAt: new Date(createdAt),
      userId
    }
  });

  await dispatchEvent('SUPPORT_TICKET_CREATED', payload);
}

export async function support_ticket_resolved(payload, userId) {
  const { ticketId, resolvedAt, satisfactionScore } = payload;

  await prisma.supportTicket.update({
    where: {
      ticketId: ticketId
    },
    data: {
      resolvedAt: new Date(resolvedAt),
      satisfactionScore
    }
  });

  await dispatchEvent('SUPPORT_TICKET_RESOLVED', payload);
}
