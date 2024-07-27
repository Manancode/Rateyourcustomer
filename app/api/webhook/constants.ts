// webhooks/constants.ts
export const WEBHOOK_EVENTS = {
    CUSTOMER_CREATED: 'customer.created',
    CUSTOMER_UPDATED: 'customer.updated',
    CUSTOMER_DELETED: 'customer.deleted',
    RATING_CREATED: 'rating.created',
    RATING_UPDATED: 'rating.updated',
    RATING_DELETED: 'rating.deleted',
    CHURN_RATE_CHANGED: 'churn_rate.changed',
    LIFETIME_VALUE_UPDATED: 'lifetime_value.updated',
    UPSELL_OPPORTUNITY_DETECTED: 'upsell_opportunity.detected',
    COMPANY_ONBOARDED: 'company.onboarded',
    COMPANY_SETTINGS_UPDATED: 'company.settings_updated',
    SUBSCRIPTION_CREATED: 'subscription.created',
    SUBSCRIPTION_UPDATED: 'subscription.updated',
    SUBSCRIPTION_CANCELLED: 'subscription.cancelled',
  };


  export const ERROR_MESSAGES = {
    WEBHOOK_ALREADY_EXISTS: 'Webhook URL already exists',
    WEBHOOK_BELONGS_TO_OTHER_USER: 'Webhook does not belong to the authenticated user',
    FAILED_TO_REGISTER_WEBHOOK: 'Failed to register webhook'
  };