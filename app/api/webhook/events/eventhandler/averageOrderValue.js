import prisma from '../../../../utils/prismaClient.js';
import { dispatchEvent } from '../../utils/eventDispatcher.js';

export const average_order_value_updated = async (customerId) => {
    // Fetch the average order value for the customer
    const averageOrderValue = await prisma.averageOrderValue.findFirst({
        where: { customerId },
        orderBy: { createdAt: 'desc' },
    });

    if (!averageOrderValue) {
        console.error('No average order value found for customer:', customerId);
        return;
    }

    // Fetch the customer to get the userId
    const customer = await prisma.customer.findUnique({
        where: { id: customerId },
        select: { userId: true },
    });

    if (!customer) {
        console.error('Customer not found:', customerId);
        return;
    }

    const { userId } = customer;

    // Fetch the user to get the companyId
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { companyId: true },
    });

    if (!user) {
        console.error('User not found:', userId);
        return;
    }

    const { companyId } = user;

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
            customerId,
            companyId,
            payload: {
                averageOrderValue: averageOrderValue.averageValue,
                totalAmount: averageOrderValue.totalAmount,
                orderCount: averageOrderValue.orderCount,
                updatedAt: new Date(),
            },
        },
    });

    // Dispatch the event to any registered webhooks
    await dispatchEvent('AVERAGE_ORDER_VALUE_UPDATED', {
        customerId,
        averageOrderValue: averageOrderValue.averageValue,
        totalAmount: averageOrderValue.totalAmount,
        orderCount: averageOrderValue.orderCount,
        updatedAt: new Date(),
        companyId,
    });
};

