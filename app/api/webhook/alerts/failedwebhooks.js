import client from 'prom-client';

// Create a new registry
const register = new client.Registry();

// Define counters with labels
const webhookSuccessCounter = new client.Counter({
  name: 'webhook_success_total',
  help: 'Total number of successful webhooks',
  labelNames: ['event_type'], // Label to differentiate events
});

const webhookFailureCounter = new client.Counter({
  name: 'webhook_failure_total',
  help: 'Total number of failed webhooks',
  labelNames: ['event_type', 'error_type'], // Labels to differentiate errors
});

// Register metrics
register.registerMetric(webhookSuccessCounter);
register.registerMetric(webhookFailureCounter);

// Function to increment success counter
export function incrementSuccessCounter(eventType) {
  webhookSuccessCounter.inc({ event_type: eventType });
}

// Function to increment failure counter
export function incrementFailureCounter(eventType, errorType) {
  webhookFailureCounter.inc({ event_type: eventType, error_type: errorType });
}

// Export the registry to be used by your monitoring server
export default register;
