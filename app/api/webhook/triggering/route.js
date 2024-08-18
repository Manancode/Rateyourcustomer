import { handleEvent } from '../events/eventHandler.js';
import { validatePayload } from '../events/eventValidator.js';
import { sendSlackAlert } from '../alerts/notification.js';
import { incrementFailureCounter } from '../alerts/failedwebhooks.js';

const availableEvents = [
    'PAYMENT_RECEIVED', 'PAYMENT_MISSED', 'PAYMENT_TERMS_CHANGED',
    'ORDER_PLACED', 'ORDER_UPDATED', 'ORDER_CANCELLED',
    'LIFETIME_VALUE_UPDATED', 'LIFETIME_VALUE_CALCULATED',
    'PRODUCT_USAGE_UPDATED', 'FEATURE_USAGE_DECLINED',
    'PURCHASE_FREQUENCY_CHANGED', 'RENEWAL_RATE_UPDATED',
    'RENEWAL_RISK_IDENTIFIED', 'RETURN_RATE_UPDATED',
    'SUPPORT_TICKET_CREATED', 'SUPPORT_TICKET_RESOLVED',
    'UPSELL_OPPORTUNITY_CREATED', 'UPSELL_OPPORTUNITY_LOST',
    'CUSTOMER_ENGAGEMENT_UPDATED', 'CUSTOMER_SUCCESS_UPDATED',
    'SUCCESS_MILESTONE_ACHIEVED', 'FEEDBACK_SCORE_UPDATED',
    'DATA_SYNC_COMPLETED', 'CONTRACT_CREATED', 'CONTRACT_UPDATED',
    'CONTRACT_TERMINATED', 'ACCOUNT_HEALTH_UPDATED', 'ACCOUNT_AT_RISK',
    'RESOURCE_DOWNLOADED', 'SUPPORT_ARTICLE_VIEWED', 'AVERAGE_ORDER_VALUE_UPDATED', 'CUSTOMER_RATING_UPDATE'
];

export async function POST(req, res) {
    

    let eventType;
    let customerId;

    try {
        const requestData = req.body; 
        eventType = requestData.eventType;
        customerId = requestData.customerId;
        const additionalData = requestData.additionalData;

        if (!eventType || !customerId) {
            return res.status(400).json({ error: 'Missing required fields: eventType, customerId' });
        }

        if (!availableEvents.includes(eventType)) {
            return res.status(400).json({ error: `Invalid event type: ${eventType}` });
        }

        const payload = {
            eventType,
            customerId,
            additionalData
        };

       // Validate payload before handling the event
        const missingFields = validatePayload(eventType, { customerId, ...additionalData });
        if (missingFields.length > 0) {
            throw new Error(`Payload validation failed for event ${eventType}. Missing fields: ${missingFields.join(', ')}`);
        }

        await handleEvent(payload);

        return res.status(200).json({ message: `Event ${eventType} triggered successfully for customer ${customerId}` });
    } catch (error) {
        console.error(`Error triggering event ${eventType} for customer ${customerId}:`, error);

        incrementFailureCounter();
        await sendSlackAlert(`Failed to handle event ${eventType} for customer ${customerId}. Error: ${error.message}`);

        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
