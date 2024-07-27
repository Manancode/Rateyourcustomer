
import prisma from '../../../../utils/prismaClient.js';
import { dispatchEvent } from '../../utils/eventDispatcher.js';


export async function average_order_value_updated(payload, userId) {
  const { customerId, totalAmount, orderCount, orderDates } = payload;


  await prisma.averageOrderValue.upsert({
    where: { customerId },
    update: {
      totalAmount,
      orderCount,
      orderDates,
      userId,
    },
    create: {
      customerId,
      totalAmount,
      orderCount,
      orderDates,
      userId,
    },
  });

  // Dispatch the event
  await dispatchEvent('average_order_value_updated', payload);
}
