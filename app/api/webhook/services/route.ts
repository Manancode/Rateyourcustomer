import { NextRequest, NextResponse } from 'next/server';
import { WebhookService } from '../webhookservices';

export async function POST(req: NextRequest) {
  const { url, events, companyId } = await req.json();
  try {
    const webhook = await WebhookService.registerWebhook(url, events, companyId);
    return NextResponse.json(webhook, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to register webhook' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const companyId = searchParams.get('companyId');
  const id = searchParams.get('id');

  try {
    if (id) {
      const webhook = await WebhookService.getWebhookById(id);
      return NextResponse.json(webhook, { status: 200 });
    } else if (companyId) {
      const webhooks = await WebhookService.getWebhooks(companyId);
      return NextResponse.json(webhooks, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch webhook(s)' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { id, url, events } = await req.json();
  try {
    const updatedWebhook = await WebhookService.updateWebhook(id, url, events);
    return NextResponse.json(updatedWebhook, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update webhook' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  try {
    await WebhookService.deleteWebhook(id);
    return NextResponse.json({ message: 'Webhook deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete webhook' }, { status: 500 });
  }
}
