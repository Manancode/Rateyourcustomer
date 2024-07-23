import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient()

// Function to check API key
async function checkApiKey(apikey: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { apikey: apikey },
    include: { user: true },
  });
  return subscription;
}

export async function POST(req: NextRequest) {
  const { url, events, companyId } = await req.json();
  const apikey = req.headers.get('x-api-key');

  if (!apikey) {
    return NextResponse.json({ error: 'API key required' }, { status: 401 });
  }

  const subscription = await checkApiKey(apikey);

  if (!subscription || subscription.status !== 'active') {
    return NextResponse.json({ error: 'Invalid or inactive subscription' }, { status: 403 });
  }

  // Checking if the user associated with the subscription belongs to the specified company
  if (subscription.user.companyId !== companyId) {
    return NextResponse.json({ error: 'Subscription not associated with the specified company' }, { status: 403 });
  }

  try {
    const webhook = await prisma.webhook.create({
      data: { url, events, companyId }
    });
    return NextResponse.json(webhook, { status: 201 });
  } catch (error) {
    console.error('Failed to create webhook:', error);
    return NextResponse.json({ error: 'Failed to create webhook' }, { status: 500 });
  }
}