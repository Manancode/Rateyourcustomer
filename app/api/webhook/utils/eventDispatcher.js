import axios from 'axios';
import prisma from '../../../utils/prismaClient.js';


export async function dispatchEvent(eventType, payload) {
  try {
    const webhooks = await prisma.webhook.findMany({
      where: {
        events: {
          has: eventType,
        },
      },
    });

    for (const webhook of webhooks) {
      try {
        await axios.post(webhook.url, {
          event: eventType,
          payload,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error(`Failed to dispatch event to ${webhook.url}:`, error);
        
      }
    }
  } catch (error) {
    console.error('Failed to retrieve webhooks:', error);
  }
}
