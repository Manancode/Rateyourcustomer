import prisma from "../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";

export async function lifetime_value_milestone_reached(payload, userId) {
  const { customerId, milestone, achievedDate } = payload;
  await prisma.lifetimeValue.create({
    data: {
      customerId,
      milestone,
      achievedDate,
      userId
    },
  });
  await dispatchEvent('lifetime_value_milestone_reached', payload);
}

export async function predicted_lifetime_value_updated(payload, userId) {
  const { customerId, predictedValue, updatedDate } = payload;
  await prisma.lifetimeValue.update({
    where: { customerId },
    data: {
      predictedValue,
      updatedDate,
    },
  });
  await dispatchEvent('predicted_lifetime_value_updated', payload);
}
