import prisma from "../../../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";

export async function resource_downloaded(payload, userId) {
  const { customerId, resourceId, downloadDate } = payload;

  // Fetch the user associated with the given customerId
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    select: { user: { select: { companyId: true } } },
  });

  if (!customer) {
    throw new Error('Customer not found');
  }

  const companyId = customer.user.companyId;

  // Create the event log
  await prisma.eventLog.create({
    data: {
      eventType: 'RESOURCE_DOWNLOADED',
      payload: {
        customerId,
        resourceId,
        downloadDate,
        eventType: 'RESOURCE_DOWNLOADED'
      },
      companyId: companyId,
    },
  });

  await dispatchEvent('RESOURCE_DOWNLOADED', payload);
}

export async function support_article_viewed(payload, userId) {
  const { customerId, articleId, viewDate } = payload;

  // Fetch the user associated with the given customerId
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    select: { user: { select: { companyId: true } } },
  });

  if (!customer) {
    throw new Error('Customer not found');
  }

  const companyId = customer.user.companyId;

  // Create the event log
  await prisma.eventLog.create({
    data: {
      eventType: 'SUPPORT_ARTICLE_VIEWED',
      payload: {
        customerId,
        articleId,
        viewDate,
        eventType: 'SUPPORT_ARTICLE_VIEWED'
      },
      companyId: companyId,
    },
  });

  await dispatchEvent('SUPPORT_ARTICLE_VIEWED', payload);
}