import prisma from "../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";

export async function customer_rating_updated(payload, userId) {
  const { customerId, newRating, updatedDate } = payload;
  await prisma.customerRatings.update({
    where: { customerId },
    data: {
      rating: newRating,
      updatedDate,
    },
  });
  await dispatchEvent('customer_rating_updated', payload);
}

export async function data_sync_completed(payload, userId) {
  const { syncDate, details } = payload;
  await prisma.dataSync.create({
    data: {
      userId,
      syncDate,
      details,
    },
  });
  await dispatchEvent('data_sync_completed', payload);
}
