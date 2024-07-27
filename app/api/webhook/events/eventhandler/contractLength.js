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

export async function contract_renewed(payload, userId) {
  const { customerId, newEndDate } = payload;
  await prisma.contract.update({
    where: { customerId },
    data: {
      endDate: newEndDate,
    },
  });
  await dispatchEvent('contract_renewed', payload);
}

export async function contract_up_for_renewal(payload, userId) {
  const { customerId, renewalDate } = payload;
  await prisma.contract.update({
    where: { customerId },
    data: {
      renewalDate,
    },
  });
  await dispatchEvent('contract_up_for_renewal', payload);
}


export async function contract_updated(payload, userId) {
  const { contractId, contractLength, startDate, endDate } = payload;
  await prisma.contract.update({
    where: { id: contractId },
    data: {
      contractLength,
      startDate,
      endDate,
      userId,
    },
  });
  await dispatchEvent('contract_updated', payload);
}

export async function contract_terminated(payload, userId) {
  const { contractId, terminationDate } = payload;
  await prisma.contract.update({
    where: { id: contractId },
    data: {
      status: 'terminated',
      terminationDate,
      userId,
    },
  });
  await dispatchEvent('contract_terminated', payload);
}
