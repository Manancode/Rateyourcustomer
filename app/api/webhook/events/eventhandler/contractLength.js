import prisma from "../../../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";


export async function contract_created(payload, userId) {
  const { customerId, contractLength, startDate, endDate } = payload;
  await prisma.contract.create({
    data: {
      customerId,
      contractLength,
      startDate,
      endDate,
      userId,
    },
  });
  await dispatchEvent('contract_created', payload);
}

export async function contract_updated(payload, userId) {
  const { contractId, updatedDetails, updateDate } = payload;

  await prisma.contract.update({
    where: { id: contractId },
    data: {
      updatedDetails,
      updateDate: new Date(updateDate),
    },
  });

  await dispatchEvent('CONTRACT_UPDATED', payload);
}

export async function contract_terminated(payload, userId) {
  const { contractId, terminationDetails, terminationDate } = payload;

  await prisma.contract.update({
    where: { id: contractId },
    data: {
      terminationDetails,
      terminationDate: new Date(terminationDate),
      status: "TERMINATED",
    },
  });

  await dispatchEvent('CONTRACT_TERMINATED', payload);
}
