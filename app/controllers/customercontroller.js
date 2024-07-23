
import prisma from '../utils/prismaClient.js';

export async function getCustomers(req, res) {
  try {
    const customers = await prisma.customer.findMany({
      where: { userid: req.user.id },
    });

    // Triggering webhook for customers accessed
    await WebhookService.triggerWebhook(
      req.user.companyId, 
      WEBHOOK_EVENTS.CUSTOMERS_ACCESSED,
      {
        userId: req.user.id,
        timestamp: new Date().toISOString(),      
        customerCount: customers.length
      }
    );

    res.status(200).json(customers);
  } catch (error) {
    console.error('Failed to fetch customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
}





export async function createCustomers(req, res) {
  try {
    const { name, email } = req.body;
    const authenticatedUserId = req.user.id;

  
    const existingCustomer = await prisma.customer.findUnique({
      where: { email },
    });

    if (existingCustomer) {
      return res.status(400).json({ error: 'Customer with this email already exists' });
    }
    
   
    const newCustomer = await prisma.customer.create({
      data: {
        name,
        email,
        userid: authenticatedUserId,
      },
    });

    // Triggering  webhook for customer created
    await WebhookService.triggerWebhook(
      req.user.companyId, 
      WEBHOOK_EVENTS.CUSTOMER_CREATED,
      newCustomer
    );
    
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Failed to create customer:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
}