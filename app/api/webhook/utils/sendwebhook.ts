import prisma from '@/app/utils/prismaClient';
import axios from 'axios';


export async function sendWebhook(companyId: string, event: string, data: any) {
  const webhooks = await prisma.webhook.findMany({
    where: { companyId, events: { has: event } }
  });
  
  const promises = webhooks.map(webhook => 
    axios.post(webhook.url, { event, data })
      .catch(error => console.error(`Failed to send webhook to ${webhook.url}`, error))
  );

  await Promise.all(promises);
}