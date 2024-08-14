import prisma from "../../../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";

export async function support_ticket_created(payload, userId) {
  const { customerId, ticketId, createdAt } = payload;

  await prisma.supportTicket.create({
    data: {
      customerId,
      ticketId,
      createdAt: new Date(createdAt),
    }
  });

  // Dispatch the event with eventType
  const eventPayload = {
    eventType: 'SUPPORT_TICKET_CREATED',
    customerId,
    ticketId,
    createdAt
  };

  await dispatchEvent('SUPPORT_TICKET_CREATED', eventPayload);
}



export async function support_ticket_resolved(payload, userId) {
  const { ticketId, resolvedAt, satisfactionScore, customerId } = payload;

  // Update the support ticket with resolvedAt and satisfactionScore
  await prisma.supportTicket.update({
    where: {
      ticketId: ticketId
    },
    data: {
      resolvedAt: new Date(resolvedAt),
      satisfactionScore,
      customerId // Ensure this is included for consistency and reference
    }
  });

  // Dispatch the event with eventType
  const eventPayload = {
    eventType: 'SUPPORT_TICKET_RESOLVED',
    ticketId,
    resolvedAt,
    satisfactionScore,
    customerId
  };

  await dispatchEvent('SUPPORT_TICKET_RESOLVED', eventPayload);
}