import prisma from "../../../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";

export async function order_placed(payload, userId) {
  const { customerId, orderValue, orderDate, status } = payload;

  // Create a new order record with a generated UUID for orderId
  const order = await prisma.orderValue.create({
    data: {
      orderId: payload.orderId || undefined, // Use provided orderId or let Prisma generate a new UUID
      customerId,
      orderValue,
      orderDate,
      status, // E.g., 'placed'
    },
  });

  // Include the generated orderId in the payload
  payload.orderId = order.orderId;

  await dispatchEvent('ORDER_PLACED', payload);
}


export async function order_updated(payload, userId) {
  const { customerId, orderId, updatedFields } = payload;

  // Update the existing order record
  await prisma.orderValue.update({
    where: {  orderId : orderId, customerId: customerId  },
    data: updatedFields,
  });

  await dispatchEvent('ORDER_UPDATED', payload);
}

export async function order_cancelled(payload, userId) {
  const { customerId, orderId, cancelDate } = payload;

  // Update the existing order record to set its status to 'cancelled'
  await prisma.orderValue.update({
    where: { orderId : orderId, customerId: customerId  },
    data: {
      status: 'cancelled',
      cancelDate,
    },
  });

  await dispatchEvent('ORDER_CANCELLED', payload);
}


