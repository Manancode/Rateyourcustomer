import prisma from "../../../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";

export async function order_placed(payload, userId) {
  const { customerId, orderValue, orderDate, status } = payload;

  // Create a new order record
  await prisma.orderValue.create({
    data: {
      customerId,
      orderValue,
      orderDate,
      status, // E.g., 'placed'
      userId,
    },
  });

  // Dispatch the event
  await dispatchEvent('ORDER_PLACED', payload);
}

export async function order_updated(payload, userId) {
  const { orderId, updatedFields } = payload;

  // Update the existing order record
  await prisma.orderValue.update({
    where: { id: orderId },
    data: updatedFields, // Updated fields should be part of the payload
  });

  // Dispatch the event
  await dispatchEvent('ORDER_UPDATED', payload);
}

export async function order_cancelled(payload, userId) {
  const { orderId, cancelDate } = payload;

  // Update the existing order record to set its status to 'cancelled'
  await prisma.orderValue.update({
    where: { id: orderId },
    data: {
      status: 'cancelled',
      cancelDate,
    },
  });

  // Dispatch the event
  await dispatchEvent('ORDER_CANCELLED', payload);
}
