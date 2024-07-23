import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient()

// Function to check API key
async function checkApiKey(apiKey: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { apikey: apiKey },
    // include: { company: true },
  });
  return subscription;
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { url, events, companyId } = req.body;
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }

  const subscription = await checkApiKey(apiKey as string);

  if (!subscription || subscription.status !== 'active' || subscription.companyId !== companyId) {
    return res.status(403).json({ error: 'Invalid or inactive subscription' });
  }

  try {
    const webhook = await prisma.webhook.create({
      data: { url, events, companyId }
    });
    return res.status(201).json(webhook);
  } catch (error) {
    console.error('Failed to create webhook:', error);
    return res.status(500).json({ error: 'Failed to create webhook' });
  }
}

// Main handler to switch between HTTP methods
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return POST(req, res);
    default:
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
