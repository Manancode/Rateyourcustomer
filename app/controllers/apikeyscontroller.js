import prisma from '../utils/prismaClient.js';
import { NextResponse } from 'next/server.js';

export async function getApiKeys(req) {
  try {
    // had to solve this issue later
    const subscription = await prisma.subscription.findFirst();

    if (!subscription) {
      return NextResponse.json({ message: 'Subscription not found' }, { status: 404 });
    }

    const apiKey = subscription.apikey;
    const createdAt = subscription.createdAt.toISOString();
    const lastUsed = subscription.updatedAt.toISOString();

    return NextResponse.json({
      name: 'Secret key',
      token: apiKey,
      lastUsed: lastUsed,
      created: createdAt,
    });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
