import prisma from '@/app/utils/prismaClient';
import { sendWebhook } from './utils/sendwebhook';

// WebhookService class definition
export class WebhookService {
  static async registerWebhook(url: string, events: string[], companyId: string) {
    return prisma.webhook.create({
      data: { url, events, companyId }
    });
  }

  static async triggerWebhook(companyId: string, event: string, data: any) {
    await sendWebhook(companyId, event, data);
  }
}
