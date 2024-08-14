
import prisma from '../../../../utils/prismaClient.js';
import { dispatchEvent } from '../../utils/eventDispatcher.js';

export const average_order_value_updated = async (customerId) => {
    
    const averageOrderValue = await prisma.averageOrderValue.findFirst({
        where: { customerId },
        orderBy: { createdAt: 'desc' },
    });

    if (!averageOrderValue) {
        console.error('No average order value found for customer:', customerId);
        return;
    }

    // Update the rating or any other customer-related data based on the new average order value
    const updatedRating = await prisma.rating.updateMany({
        where: { customerId },
        data: {
            value: averageOrderValue.averageValue * 0.1, // Adjust rating based on average order value
            updatedAt: new Date(),
        },
    });

    if (updatedRating.count > 0) {
        console.log('Customer rating updated based on average order value:', updatedRating);
    } else {
        console.error('Failed to update customer rating:', customerId);
    }

    // Log the event
    await prisma.eventLog.create({
        data: {
            eventType: 'AVERAGE_ORDER_VALUE_UPDATED',
            payload: { customerId, averageOrderValue },
            companyId: (await prisma.customer.findUnique({ where: { id: customerId } })).companyId,
        },
    });

    // Dispatch the event to any registered webhooks
    await dispatchEvent('AVERAGE_ORDER_VALUE_UPDATED', { customerId, averageOrderValue });
};
