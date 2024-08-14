const requiredFields = {
  'PAYMENT_RECEIVED': ['customerId', 'amount' , 'paymentDate'],
  'PAYMENT_MISSED': ['customerId', 'missedDate'],
  'PAYMENT_TERMS_CHANGED': ['customerId', 'newTerms', 'updatedDate'],
  'ORDER_PLACED' : ['customerId' , 'orderValue' , 'orderDate' , 'status'], 
  'ORDER_UPDATED' : ['orderId' , 'updatedFields'],
  'ORDER_CANCELLED' : ['orderId' , 'cancelDate'],
  'LIFETIME_VALUE_UPDATED' : ['customerId' ,'totalRevenue' , 'endDate' , 'details'],
  'LIFETIME_VALUE_CALCULATED' : ['customerId' , 'totalRevenue' , 'startDate' , 'endDate' , 'details'],
  'PRODUCT_USAGE_UPDATED' : ['customerId' , 'featureUsed' , 'usageDuration' ,'usageDate'],
  'FEATURE_USAGE_DECLINED' : ['customerId', 'featureUsed', 'declineReason', 'declineDate'],
  'PURCHASE_FREQUENCY_CHANGED' : ['customerId', 'numberOfPurchases', 'purchaseDates', 'frequency'],
  'RENEWAL_RATE_UPDATED' : ['customerId' , 'riskDetails', 'identifiedDate'],
  'RENEWAL_RISK_IDENTIFIED' : ['customerId', 'renewalRate', 'lastRenewalUpdate'],
  'RETURN_RATE_UPDATED': ['customerId', 'numberOfReturns', 'totalOrders', 'returnDates', 'returnDetails'],
  'SUPPORT_TICKET_CREATED' : ['customerId', 'ticketId', 'createdAt'],
   'SUPPORT_TICKET_RESOLVED' : ['ticketId', 'resolvedAt', 'satisfactionScore'],
  'UPSELL_OPPORTUNITY_CREATED' : ['customerId', 'opportunityId', 'status'], 
  'UPSELL_OPPORTUNITY_LOST': ['opportunityId', 'lossReason', 'lossDate'],
  'CUSTOMER_ENGAGEMENT_UPDATED': ['customerId', 'engagementScore', 'lastEngaged', 'details'],
   'CUSTOMER_SUCCESS_UPDATED' : ['customerId', 'successScore', 'milestone', 'achievedAt', 'details'], 
  'SUCCESS_MILESTONE_ACHIEVED': ['customerId', 'milestone', 'achievedAt', 'details'],
   'FEEDBACK_SCORE_UPDATED' : ['customerId', 'feedbackScore', 'feedbackDate', 'feedbackType', 'details'],
  'DATA_SYNC_COMPLETED' : ['syncDate', 'details'], 
  'CONTRACT_CREATED' : ['customerId', 'contractLength', 'startDate', 'endDate'], 
  'CONTRACT_UPDATED' : ['contractId', 'updatedDetails', 'updateDate'],
  'CONTRACT_TERMINATED' : ['contractId', 'terminationDetails', 'terminationDate'], 
  'ACCOUNT_HEALTH_UPDATED' : ['customerId', 'healthScore', 'updateDate'], 
  'ACCOUNT_AT_RISK': ['customerId', 'riskFactors', 'identifiedDate'],
  'RESOURCE_DOWNLOADED' : ['customerId', 'resourceId', 'downloadDate'], 
  'SUPPORT_ARTICLE_VIEWED' : ['customerId', 'articleId', 'viewDate']
  
};

export function validatePayload(eventType, payload) {
  const fields = requiredFields[eventType];
  
  if (!fields) {
      throw new Error(`Unknown event type: ${eventType}`);
  }
  
  const missingFields = fields.filter(field => !(field in payload));
  
  return missingFields;
}