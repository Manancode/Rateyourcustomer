
import * as eventHandler from './eventhandler/index.js';

export async function processEvent(eventType, payload, userId) {
  const handler = eventHandler[eventType];
  if (!handler) {
    throw new Error(`No handler found for event type: ${eventType}`);
  }
  await handler(payload, userId);
}
