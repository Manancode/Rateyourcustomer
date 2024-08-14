import client from 'prom-client';
import prisma from '../../../utils/prismaClient.js';
import { dispatchEvent } from '../utils/eventDispatcher.js';
import * as eventHandlers from './eventhandler/index.js';

const webhookSuccessCounter = new client.Counter({
    name: 'event_handling_success_total',
    help: 'Total number of successfully handled events',
});

const webhookFailureCounter = new client.Counter({
    name: 'event_handling_failure_total',
    help: 'Total number of failed event handling attempts',
});

export async function handleEvent({ eventType, customerId, additionalData }) {
    console.log('handleEvent called with:', { eventType, customerId, additionalData });
    
    try {
        const customer = await prisma.customer.findUnique({
            where: { id: parseInt(customerId) },
            select: { id: true, name: true, companyId: true }
        });

        if (!customer) {
            throw new Error(`Customer with ID ${customerId} not found.`);
        }

        const payload = {
            customerId: customer.id,
            customerName: customer.name,
            companyId: customer.companyId,
            ...additionalData,
        };

        // Call the specific event handler
        const eventHandler = eventHandlers[eventType.toLowerCase()];
        if (typeof eventHandler === 'function') {
            await eventHandler(payload);
        } else {
            throw new Error(`No handler found for event type: ${eventType}`);
        }

        await dispatchEvent(eventType, payload);

        await prisma.customer.update({
            where: { id: customer.id },
            data: { lastEventSent: new Date() },
        });

        console.log(`Event ${eventType} handled successfully for customer ${customer.name}.`);
        webhookSuccessCounter.inc();
    } catch (error) {
        console.error(`Error handling event ${eventType} for customer ID ${customerId}:`, error);
        webhookFailureCounter.inc();
        throw error;
    }
}