
import { NextResponse } from 'next/server';
import { createCustomers , getCustomers } from '@/app/controllers/customercontroller';
import { authenticate } from '@/app/middleware/authenticate';


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
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await runMiddleware(req, null, authenticate);
    const response = await createCustomers(req, null);
    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create customers' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({ methods: ['GET', 'POST'] });
}