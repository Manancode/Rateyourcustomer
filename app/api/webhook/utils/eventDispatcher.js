import axios from 'axios';
import prisma from '../../../utils/prismaClient.js';
import { logAndMonitorError } from './errorhandler.js';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function retryWebhook(url, data, retries = 0) {
    try {
        return await axios.post(url, data, {
            headers: {'Content-Type': 'application/json'},
            timeout: 5000 // 5 seconds timeout
        });
    } catch (error) {
        if (retries < MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return retryWebhook(url, data, retries + 1);
        }
        throw error;
    }
}

function sanitizePayload(payload) {
    // List of sensitive fields to remove
    const sensitiveFields = ['password', 'ssn', 'creditCardNumber', 'apiKey'];

    // List of fields that might have large data to truncate
    const truncatableFields = ['comments', 'description', 'notes'];

    // Maximum length for truncatable fields
    const MAX_LENGTH = 255;

    const sanitizedPayload = {};

    Object.keys(payload).forEach(key => {
        // Skip sensitive fields
        if (sensitiveFields.includes(key)) {
            return;
        }

        // Truncate fields that may contain large data
        if (truncatableFields.includes(key) && typeof payload[key] === 'string') {
            sanitizedPayload[key] = payload[key].substring(0, MAX_LENGTH);
        } else {
            // Copy other fields as is
            sanitizedPayload[key] = payload[key];
        }
    });

    // Remove any null or undefined values
    Object.keys(sanitizedPayload).forEach(key => {
        if (sanitizedPayload[key] == null) {
            delete sanitizedPayload[key];
        }
    });

    return sanitizedPayload;
}


export async function dispatchEvent(eventType, payload) {
    console.log(`Dispatching event: ${eventType}`);
    try {
        const webhooks = await prisma.webhook.findMany({
            where: {
                events: {
                    has: eventType,
                },
                status: "active", // Only select active webhooks
            },
        });

        console.log(`Found ${webhooks.length} active webhooks for event ${eventType}`);

        const sanitizedPayload = sanitizePayload(payload);

        const dispatchPromises = webhooks.map(async webhook => {
            try {
                await retryWebhook(webhook.url, {
                    event: eventType,
                    payload: sanitizedPayload,
                });
                
                // Update webhook with last successful dispatch date
                await prisma.webhook.update({
                    where: { id: webhook.id },
                    data: { 
                        lastSuccessfulDispatch: new Date(),
                        failureCount: 0 // Reset failure count on success
                    }
                });
            } catch (error) {
                logAndMonitorError(eventType, webhook.url, error);
                
                // Update webhook with last failed dispatch date and increment failure count
                await prisma.webhook.update({
                    where: { id: webhook.id },
                    data: { 
                        lastFailedDispatch: new Date(),
                        failureCount: { increment: 1 }
                    }
                });
            }
        });

        await Promise.all(dispatchPromises);
        console.log(`Finished dispatching event: ${eventType}`);
    } catch (error) {
        console.error('Failed to retrieve or process webhooks:', error);
        throw error;
    }
}
