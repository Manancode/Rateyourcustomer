import prisma from "../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";

export async function order_value_threshold_reached(payload, userId) {
  const { customerId, orderValue, threshold, reachedDate } = payload;
  await prisma.orderValue.create({
    data: {
      customerId,
      orderValue,
      threshold,
      reachedDate,
      userId
    },
  });
  await dispatchEvent('order_value_threshold_reached', payload);
}
