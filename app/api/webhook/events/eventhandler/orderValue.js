import prisma from "../../../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";

export async function order_placed(payload, userId) {
  const { customerId, orderValue, orderDate } = payload;
  await prisma.orderValue.create({
    data: {
      customerId,
      orderValue,
      orderDate,
      status: 'placed',
      userId
    },
  });
  await dispatchEvent('order_placed', payload);
}

export async function order_updated(payload, userId) {
  const { orderId, newOrderValue, updateDate } = payload;
  await prisma.orderValue.update({
    where: { id: orderId },
    data: {
      orderValue: newOrderValue,
      updateDate,
      status: 'updated'
    },
  });
  await dispatchEvent('order_updated', payload);
}

export async function order_cancelled(payload, userId) {
  const { orderId, cancelDate } = payload;
  await prisma.orderValue.update({
    where: { id: orderId },
    data: {
      status: 'cancelled',
      cancelDate
    },
  });
  await dispatchEvent('order_cancelled', payload);
}
