import { NextResponse } from 'next/server';
import { createCustomers, getCustomers } from '@/app/controllers/customercontroller';
import { authenticate } from '@/app/middleware/authenticate';
import { WebhookService } from '../webhook/webhookservices';
import { WEBHOOK_EVENTS } from '../webhook/constants';

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

export async function GET(req) {
  try {
    await runMiddleware(req, null, authenticate);
    const response = await getCustomers(req, null);
    const companyId = req.headers.get('company-id');
    if (companyId) {
      await WebhookService.triggerWebhook(
        companyId,
        WEBHOOK_EVENTS.CUSTOMERS_ACCESSED,
        { timestamp: new Date().toISOString() }
      );
    }
    
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await runMiddleware(req, null, authenticate);
    const response = await createCustomers(req, null);
  
    if (response.success && response.customer) {
      await WebhookService.triggerWebhook(
        response.customer.companyId,
        WEBHOOK_EVENTS.CUSTOMER_CREATED,
        response.customer
      );
    }
    
    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create customers' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({ methods: ['GET', 'POST'] });
}
