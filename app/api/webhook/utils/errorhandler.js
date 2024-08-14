import winston from 'winston'
import { incrementFailureCounter } from '../alerts/failedwebhooks.js';

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log' })
  ],
});

export function logAndMonitorError(eventType, webhookUrl, error) {
  // Log the error
  logger.error(`Failed to dispatch event ${eventType} to ${webhookUrl}:`, { message: error.message, stack: error.stack });

  // Increment the failure counter in Prometheus
  incrementFailureCounter(eventType, error.message);
}

// Export logger separately if you need to use it directly elsewhere
export { logger };
