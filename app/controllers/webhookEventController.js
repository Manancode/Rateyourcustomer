import prisma from "../utils/prismaClient.js";
import { dispatchEvent } from "../api/webhook/utils/eventDispatcher.js";

// Validation function
function validatePayload(eventType, payload) {
 const requiredFields = {
  'resource_downloaded': ['resourceId', 'customerId', 'downloadDate', 'userId'],
  'support_article_viewed': ['articleId', 'customerId', 'viewedDate', 'userId'],
  'payment_received': ['paymentId', 'customerId', 'paymentDate', 'amount', 'paymentMethod'],
  'payment_missed': ['paymentId', 'customerId', 'missedDate', 'amount'],
  'payment_terms_changed': ['subscriptionId', 'customerId', 'changeDate', 'newTerms'],
  'order_placed': ['orderId', 'customerId', 'orderDate', 'amount'],
  'order_updated': ['orderId', 'customerId', 'updateDate', 'updatedFields'],
  'order_cancelled': ['orderId', 'customerId', 'cancellationDate'],
  'customer_revenue_update': ['customerId', 'updateDate', 'newRevenue'],
  'purchase_frequency': ['customerId', 'frequencyDate', 'frequency'],
  'ticket_opened': ['ticketId', 'customerId', 'openDate', 'issueDescription'],
  'ticket_closed': ['ticketId', 'customerId', 'closeDate', 'resolution'],
  'ticket_escalated': ['ticketId', 'customerId', 'escalationDate', 'reason'],
  'feedback_submitted': ['feedbackId', 'customerId', 'submissionDate', 'rating', 'comments'],
  'nps_score_updated': ['customerId', 'updateDate', 'newNpsScore'],
  'return_requested': ['returnId', 'customerId', 'requestDate', 'reason'],
  'return_processed': ['returnId', 'customerId', 'processDate', 'status'],
  'referral_made': ['referralId', 'referrerId', 'referralDate', 'referredCustomerId'],
  'referral_converted': ['referralId', 'referredCustomerId', 'conversionDate'],
  'contract_signed': ['contractId', 'customerId', 'signDate', 'contractTerms'],
  'contract_extended': ['contractId', 'customerId', 'extensionDate', 'newEndDate'],
  'contract_terminated': ['contractId', 'customerId', 'terminationDate'],
  'contract_renewed': ['contractId', 'customerId', 'renewalDate', 'renewalTerms'],
  'renewal_opportunity_created': ['opportunityId', 'customerId', 'creationDate', 'details'],
  'feature_activated': ['featureId', 'customerId', 'activationDate'],
  'usage_milestone_reached': ['milestoneId', 'customerId', 'milestoneDate', 'details'],
  'user_onboarded': ['userId', 'onboardDate', 'userDetails'],
  'upsell_opportunity_created': ['opportunityId', 'customerId', 'creationDate', 'details'],
  'cross_sell_successful': ['saleId', 'customerId', 'saleDate', 'details'],
  'webinar_attended': ['webinarId', 'customerId', 'attendanceDate'],
  'compilance_check_passed': ['checkId', 'customerId', 'checkDate', 'status'],
  'risk_assessment_updated': ['assessmentId', 'customerId', 'updateDate', 'newRiskLevel'],
  'customer_created': ['customerId', 'creationDate', 'customerDetails'],
  'customer_updated': ['customerId', 'updateDate', 'updatedFields'],
  'customer_merged': ['originalCustomerId', 'mergedCustomerId', 'mergeDate'],
  'customer_segment_changed': ['customerId', 'changeDate', 'newSegment'],
};


  const missingFields = requiredFields[eventType].filter(field => !payload[field]);
  return missingFields;
}

async function processEvent(eventType, payload) {
  // Validate the payload
  const missingFields = validatePayload(eventType, payload);
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }






// Payment History //had to update
async function processPaymentReceived(payload) {
    const { customerId, amount, paymentDate } = payload;
    await prisma.paymentHistory.create({
      data: {
        customerId,
        totalAmount: amount,
        paymentDates: [paymentDate], // Adjust according to how you store dates
        timelyPayments: 1, // Increment or set based on existing records
        userid: req.user.id
      },
    })

    await dispatchEvent('payment_received' , payload)
  }
  
  async function processPaymentMissed(payload) {
    const { customerId, missedDate } = payload;
    await prisma.paymentHistory.update({
      where: { customerId },
      data: {
        latePayments: {
          increment: 1
        },
        paymentDates: {
          push: missedDate // Adjust according to how you store dates
        },
      },
    })
    await dispatchEvent('payment_missed' , payload)
  }
  
  async function processPaymentTermsChanged(payload) {
    const { customerId, newTerms } = payload;
    // Adjust based on how payment terms are stored

    await dispatchEvent('payment_terms_changed' , payload)
  }
  

// Average Order Value
async function processOrderPlaced(payload) {
    const { orderId, customerId, orderValue, orderDate } = payload;
    await prisma.averageOrderValue.upsert({
      where: { customerId },
      update: {
        totalAmount: {
          increment: orderValue
        },
        orderCount: {
          increment: 1
        },
        orderDates: {
          push: orderDate
        }
      },
      create: {
        customerId,
        totalAmount: orderValue,
        orderCount: 1,
        orderDates: [orderDate],
        userid: req.user.id
      },
    });
    await dispatchEvent('order_placed' , payload)
  }
  
  async function processOrderUpdated(payload) {
    const { orderId, newOrderValue } = payload;
    // Update logic for average order value

    await dispatchEvent('order_updated' , payload)

  }
  
  async function processOrderCancelled(payload) {
    const { orderId } = payload;
    // Update logic for average order value if necessary
    await dispatchEvent('order_cancelled' , payload)
  }
  
// Lifetime Value
async function processCustomerRevenueUpdate(payload) {
    const { customerId, newRevenue } = payload;
    await prisma.lifetimeValue.update({
      where: { customerId },
      data: {
        totalRevenue: newRevenue,
        // Add logic for handling the start and end dates if applicable
      },
    })
    await dispatchEvent('customer_revenue_update' , payload)
  }
  

// Purchase Frequency
async function processPurchaseMade(payload) {
    const { customerId, purchaseDate } = payload;
    await prisma.purchaseFrequency.upsert({
      where: { customerId },
      update: {
        numberOfPurchases: {
          increment: 1
        },
        purchaseDates: {
          push: purchaseDate
        }
      },
      create: {
        customerId,
        numberOfPurchases: 1,
        purchaseDates: [purchaseDate],
        frequency: 'daily', // Adjust as necessary
        userid: req.user.id
      },
    })
    await dispatchEvent('purchase_frequency' , payload)
  }
  

// Support Tickets
async function processTicketOpened(payload) {
    const { ticketId, customerId, openDate } = payload;
    await prisma.supportTickets.create({
      data: {
        customerId,
        numberOfTickets: 1,
        ticketCategories: [], // Add ticket categories if needed
        ticketDates: [openDate],
        userid: req.user.id
      },
    })
    await dispatchEvent('ticket_opened' , payload)
  }
  
  async function processTicketClosed(payload) {
    const { ticketId, closeDate } = payload;
    await prisma.supportTickets.update({
      where: { id: ticketId },
      data: {
        numberOfTickets: {
          decrement: 1
        },
        ticketDates: {
          push: closeDate
        },
      },
    })
    await dispatchEvent('ticket_closed' , payload)
  }
  
  async function processTicketEscalated(payload) {
    const { ticketId, escalationDate } = payload;
    await prisma.supportTickets.update({
      where: { id: ticketId },
      data: {
        ticketCategories: {
          push: 'escalated' // Update as needed
        },
        ticketDates: {
          push: escalationDate
        },
      },
    });
    await dispatchEvent('ticket_escalated' , payload)
  }
  

// Feedback Scores
async function processFeedbackSubmitted(payload) {
    const { customerId, feedbackScore, feedbackDate, feedbackType } = payload;
    await prisma.feedbackScores.create({
      data: {
        customerId,
        feedbackScore,
        feedbackDate,
        feedbackType,
        userid: req.user.id
      },
    });
    await dispatchEvent('feedback_submitted' , payload)
  }
  
  async function processNpsScoreUpdated(payload) {
    const { customerId, newNpsScore } = payload;
    // Implement logic to update NPS score if needed
    await dispatchEvent('nps_score_updated' , payload)
  }
  

// Return Rate
async function processReturnRequested(payload) {
    const { returnId, customerId, returnDate } = payload;
    await prisma.returnRate.create({
      data: {
        customerId,
        numberOfReturns: 1,
        returnDates: [returnDate],
        userid: req.user.id
      },
    });
    await dispatchEvent('return_requested' , payload)
  }
  
  async function processReturnProcessed(payload) {
    const { returnId, processDate } = payload;
    await prisma.returnRate.update({
      where: { id: returnId },
      data: {
        numberOfReturns: {
          increment: 1
        },
        returnDates: {
          push: processDate
        },
      },
    });
    await dispatchEvent('return_processed' , payload)
  }
  
  
// Referral Rate
async function processReferralMade(payload) {
    const { referralId, referrerId, referredCustomerId } = payload;
    await prisma.referralRate.create({
      data: {
        customerId: referrerId,
        numberOfReferrals: 1,
        referralDetails: [referredCustomerId],
        referralDates: [new Date()],
        userid: req.user.id
      },
    });
    await dispatchEvent('refferal_made' , payload)
  }
  
  async function processReferralConverted(payload) {
    const { referralId, conversionDate } = payload;
    await prisma.referralRate.update({
      where: { id: referralId },
      data: {
        numberOfReferrals: {
          increment: 1
        },
        referralDates: {
          push: conversionDate
        },
      },
    });
    await dispatchEvent('referral_converted' , payload)
  }
  

// Contract Length
async function processContractSigned(payload) {
    const { contractId, customerId, signedDate } = payload;
    await prisma.contractLength.create({
      data: {
        customerId,
        startDate: signedDate,
        endDate: null, // Update when contract is extended or terminated
        contractDetails: 'Signed',
        userid: req.user.id
      },
    });
    await dispatchEvent('contract_signed' , payload)
  }
  
  async function processContractExtended(payload) {
    const { contractId, newEndDate, extensionDate } = payload;
    await prisma.contractLength.update({
      where: { id: contractId },
      data: {
        endDate: newEndDate,
        contractDetails: 'Extended',
        createdAt: extensionDate
      },
    });
    await dispatchEvent('contract_extended' , payload)
  }
  
  async function processContractTerminated(payload) {
    const { contractId, terminationDate } = payload;
    await prisma.contractLength.update({
      where: { id: contractId },
      data: {
        endDate: terminationDate,
        contractDetails: 'Terminated',
        createdAt: terminationDate
      },
    });
    await dispatchEvent('contract_terminated' , payload)
  }
  

// Renewal Rate
async function processContractRenewed(payload) {
    const { contractId, renewalDate } = payload;
    await prisma.renewalRate.create({
      data: {
        customerId: contractId, // Adjust if needed
        numberOfRenewals: 1,
        renewalDates: [renewalDate],
        contractDetails: 'Renewed',
        userid: req.user.id
      },
    });
    await dispatchEvent('renewal_opportunity_created' , payload)
  }
  
  async function processRenewalOpportunityCreated(payload) {
    const { opportunityId, customerId, createdDate } = payload;
    await prisma.renewalOpportunity.create({
      data: {
        opportunityId,
        customerId,
        createdDate,
        userid: req.user.id
      },
    });
    await dispatchEvent('renewal_oppurtunity_created' , payload)
  }
  

// Product Usage/Adoption
async function processFeatureActivated(payload) {
    const { featureId, customerId, activationDate } = payload;
    await prisma.featureUsage.create({
      data: {
        featureId,
        customerId,
        activationDate,
        userid: req.user.id
      },
    });
    await dispatchEvent('feature_activated' , payload)
  }
  
  async function processUsageMilestoneReached(payload) {
    const { milestoneId, customerId, reachedDate } = payload;
    await prisma.usageMilestone.create({
      data: {
        milestoneId,
        customerId,
        reachedDate,
        userid: req.user.id
      },
    });
    await dispatchEvent('usage_milestone_reached' , payload)
  }
  
  async function processUserOnboarded(payload) {
    const { customerId, onboardDate } = payload;
    // Implement logic for onboarding event
    await dispatchEvent('user_onboarded' , payload)
  }
  
// Upsell/Cross-sell Success
async function processUpsellOpportunityCreated(payload) {
    const { opportunityId, customerId, createdDate } = payload;
    await prisma.upsellOpportunity.create({
      data: {
        opportunityId,
        customerId,
        createdDate,
        userid: req.user.id
      },
    });
    await dispatchEvent('upsell_opportunity_created' , payload)
  }
  
  async function processCrossSellSuccessful(payload) {
    const { customerId, crossSellDate } = payload;
    await prisma.crossSellSuccess.create({
      data: {
        customerId,
        crossSellDate,
        userid: req.user.id
      },
    });
    await dispatchEvent('cross_sell_successfull' , payload)
  }
  

// Customer Engagement
async function processWebinarAttended(payload) {
    const { webinarId, customerId, attendedDate } = payload;
    await prisma.customerEngagement.create({
      data: {
        webinarId,
        customerId,
        attendedDate,
        userid: req.user.id
      },
    });
    await dispatchEvent('webinar_attended' , payload)
  }
  
  async function processResourceDownloaded(payload) {
    const { resourceId, customerId, downloadDate, resourceType, userId } = payload;
    await prisma.customerEngagement.create({
      data: {
        resourceId,
        customerId,
        downloadDate,
        resourceType,
        userId
      },
    });
    await dispatchEvent('resource_downloaded' , payload)
  }
  
  async function processSupportArticleViewed(payload) {
    const { articleId, customerId, viewedDate, userId } = payload;
    await prisma.customerEngagement.create({
      data: {
        articleId,
        customerId,
        viewedDate,
        userId
      },
    });
    await dispatchEvent('support_article_viewed' , payload)
  }
  

// Compliance/Risk Score
async function processComplianceCheckPassed(payload) {
    const { customerId, complianceDate, complianceStatus } = payload;
    await prisma.complianceCheck.create({
      data: {
        customerId,
        complianceDate,
        complianceStatus, // "Passed" or "Failed"
        userid: req.user.id
      },
    });
    await dispatchEvent('compilance_checked_passed' , payload)
    
  }
  
  async function processRiskAssessmentUpdated(payload) {
    const { customerId, riskScore, assessmentDate } = payload;
    await prisma.riskAssessment.update({
      where: { customerId },
      data: {
        riskScore,
        assessmentDate,
        userid: req.user.id
      },
    });
    await dispatchEvent('risk_assessment_updated' , payload)
  }
  

// Market Influence
async function processSocialMediaMention(payload) {
    const { customerId, mentionDate, mentionDetails } = payload;
    await prisma.socialMediaMention.create({
      data: {
        customerId,
        mentionDate,
        mentionDetails,
        userid: req.user.id
      },
    });
    await dispatchEvent('social_media_mention' , payload)
  }
  
  async function processCaseStudyParticipation(payload) {
    const { customerId, caseStudyId, participationDate } = payload;
    await prisma.caseStudyParticipation.create({
      data: {
        customerId,
        caseStudyId,
        participationDate,
        userid: req.user.id
      },
    });
    await dispatchEvent('case_study_participation' , payload)
  }
  
  async function processSpeakingEngagement(payload) {
    const { customerId, engagementId, engagementDate } = payload;
    await prisma.speakingEngagement.create({
      data: {
        customerId,
        engagementId,
        engagementDate,
        userid: req.user.id
      },
    });
    await dispatchEvent('speaking_engagement' , payload)
  }
  


async function processCustomerCreated(payload) {
    const { customerId, name, email, companyId, creationDate } = payload;
    await prisma.customer.create({
      data: {
        id: customerId,
        name,
        email,
        companyId,
        createdAt: creationDate,
        userid: req.user.id
      },
    });
    await dispatchEvent('customer_created' , payload)
  }
  
  async function processCustomerUpdated(payload) {
    const { customerId, updates } = payload; // `updates` should be an object containing the fields to be updated
    await prisma.customer.update({
      where: { id: customerId },
      data: {
        ...updates,
        updatedAt: new Date(),
        userid: req.user.id
      },
    });
    await dispatchEvent('customer_updated' , payload)
  }
  
  async function processCustomerMerged(payload) {
    const { oldCustomerId, newCustomerId, mergeDate } = payload;
    // Perform merge logic, e.g., transfer data from old customer to new customer
    // and then delete the old customer if necessary
    await prisma.customer.update({
      where: { id: newCustomerId },
      data: {
        // Update with information from old customer
        mergedCustomers: {
          push: oldCustomerId
        },
        mergeDate,
        userid: req.user.id
      },
    });
  
    await prisma.customer.delete({
      where: { id: oldCustomerId }
    });
    await dispatchEvent('customer_merged' , payload)
  }
  
  async function processCustomerSegmentChanged(payload) {
    const { customerId, newSegment, changeDate } = payload;
    await prisma.customer.update({
      where: { id: customerId },
      data: {
        segment: newSegment, // Assuming you have a segment field in the Customer model
        segmentChangeDate: changeDate, // Add segmentChangeDate field if necessary
        userid: req.user.id
      },
    });
    await dispatchEvent('customer_segment_changed' , payload)
  }
  

// Main webhook handler
export async function handleWebhookEvent(req, res) {
  const { event, payload } = req.body;

  try {
    switch (event) {
      // Payment History
      case 'payment_received':
        await processPaymentReceived(payload);
        break;
      case 'payment_missed':
        await processPaymentMissed(payload);
        break;
      case 'payment_terms_changed':
        await processPaymentTermsChanged(payload);
        break;
        
      // Average Order Value
      case 'order_placed':
        await processOrderPlaced(payload);
        break;
      case 'order_updated':
        await processOrderUpdated(payload);
        break;
      case 'order_cancelled':
        await processOrderCancelled(payload);
        break;

      // Lifetime Value
      case 'customer_revenue_update':
        await processCustomerRevenueUpdate(payload);
        break;

      // Purchase Frequency
      case 'purchase_frequency':
        await processPurchaseMade(payload);
        break;

      // Support Tickets
      case 'ticket_opened':
        await processTicketOpened(payload);
        break;
      case 'ticket_closed':
        await processTicketClosed(payload);
        break;
      case 'ticket_escalated':
        await processTicketEscalated(payload);
        break;

      // Feedback Scores
      case 'feedback_submitted':
        await processFeedbackSubmitted(payload);
        break;
      case 'nps_score_updated':
        await processNpsScoreUpdated(payload);
        break;

      // Return Rate
      case 'return_requested':
        await processReturnRequested(payload);
        break;
      case 'return_processed':
        await processReturnProcessed(payload);
        break;

      // Referral Rate
      case 'referral_made':
        await processReferralMade(payload);
        break;
      case 'referral_converted':
        await processReferralConverted(payload);
        break;

      // Contract Length
      case 'contract_signed':
        await processContractSigned(payload);
        break;
      case 'contract_extended':
        await processContractExtended(payload);
        break;
      case 'contract_terminated':
        await processContractTerminated(payload);
        break;

      // Renewal Rate
      case 'contract_renewed':
        await processContractRenewed(payload);
        break;
      case 'renewal_opportunity_created':
        await processRenewalOpportunityCreated(payload);
        break;

      // Product Usage/Adoption
      case 'feature_activated':
        await processFeatureActivated(payload);
        break;
      case 'usage_milestone_reached':
        await processUsageMilestoneReached(payload);
        break;
      case 'user_onboarded':
        await processUserOnboarded(payload);
        break;

      // Upsell/Cross-sell Success
      case 'upsell_opportunity_created':
        await processUpsellOpportunityCreated(payload);
        break;
      case 'cross_sell_successful':
        await processCrossSellSuccessful(payload);
        break;

      // Customer Engagement
      case 'webinar_attended':
        await processWebinarAttended(payload);
        break;
      case 'resource_downloaded':
        await processResourceDownloaded(payload);
        break;
      case 'support_article_viewed':
        await processSupportArticleViewed(payload);
        break;

      // Compliance/Risk Score
      case 'compliance_check_passed':
        await processComplianceCheckPassed(payload);
        break;
      case 'risk_assessment_updated':
        await processRiskAssessmentUpdated(payload);
        break;

      // Market Influence
      case 'social_media_mention':
        await processSocialMediaMention(payload);
        break;
      case 'case_study_participation':
        await processCaseStudyParticipation(payload);
        break;
      case 'speaking_engagement':
        await processSpeakingEngagement(payload);
        break;

      // Additional general events
      case 'customer_created':
        await processCustomerCreated(payload);
        break;
      case 'customer_updated':
        await processCustomerUpdated(payload);
        break;
      case 'customer_merged':
        await processCustomerMerged(payload);
        break;
      case 'customer_segment_changed':
        await processCustomerSegmentChanged(payload);
        break;

        default:
          console.warn(`Unhandled event type: ${event}`);
    }

    res.status(200).json({ message: 'Event processed successfully' });
  } catch (error) {
    console.error('Error processing event:', error);
    res.status(500).json({ error: 'Failed to process event' });
  }
}
