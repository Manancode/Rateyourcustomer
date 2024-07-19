import prisma from '../utils/prismaClient.js';

export async function authenticate(req, res, next) {
  const Apikey = req.headers['x-api-key'];
  
  // Checking if API key is provided
  if (!Apikey) {
    return res.status(401).json({ error: 'API key is missing' });
  }

  try {
    // Finding subscription by API key and include related user
    const subscription = await prisma.subscription.findUnique({
      where: { apikey: Apikey },
      include: { user: true }
    });

    // If no subscription is found, responding with invalid API key
    if (!subscription) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    // Attaching user to request object
    req.user = subscription.user;
    next();
  } catch (error) {
    console.error('Authentication error:', error); // Log error for debugging
    return res.status(500).json({ error: 'Internal server error' });
  }
}

