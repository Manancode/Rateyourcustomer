import { handleEvent } from "./events/eventHandler";



async function simulateEvent(eventType, customerId, additionalData) {
  await handleEvent({ eventType, customerId, additionalData });
}

// Example usage
simulateEvent('PAYMENT_RECEIVED', '123', { amount: 100, currency: 'USD' });
simulateEvent('ORDER_PLACED', '456', { orderId: 'ORD-789', total: 250 });