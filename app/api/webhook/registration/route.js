import { NextRequest, NextResponse } from 'next/server';

import { authenticate } from '@/app/middleware/authenticate';
import { createWebhook } from '@/app/controllers/webhookcontroller';

async function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export async function POST(req) {
  try {
    await runMiddleware(req, null, authenticate);
    const response = await createWebhook(req);
    if (response.error) {
      return NextResponse.json(response, { status: 400 });
    }
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register webhook' }, { status: 500 });
  }
}
