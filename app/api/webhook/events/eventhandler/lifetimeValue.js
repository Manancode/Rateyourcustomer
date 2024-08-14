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
    },
  });

  // Dispatch the event
  await dispatchEvent('LIFETIME_VALUE_CALCULATED', payload);
}


export async function lifetime_value_updated(payload, userId) {
  const { customerId, totalRevenue, startDate, endDate, details } = payload;

  // Update or create a lifetime value record
  await prisma.lifetimeValue.upsert({
    where: {
      customerId,
    },
    update: {
      totalRevenue,
      endDate: endDate ? new Date(endDate) : null,
      details,
    },
    create: {
      customerId,
      totalRevenue,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      details,
    },
  });

  // Dispatch the event
  await dispatchEvent('LIFETIME_VALUE_UPDATED', payload);
}