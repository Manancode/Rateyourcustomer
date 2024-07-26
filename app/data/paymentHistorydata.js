import prisma from '../utils/prismaClient.js';
import { normalizeData } from '../utils/normalizationUtils.js';

// Helper function to aggregate payment history data
function aggregatePaymentHistoryData(data) {
    if (!data || !Array.isArray(data)) {
        console.error('Invalid data passed to aggregatePaymentHistoryData:', data);
        throw new TypeError('Expected an array of payment history data');
    }

    const totalAmount = data.reduce((sum, entry) => sum + entry.totalAmount, 0);
    const latePayments = data.reduce((sum, entry) => sum + entry.latePayments, 0);

    return [totalAmount, latePayments];
}

// Function to retrieve the category ID for a given customer or company
async function getCategoryID(companyId, categoryName) {
    const category = await prisma.ratingCategory.findFirst({
        where: {
            companyId: companyId,
            name: categoryName
        }
    });
    return category ? category.id : null;
}

// Function to get or create the current rating period
async function getOrCreateCurrentPeriod() {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Start of current month
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // End of current month

    let period = await prisma.ratingPeriod.findFirst({
        where: {
            startDate: startDate,
            endDate: endDate
        }
    });

    if (!period) {
        period = await prisma.ratingPeriod.create({
            data: {
                startDate: startDate,
                endDate: endDate
            }
        });
    }

    return period.id;
}

// Function to process payment history and assign ratings
async function processPaymentHistory(customerId) {
    try {
        const paymentHistory = await prisma.paymentHistory.findMany({
            where: { customerId: customerId }
        });

        if (!paymentHistory || !Array.isArray(paymentHistory) || paymentHistory.length === 0) {
            console.error('No payment history found for customer ID:', customerId);
            return;
        }

        console.log('Payment History:', paymentHistory);

        const aggregatedData = aggregatePaymentHistoryData(paymentHistory);
        console.log('Aggregated Data:', aggregatedData);

        const normalizedScores = await normalizeData(aggregatedData);
        console.log('Normalized Scores:', normalizedScores);

        const customer = await prisma.customer.findUnique({
            where: { id: customerId }
        });

        if (!customer) {
            console.error('Customer not found for ID:', customerId);
            return;
        }

        const companyId = customer.companyId;
        const userId = customer.userid;

        const categoryId = await getCategoryID(companyId, 'Payment History');

        if (!categoryId) {
            console.error('No category ID found for payment history');
            return;
        }

        const periodId = await getOrCreateCurrentPeriod();

        await prisma.rating.create({
            data: {
                value: normalizedScores[0],
                category: {
                    connect: { id: categoryId }
                },
                period: {
                    connect: { id: periodId }
                },
                user: {
                    connect: { id: userId }
                },
                customer: {
                    connect: { id: customerId }
                }
            }
        });
        

        console.log('Rating saved successfully for customer ID:', customerId);
    } catch (error) {
        console.error('Error processing payment history:', error);
    }
}

// Main function to run the script
async function main() {
    const customerId = 1; // Example customer ID
    await processPaymentHistory(customerId);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
