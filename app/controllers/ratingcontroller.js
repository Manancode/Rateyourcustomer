import prisma from '../utils/prismaClient.js';

export async function getRatings(req, res) {
  try {
    // Fetching ratings for the authenticated user
    const ratings = await prisma.rating.findMany({
      where: { userid: req.user.id },
    });
    res.status(200).json(ratings);
  } catch (error) {
    console.error('Failed to fetch ratings:', error);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
}


export async function createRating(req, res) {
  try {
    const { customerId, categoryA, categoryB } = req.body;
    const authenticatedUserId = req.user.id;

    // Checking if the customer exists and belongs to the authenticated user
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer || customer.userId !== authenticatedUserId) {
      return res.status(400).json({ error: 'Customer not found or does not belong to the authenticated user' });
    }

    // Creating the rating
    const newRating = await prisma.rating.create({
      data: {
        categoryA,
        categoryB,
        customerId,
        userid: authenticatedUserId,
      },
    });
    
    res.status(201).json(newRating);
  } catch (error) {
    console.error('Failed to create rating:', error);
    res.status(500).json({ error: 'Failed to create rating' });
  }
}