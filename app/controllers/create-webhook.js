import axios from 'axios';
import prisma from "../utils/prismaClient.js";


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

    
    const webhookexists = await prisma.webhook.findUnique({
      where: { url },
    });

    if (webhookexists) {
      if (webhookexists.companyId !== req.user.companyId) {
        return res.status(403).json({ error: 'Webhook does not belong to the authenticated user' });
      }
      return res.status(400).json({ error: 'Webhook URL already exists' });
    }

    
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
    
    if (!req.companyId) {
      return res.status(400).json({ error: 'Company ID is missing' });
    }

    const webhooks = await prisma.webhook.findMany({
      where: {                                
        companyId: req.companyId,
      },
      select : {
        id: true,
        url: true,
        events: true,
        companyId: true,
      }
    });

    if (webhooks.length === 0) {
      return res.status(404).json({ message: 'No webhooks found for this company.' });
    }

    return res.status(200).json({ webhooks });
  } catch (error) {
    console.error('Failed to retrieve webhooks:', error.message);
    return res.status(500).json({ error: 'Failed to retrieve webhooks' });
  }
}

export async function deleteWebhook(req, res){
  const { id } = req.params;
  const { companyId } = req.user;
  res.companyId

  try {
    // CheckING  if the webhook exists and belongs to the company
    const webhook = await prisma.webhook.findFirst({
      where: {
        id: id,
        companyId: companyId
      }
    });

    if (!webhook) {
      return res.status(404).json({ error: 'Webhook not found or does not belong to this company' });
    }

    // Delete the webhook
    await prisma.webhook.delete({
      where: { id: id }
    });

    res.status(200).json({ message: 'Webhook deleted successfully' });
  } catch (error) {
    console.error('Error deleting webhook:', error);
    res.status(500).json({ error: 'An error occurred while deleting the webhook' });
  }
};

