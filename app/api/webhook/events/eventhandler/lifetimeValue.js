import prisma from "../../../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";

export async function lifetime_value_calculated(payload, userId) {
  const { customerId, totalRevenue, startDate, endDate } = payload;
  
  await prisma.lifetimeValue.create({
    data: {
      customerId,
      totalRevenue,
      startDate,
      endDate,
      userId,
    },
  });
  
  await dispatchEvent('lifetime_value_calculated', payload);
}


export async function lifetime_value_updated(payload, userId) {
  const { customerId, predictedValue, updatedDate } = payload;
  
  await prisma.lifetimeValue.update({
    where: { customerId },
    data: {
      predictedValue,
      updatedDate,
      userId,
    },
  });
  
  await dispatchEvent('lifetime_value_updated', payload);
}
