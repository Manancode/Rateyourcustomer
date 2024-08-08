import { getApiKeys } from '@/app/controllers/apikeyscontroller';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const response = await getApiKeys(req);
    return response; 
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({ methods: ['GET'] });
}
