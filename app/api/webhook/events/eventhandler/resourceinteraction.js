import prisma from "../../../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";

export async function resource_downloaded(payload, userId) {
  const { customerId, resourceId, downloadDate } = payload;

  await prisma.eventLog.create({
    data: {
      eventType: 'RESOURCE_DOWNLOADED',
      payload: {
        customerId,
        resourceId,
        downloadDate,
      },
      companyId: userId,
    },
  });

  await dispatchEvent('RESOURCE_DOWNLOADED', payload);
}

export async function support_article_viewed(payload, userId) {
    const { customerId, articleId, viewDate } = payload;
  
    await prisma.eventLog.create({
      data: {
        eventType: 'SUPPORT_ARTICLE_VIEWED',
        payload: {
          customerId,
          articleId,
          viewDate,
        },
        companyId: userId,
      },
    });
  
    await dispatchEvent('SUPPORT_ARTICLE_VIEWED', payload);
  }