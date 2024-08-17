
import { dispatchEvent } from './utils/eventDispatcher.js';
import { EventEmitter } from 'events'


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
    'RESOURCE_DOWNLOADED', 'SUPPORT_ARTICLE_VIEWED' , 'AVERAGE_ORDER_VALUE_UPDATED' , 'CUSTOMER_RATING_UPDATE'
];

export const eventEmitter = new EventEmitter();

export function setupEventListeners() {
    availableEvents.forEach(eventType => {
      eventEmitter.on(eventType, async (payload) => {
        console.log(`Event detected: ${eventType}`);
        console.log('Payload:', payload);
        
        // Send webhook
        try {
          await dispatchEvent(eventType, payload);
          console.log(`Webhook sent for event: ${eventType}`);
        } catch (error) {
          console.error(`Error sending webhook for event ${eventType}:`, error);
        }
      });
    });
  }