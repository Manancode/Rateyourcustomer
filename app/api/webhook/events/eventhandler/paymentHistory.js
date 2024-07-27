import prisma from "../../../../utils/prismaClient.js";
import { dispatchEvent } from "../../utils/eventDispatcher.js";

export async function payment_received(payload, userId) {
  const { customerId, amount, paymentDate } = payload;
  await prisma.paymentHistory.create({
    data: {
      customerId,
      totalAmount: amount,
      paymentDates: [paymentDate],
      timelyPayments: 1,
      userId
    },
  });
  await dispatchEvent('payment_received', payload);
}

export async function payment_missed(payload, userId) {
  const { customerId, missedDate } = payload;
  await prisma.paymentHistory.update({
    where: { customerId },
    data: {
      latePayments: { increment: 1 },
      paymentDates: { push: missedDate },
    },
  });
  await dispatchEvent('payment_missed', payload);
}

export async function payment_terms_changed(payload, userId) {
  const { customerId, newTerms } = payload;
  // Implement logic for payment terms change
  await dispatchEvent('payment_terms_changed', payload);
}

export async function payment_overdue(payload, userId) {
  const { customerId, overdueDate } = payload;
  await prisma.paymentHistory.update({
    where: { customerId },
    data: {
      overduePayments: { increment: 1 },
      paymentDates: { push: overdueDate },
    },
  });
  await dispatchEvent('payment_overdue', payload);
}

export async function payment_plan_created(payload, userId) {
  const { customerId, planDetails } = payload;
  await prisma.paymentPlan.upsert({
    where: { customerId },
    update: { planDetails },
    create: { customerId, planDetails, userId },
  });
  await dispatchEvent('payment_plan_created', payload);
}
