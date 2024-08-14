import prisma from "../../../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";


export async function contract_created(payload) {
  try {
    const { customerId, contractLength, startDate, endDate } = payload;

    if (!customerId || !contractLength || !startDate || !endDate) {
      throw new Error('Missing required fields: customerId, contractLength, startDate, or endDate');
    }

    const parsedCustomerId = parseInt(customerId);
    const parsedContractLength = parseInt(contractLength);
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (isNaN(parsedCustomerId) || isNaN(parsedContractLength) || isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      throw new Error('Invalid customerId, contractLength, startDate, or endDate format');
    }

    // Check if an existing contract with the same customerId and date range exists
    const existingContract = await prisma.contract.findFirst({
      where: {
        customerId: parsedCustomerId,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
      },
    });

    if (existingContract) {
      
      await prisma.contract.update({
        where: {
          id: existingContract.id,
        },
        data: {
          contractLength: parsedContractLength,
          startDate: parsedStartDate,
          endDate: parsedEndDate,
        },
      });
    } else {
      // If not found, create a new record
      await prisma.contract.create({
        data: {
          customerId: parsedCustomerId,
          contractLength: parsedContractLength,
          startDate: parsedStartDate,
          endDate: parsedEndDate,
          userId, // Assuming userId is available from the context
        },
      });
    }

    // Optionally trigger other actions or notifications
    await dispatchEvent('CONTRACT_CREATED', payload);

  } catch (error) {
    console.error('Error creating or updating contract:', error);
    throw error;
  }
}


export async function contract_updated(payload, userId) {
  const { customerId, updatedDetails } = payload;

  try {
    const contract = await prisma.contract.findFirst({
      where: { customerId },
    });

    if (!contract) {
      throw new Error(`Contract for customerId ${customerId} not found.`);
    }

    await prisma.contract.update({
      where: { id: contract.id },
      data: {
        updatedDetails,
        // updateDate: new Date(updateDate),
      },
    });

    await dispatchEvent('CONTRACT_UPDATED', payload);
  } catch (error) {
    console.error('Error updating contract:', error);
    throw error;
  }
}


export async function contract_terminated(payload, userId) {
  const { customerId, terminationDetails, terminationDate } = payload;

  try {
    const contract = await prisma.contract.findFirst({
      where: { customerId },
    });

    if (!contract) {
      throw new Error(`Contract for customerId ${customerId} not found.`);
    }

    await prisma.contract.update({
      where: { id: contract.id },
      data: {
        terminationDetails,
        terminationDate: new Date(terminationDate),
        status: "TERMINATED",
      },
    });

    await dispatchEvent('CONTRACT_TERMINATED', payload);
  } catch (error) {
    console.error('Error terminating contract:', error);
    throw error;
  }
}

