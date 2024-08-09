import axios from 'axios';
import prisma from "../utils/prismaClient.js";

// Function to test URL if it really exists
async function testUrl(url) {
  try {
    const response = await axios.get(url, { timeout: 5000 });
    return response.status >= 200 && response.status < 300;
  } catch (error) {
    return false;
  }
}

export async function createWebhook(req, res) {
  try {
    const { url, events } = req.body;

    // Validate URL
    const isValidUrl = await testUrl(url);
    if (!isValidUrl) {
      return res.status(400).json({ error: 'Invalid or unreachable URL' });
    }

    // Check if the webhook already exists
    const webhookexists = await prisma.webhook.findUnique({
      where: { url },
    });

    if (webhookexists) {
      if (webhookexists.companyId !== req.user.companyId) {
        return res.status(403).json({ error: 'Webhook does not belong to the authenticated user' });
      }
      return res.status(400).json({ error: 'Webhook URL already exists' });
    }

    // Create webhook entry
    const webhook = await prisma.webhook.create({
      data: {
        url,
        events,
        companyId: req.user.companyId,
      },
    });

    return res.status(201).json({
      message: 'Webhook registered successfully',
      webhook: {
        id: webhook.id,
        url: webhook.url,
        events: webhook.events,
        companyId: webhook.companyId,
      },
    });
  } catch (error) {
    console.error('Failed to register webhook:', error);
    return res.status(500).json({ error: 'Failed to register webhook' });
  }
}


export async function getWebhooks(req, res) {
  try {
    // Retrieve all webhooks for the company of the authenticated user
    const webhooks = await prisma.webhook.findMany({
      where: {
        companyId: req.user.companyId,
      },
      select: {
        id: true,
        url: true,
        events: true,
        companyId: true,
      },p
    });

    // Check if any webhooks are found
    if (webhooks.length === 0) {
      return res.status(404).json({ message: 'No webhooks found for this company.' });
    }

    return res.status(200).json({ webhooks });
  } catch (error) {
    console.error('Failed to retrieve webhooks:', error);
    return res.status(500).json({ error: 'Failed to retrieve webhooks' });
  }
}