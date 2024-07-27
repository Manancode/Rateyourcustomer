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
