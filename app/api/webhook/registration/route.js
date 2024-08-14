import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/app/middleware/authenticate';
import { createWebhook, getWebhooks } from '@/app/controllers/create-webhook';

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

export async function GET(req) {
  try {
    await runMiddleware(req, null, authenticate);
    const response = await getWebhooks(req);
    if (response.error) {
      return NextResponse.json(response, { status: 400 });
    }
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to retrieve webhooks' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await runMiddleware(req, null, authenticate);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Webhook ID is required' }, { status: 400 });
    }
    const response = await deleteWebhook(req, id);
    if (response.error) {
      return NextResponse.json(response, { status: 400 });
    }
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete webhook' }, { status: 500 });
  }
}

