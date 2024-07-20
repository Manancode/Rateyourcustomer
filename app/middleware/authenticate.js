import prisma from '../utils/prismaClient.js';

export async function authenticate(req, res, next) {
  const Apikey = req.headers['x-api-key'];
  if (!Apikey ) {
    return res.status(401).json({ error: 'API key is missing' });
  }

  try {
    const subscription = await prisma.subscription.findUnique({
      where: { apikey: Apikey },
      include: { user: true } 
    });

    if (!subscription) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    req.user = subscription.user;
    next();
  } catch (error) {
    
    return res.status(500).json({ error: 'Internal server error' });
  }
}
