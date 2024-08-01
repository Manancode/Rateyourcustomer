import prisma from '@/app/utils/prismaClient';
import { sendWebhook } from './utils/sendwebhook';

export class WebhookService {
  static async registerWebhook(url: string, events: string[], companyId: string) {
    return prisma.webhook.create({
      data: { url, events, companyId }
    });
  }

  static async triggerWebhook(companyId: string, event: string, data: any) {
    await sendWebhook(companyId, event, data);
  }

  static async updateWebhook(id: string, url: string, events: string[]) {
    return prisma.webhook.update({
      where: { id },
      data: { url, events }
    });
  }

  static async deleteWebhook(id: string) {
    return prisma.webhook.delete({
      where: { id }
    });
  }

  static async getWebhooks(companyId: string) {
    return prisma.webhook.findMany({
      where: { companyId }
    });
  }

  static async getWebhookById(id: string) {
    return prisma.webhook.findUnique({
      where: { id }
    });
  }
}
