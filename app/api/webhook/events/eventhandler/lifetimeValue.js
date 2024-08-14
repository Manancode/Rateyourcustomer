import prisma from "../../../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";

export async function lifetime_value_calculated(payload, userId) {
  const { customerId, totalRevenue, startDate, endDate, details } = payload;

  // Create a new lifetime value record
  await prisma.lifetimeValue.create({
    data: {
      customerId,
      totalRevenue,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      details,
      userId,
    },
  });

  // Dispatch the event
  await dispatchEvent('LIFETIME_VALUE_CALCULATED', payload);
}

export async function lifetime_value_updated(payload, userId) {
  const { customerId, totalRevenue, endDate, details } = payload;

  // Update or create a lifetime value record
  await prisma.lifetimeValue.upsert({
    where: {
      customerId_startDate: {
        customerId,
        startDate: new Date(payload.startDate) // Assuming startDate is provided
      }
    },
    update: {
      totalRevenue,
      endDate,
      details,
    },
    create: {
      customerId,
      totalRevenue,
      startDate: new Date(payload.startDate),
      endDate,
      details,
      userId,
    },
  });

  // Dispatch the event
  await dispatchEvent('LIFETIME_VALUE_UPDATED', payload);
}
