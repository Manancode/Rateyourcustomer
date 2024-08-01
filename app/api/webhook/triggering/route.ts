import { NextResponse } from 'next/server';
import { WebhookService } from '../webhookservices';


export async function POST(req: Request) {
  const { companyId, event, data } = await req.json();
  try {
    await WebhookService.triggerWebhook(companyId, event, data);
    return NextResponse.json({ message: 'Webhook triggered successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to trigger webhook' }, { status: 500 });
  }
}