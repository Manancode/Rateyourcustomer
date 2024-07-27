import * as eventHandlers from './eventHandlers/index.js';

export async function processEvent(eventType, payload, userId) {
  const handler = eventHandlers[eventType];
  if (!handler) {
    throw new Error(`No handler found for event type: ${eventType}`);
  }
  await handler(payload, userId);
}