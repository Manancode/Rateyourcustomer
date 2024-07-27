const requiredFields = {
  // Payment History
  'payment_received': ['paymentId', 'customerId', 'amount', 'paymentDate', 'userId'],
  'payment_missed': ['paymentId', 'customerId', 'missedDate', 'userId'],
  'payment_terms_changed': ['customerId', 'oldTerms', 'newTerms', 'changeDate', 'userId'],

  // Order Value
  'order_placed': ['orderId', 'customerId', 'amount', 'orderDate', 'userId'],
  'order_updated': ['orderId', 'customerId', 'newAmount', 'updateDate', 'userId'],
  'order_cancelled': ['orderId', 'customerId', 'cancellationDate', 'userId'],

  // Lifetime Value
  'lifetime_value_updated': ['customerId', 'totalRevenue', 'updateDate', 'userId'],
  'lifetime_value_calculated': ['customerId', 'totalRevenue', 'calculationDate', 'userId'],

  // Product Usage
  'product_usage_updated': ['customerId', 'usageDetails', 'updateDate', 'userId'],
  'feature_usage_declined': ['customerId', 'featureDetails', 'declineDate', 'userId'],

  // Purchase Frequency
  'purchase_frequency_changed': ['customerId', 'frequency', 'changeDate', 'userId'],

  // Renewal Rate
  'renewal_rate_updated': ['customerId', 'renewalRate', 'updateDate', 'userId'],
  'renewal_risk_identified': ['customerId', 'riskDetails', 'identificationDate', 'userId'],

  // Return Rate
  'return_rate_updated': ['customerId', 'returnRate', 'updateDate', 'userId'],

  // Support Tickets
  'support_ticket_created': ['ticketId', 'customerId', 'ticketDetails', 'creationDate', 'userId'],
  'support_ticket_resolved': ['ticketId', 'customerId', 'resolutionDate', 'userId'],

  // Upsell/Cross-Sell
  'upsell_opportunity_created': ['opportunityId', 'customerId', 'opportunityDetails', 'creationDate', 'userId'],
  'upsell_opportunity_lost': ['opportunityId', 'customerId', 'lossDate', 'userId'],

  // Customer Engagement
  'customer_engagement_updated': ['customerId', 'engagementScore', 'updateDate', 'userId'],

  // Customer Success
  'customer_success_updated': ['customerId', 'successScore', 'updateDate', 'userId'],
  'success_milestone_achieved': ['customerId', 'milestoneDetails', 'achievementDate', 'userId'],

  // Feedback Scores
  'feedback_score_updated': ['customerId', 'feedbackScore', 'feedbackDate', 'feedbackType', 'userId'],

  // Data Sync
  'data_sync_completed': ['syncDetails', 'syncDate', 'userId'],

  // Contract Length
  'contract_created': ['customerId', 'contractDetails', 'startDate', 'endDate', 'userId'],
  'contract_updated': ['customerId', 'contractDetails', 'updateDate', 'userId'],
  'contract_terminated': ['customerId', 'terminationDate', 'userId'],

  // Account Health
  'account_health_updated': ['customerId', 'healthScore', 'updateDate', 'userId'],
  'account_at_risk': ['customerId', 'riskReason', 'updateDate', 'userId'],

  // Additional Events
  'resource_downloaded': ['resourceId', 'customerId', 'downloadDate', 'userId'],
  'support_article_viewed': ['articleId', 'customerId', 'viewedDate', 'userId']
}

  
  export function validatePayload(eventType, payload) {
    if (!requiredFields[eventType]) {
      throw new Error(`Unknown event type: ${eventType}`);
    }
    return requiredFields[eventType].filter(field => !payload[field]);
  }