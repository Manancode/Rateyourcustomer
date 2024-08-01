import { NextResponse } from 'next/server';
import { WebhookService } from '../webhookservice';

export async function POST(request: Request) {
  try {
    const { url, events, companyId } = await request.json();
    
    const webhook = await WebhookService.registerWebhook(url, events, companyId);
    
    return NextResponse.json({ message: 'Webhook registered successfully', webhook });
  } catch (error) {
    console.error('Error registering webhook:', error);
    return NextResponse.json({ error: 'Failed to register webhook' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { companyId, event, data } = await request.json();
    
    await WebhookService.triggerWebhook(companyId, event, data);
    
    return NextResponse.json({ message: 'Webhook triggered successfully' });
  } catch (error) {
    console.error('Error triggering webhook:', error);
    return NextResponse.json({ error: 'Failed to trigger webhook' }, { status: 500 });
  }
}