import { validatePayload } from './eventValidator.js';
import { processEvent } from './eventProcessor.js';

export async function handleWebhookEvent(req, res) {
  const { event, payload } = req.body;
  const userId = req.user?.id;

  try {
    const missingFields = validatePayload(event, payload);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    await processEvent(event, payload, userId);
    res.status(200).json({ message: 'Event processed successfully' });
  } catch (error) {
    console.error('Error processing event:', error);
    res.status(500).json({ error: error.message || 'Failed to process event' });
  }
}