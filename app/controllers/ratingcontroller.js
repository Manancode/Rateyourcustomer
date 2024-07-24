import prisma from '../utils/prismaClient.js';

// Fetch ratings for the authenticated user
export async function getRatings(req, res) {
  try {
    const ratings = await prisma.rating.findMany({
      where: { userid: req.user.id },
    });
    res.status(200).json(ratings);
  } catch (error) {
    console.error('Failed to fetch ratings:', error);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
}

// Create a rating without calculating the overall rating
export async function createRating(req, res) {
  try {
    const { customerId, ratings } = req.body; // Ratings should be an array of { categoryId, score }
    const authenticatedUserId = req.user.id;

    // Checking if the customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    if (customer.userid !== authenticatedUserId) {
      return res.status(403).json({ error: 'Customer does not belong to the authenticated user' });
    }

    // Fetch rating categories and their weightages for the authenticated user's company
    const ratingCategories = await prisma.ratingCategory.findMany({
      where: { companyId: customer.companyId },
    });

    if (!ratingCategories || ratingCategories.length === 0) {
      return res.status(400).json({ error: 'No rating categories found for the company' });
    }

    // Create individual ratings
    for (const rating of ratings) {
      const category = ratingCategories.find(cat => cat.id === rating.categoryId);

      if (!category) {
        return res.status(400).json({ error: `Invalid rating category ID: ${rating.categoryId}` });
      }

      await prisma.rating.create({
        data: {
          score: rating.score,
          categoryId: category.id,
          customerId,
          userid: authenticatedUserId,
        },
      });
    }

    res.status(201).json({ message: 'Ratings created successfully' });
  } catch (error) {
    console.error('Failed to create rating:', error);
    res.status(500).json({ error: 'Failed to create rating' });
  }
}
