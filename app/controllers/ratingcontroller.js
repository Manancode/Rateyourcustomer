import prisma from '../utils/prismaClient.js';

// Fetch customer ratings
export async function getRatings(req, res) {
  try {
    const ratings = await prisma.rating.findMany({
      where: { userid: req.user.id },
    });
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
}

// Create a new rating
export async function createRating(req, res) {
  try {
    const { rating, customerId } = req.body;
    const newRating = await prisma.rating.create({
      data: {
        rating,
        customerId,
        userid: req.user.id,
      },
    });
    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create rating' });
  }
}
