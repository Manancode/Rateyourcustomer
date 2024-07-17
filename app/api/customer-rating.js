import prisma from '../utils/prismaClient.js';
import { authenticate } from '../../middlewares/authenticate,js';
console.log("reached here")

export default async function handler(req, res) {
  const authMiddleware = (req, res, next) => {
    authenticate(req, res, next);
  };

  const runMiddleware = (req, res, fn) => {
    return new Promise((resolve, reject) => {
      fn(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
  };

  await runMiddleware(req, res, authMiddleware);

  switch (req.method) {
    case 'GET':
      await getRatings(req, res);
      break;
    case 'POST':
      await createRating(req, res);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getRatings(req, res) {
  try {
    const ratings = await prisma.rating.findMany({
      where: { userId: req.user.id },
    });
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
}

async function createRating(req, res) {
  try {
    const { rating, customerId } = req.body;
    const newRating = await prisma.rating.create({
      data: {
        rating,
        customerId,
        userId: req.user.id,
      },
    });
    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create rating' });
  }
}
