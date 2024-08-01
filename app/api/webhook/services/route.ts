// Import necessary dependencies
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/utils/prismaClient';
import { sendWebhook } from '../utils/sendwebhook';

// WebhookService class definition
class WebhookService {
  static async registerWebhook(url: string, events: string[], companyId: string) {
    return prisma.webhook.create({
      data: { url, events, companyId }
    });
  }

  static async triggerWebhook(companyId: string, event: string, data: any) {
    await sendWebhook(companyId, event, data);
  }
}

// Handler function for the API route
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  switch (method) {
    case 'POST':
      // Example usage of registerWebhook (adjust based on your actual requirements)
      const { url, events, companyId } = req.body;
      try {
        const webhook = await WebhookService.registerWebhook(url, events, companyId);
        res.status(201).json(webhook);
      } catch (error) {
        res.status(500).json({ error: 'Failed to register webhook' });
      }
      break;

    case 'GET':
      // Example usage of triggerWebhook (adjust based on your actual requirements)
      const { companyId: cid, event, data } = req.query;
      try {
        await WebhookService.triggerWebhook(cid as string, event as string, data);
        res.status(200).json({ message: 'Webhook triggered' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to trigger webhook' });
      }
      break;

    default:
      res.setHeader('Allow', ['POST', 'GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

// Export the handler function and WebhookService class
export default handler;
export { WebhookService };
