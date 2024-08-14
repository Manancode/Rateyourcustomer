import prisma from "../../../../utils/prismaClient.js";
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
  await dispatchEvent('CUSTOMER_RATING_UPDATED', payload);
}


export async function data_sync_completed(payload) {
  const { customerId, syncDate, details, syncType = "Manual", status = "Completed" } = payload;

  // Fetch the userId from the Customer table using customerId
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    select: { userId: true }
  });

  if (!customer) {
    throw new Error('Customer not found');
  }

  const userId = customer.userId;

  // Create a dataSync record
  await prisma.dataSync.create({
    data: {
      syncType,        // Optional field
      status,          // Status of the sync
      details,         // Details of the sync operation
      syncDate: new Date(syncDate), // Date when sync occurred
      userId           // Associated userId
    }
  });

  // Dispatch the event
  await dispatchEvent('DATA_SYNC_COMPLETED', {
    eventType: 'DATA_SYNC_COMPLETED',
    customerId,
    syncDate,
    details,
    syncType,
    status
  });
}