import prisma from '../utils/prismaClient.js';
import jwt from 'jsonwebtoken';
import NodeCache from 'node-cache';

// Initialize NodeCache with a TTL of 300 seconds (5 minutes)
const cache = new NodeCache({ stdTTL: 300 });

export async function authenticate(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  const authHeader = req.headers['authorization'];

  if (!apiKey && !authHeader) {
    return res.status(401).json({ error: 'Authentication credentials are missing' });
  }

  try {
    let user;

    if (apiKey) {
      // API Key authentication
      const subscription = await prisma.subscription.findUnique({
        where: { apikey: apiKey },
        include: { user: true }
      });

      if (!subscription) {
        return res.status(401).json({ error: 'Invalid API key' });
      }

      user = subscription.user;
    } else if (authHeader) {
      // JWT authentication
      const token = authHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Invalid authorization header format' });
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await prisma.user.findUnique({
          where: { id: decoded.userId }
        });

        if (!user) {
          return res.status(401).json({ error: 'User not found' });
        }
      } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }
    }

    req.user = user;
    req.companyId = user.companyId;

    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(500).json({ error: 'Internal server error during authentication' });
  }
}

// Cache middleware to cache responses
export function cacheMiddleware(req, res, next) {
  const key = req.originalUrl;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    console.log(`Cache hit for ${key}`);
    return res.send(cachedResponse);
  } else {
    res.sendResponse = res.send;
    res.send = (body) => {
      cache.set(key, body);
      res.sendResponse(body);
    };
    console.log(`Cache miss for ${key}`);
    next();
  }
}
