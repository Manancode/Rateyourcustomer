import prisma from '../utils/prismaClient.js';

export async function getCustomers(req, res) {
  try {
    // Fetching ratings for the authenticated user
    const customer = await prisma.customer.findMany({
      where: { userid: req.user.id },
    });
    res.status(200).json(customer);
  } catch (error) {
    console.error('Failed to fetch customer:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
}


export async function createCustomers(req, res) {
  try {
    const { name, email } = req.body;
    const authenticatedUserId = req.user.id;

    // Check if a customer with the same email already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { email },
    });

    if (existingCustomer) {
      return res.status(400).json({ error: 'Customer with this email already exists' });
    }
    
    // Create the new customer
    const newCustomer = await prisma.customer.create({
      data: {
        name,
        email,
        userid: authenticatedUserId,
      },
    });
    
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Failed to create customer:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
}
