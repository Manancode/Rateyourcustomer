import prisma from "../../../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";


export async function return_rate_updated(payload, userId) {
  const { customerId, returnRate, updateDate } = payload;
  await prisma.returnRate.update({
    where: { customerId },
    data: {
      returnRate,
      lastUpdate: updateDate,
      userId
    },
  });
  await dispatchEvent('return_rate_updated', payload);
}
