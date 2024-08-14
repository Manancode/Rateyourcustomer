import axios from 'axios';


const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';

/**
 * Sends a notification to Slack.
 * 
 * @param {string} message - The message to send.
 * @param {string} [channel='#general'] - Optional Slack channel to send the alert to.
 * @param {string} [username='Alert Bot'] - Optional username to use for the bot.
 */
export async function sendSlackAlert(message, channel = '#general', username = 'Alert Bot') {
  try {
    await axios.post(SLACK_WEBHOOK_URL, {
      text: message,
      channel: channel,
      username: username,
    });
  } catch (error) {
    console.error('Failed to send Slack alert:', error);
  }
}

// Function to notify Slack on webhook failure
export async function notifyWebhookFailure(webhookUrl, errorType) {
  const message = `Failed to dispatch event to ${webhookUrl}. Error: ${errorType}`;
  await sendSlackAlert(message, '#webhook-alerts', 'Webhook Alert Bot');
}

// Function to notify Slack on threshold alerts
export async function notifyThresholdAlert(threshold, currentValue) {
  const message = `Alert! The value has exceeded the threshold. Current value: ${currentValue}. Threshold: ${threshold}`;
  await sendSlackAlert(message, '#threshold-alerts', 'Threshold Alert Bot');
}
