import { notifyThresholdAlert } from './notification';

// Define the failure threshold
const FAILURE_THRESHOLD = 10;

// This variable should be stored persistently, e.g., in a database or a file
let failureCount = 0;

// Function to be called when a webhook fails
function handleWebhookFailure() {
  failureCount++;

  // Check if the failure count has reached the threshold
  if (failureCount >= FAILURE_THRESHOLD) {
    notifyThresholdAlert(FAILURE_THRESHOLD, failureCount)
      .then(() => {
        console.log('Threshold alert sent.');
        // Reset failure count or take appropriate action
        failureCount = 0;
      })
      .catch((error) => {
        console.error('Failed to send threshold alert:', error);
      });
  }
}

// Example of incrementing failure count
// This would typically be called inside your webhook failure handling logic
handleWebhookFailure();
