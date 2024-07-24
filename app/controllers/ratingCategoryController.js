import prisma from '../utils/prismaClient.js';

// Function to create default rating categories
export async function createDefaultRatingCategories(req, res) {
  const companyId = req.user.companyId;
  const categories = [
    { name: 'Payment History', weightage: 0.2 },
    { name: 'Average Order Value', weightage: 0.15 },
    { name: 'Lifetime Value', weightage: 0.2 },
    { name: 'Purchase Frequency', weightage: 0.1 },
    { name: 'Support Tickets', weightage: 0.1 },
    { name: 'Feedback Scores', weightage: 0.1 },
    { name: 'Return Rate', weightage: 0.05 },
    { name: 'Referral Rate', weightage: 0.05 },
    { name: 'Contract Length', weightage: 0.025 },
    { name: 'Renewal Rate', weightage: 0.025 },
  ];

  try {
    for (const category of categories) {
      await prisma.ratingCategory.create({
        data: {
          name: category.name,
          weightage: category.weightage,
          companyId: companyId,
        },
      });
    }
    return res.status(201).json({ message: 'Rating categories created' });
  } catch (error) {
    console.error('Error creating rating categories:', error);
    return res.status(500).json({ error: 'Failed to create rating categories' });
  }
}

// Function to update rating category weightage
export async function updateRatingCategoryWeightage(req, res) {
  const { categoryId, weightage } = req.body;
  const companyId = req.user.companyId;

  try {
    const category = await prisma.ratingCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category || category.companyId !== companyId) {
      return res.status(403).json({ error: 'Rating category not found or unauthorized' });
    }

    await prisma.ratingCategory.update({
      where: { id: categoryId },
      data: { weightage },
    });

    return res.status(200).json({ message: 'Rating category weightage updated' });
  } catch (error) {
    console.error('Error updating rating category weightage:', error);
    return res.status(500).json({ error: 'Failed to update rating category weightage' });
  }
}
