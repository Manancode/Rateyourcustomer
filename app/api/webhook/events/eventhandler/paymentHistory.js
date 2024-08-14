import prisma from "../../../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";

export async function payment_received(payload) {
  try {
    const { customerId, amount, paymentDate } = payload;

    if (!customerId || !amount || !paymentDate) {
      throw new Error('Missing required fields: customerId, amount, or paymentDate');
    }

    const parsedCustomerId = parseInt(customerId);
    const parsedAmount = parseFloat(amount);
    const parsedPaymentDate = new Date(paymentDate);

    if (isNaN(parsedCustomerId) || isNaN(parsedAmount) || isNaN(parsedPaymentDate.getTime())) {
      throw new Error('Invalid customerId, amount, or paymentDate format');
    }

    // First, try to find an existing PaymentHistory
    let paymentHistory = await prisma.paymentHistory.findFirst({
      where: {
        customerId: parsedCustomerId,
      },
    });

    if (paymentHistory) {
      // If found, update the existing record
      paymentHistory = await prisma.paymentHistory.update({
        where: {
          id: paymentHistory.id,
        },
        data: {
          totalAmount: {
            increment: parsedAmount
          },
          timelyPayments: {
            increment: 1
          },
          paymentDates: {
            push: parsedPaymentDate
          }
        },
      });
    } else {
      // If not found, create a new record
      paymentHistory = await prisma.paymentHistory.create({
        data: {
          customerId: parsedCustomerId,
          totalAmount: parsedAmount,
          timelyPayments: 1,
          latePayments: 0,
          paymentDates: [parsedPaymentDate]
        },
      });
    }

    // Check if the customer has a good payment history
    if (paymentHistory.timelyPayments > 5 && paymentHistory.latePayments === 0) {
      // Suggest upsell opportunity if payments are consistently timely
      await suggestUpsellOpportunity(parsedCustomerId);
    }

    return paymentHistory;
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
}

async function suggestUpsellOpportunity(customerId) {
  // Logic to suggest an upsell opportunity
  await prisma.upsellOpportunity.create({
    data: {
      customerId,
      status: 'created',
      createdAt: new Date(),
    },
  });
}

export async function payment_missed(payload, userId) {
  const { customerId, missedDate } = payload;

  // Update PaymentHistory for the customer
  const paymentHistory = await prisma.paymentHistory.update({
    where: { customerId },
    data: {
      latePayments: { increment: 1 },
      paymentDates: { push: missedDate },
    },
  });

  // Trigger a risk alert if too many payments are missed
  if (paymentHistory.latePayments > 3) {
    await triggerRiskAlert(customerId);
  }

  await dispatchEvent('PAYMENT_MISSED', payload);
}

async function triggerRiskAlert(customerId) {
  // Logic to trigger a risk alert for the account
  await prisma.accountHealth.update({
    where: { customerId },
    data: {
      status: 'At Risk',
      details: { set: { reason: 'Multiple missed payments' } },
      createdAt: new Date(),
    },
  });
}

export async function payment_terms_changed(payload, userId) {
  const { customerId, newTerms, updatedDate } = payload;

  // Update PaymentHistory with the new payment terms
  await prisma.paymentHistory.update({
    where: { customerId },
    data: {
      paymentTerms: newTerms,
      updatedAt: updatedDate,
    },
  });

  // Suggest a customer satisfaction review if terms are changed frequently
  const recentTermChanges = await prisma.paymentHistory.count({
    where: {
      customerId,
      updatedAt: { gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) },
    },
  });

  if (recentTermChanges > 2) {
    await suggestCustomerReview(customerId);
  }

  await dispatchEvent('PAYMENT_TERMS_CHANGED', payload);
}

async function suggestCustomerReview(customerId) {
  // Logic to suggest a review of the customer's satisfaction
  await prisma.customerSuccess.create({
    data: {
      customerId,
      successScore: 5, // Assuming a review score out of 10
      milestone: 'Review suggested due to frequent term changes',
      createdAt: new Date(),
    },
  });
}

