// Existing interfaces
export interface Webhook {
  id: number;
  url: string;
  events: string[];
  companyId: string;
}

export interface WebhookRegistrationRequest {
  url: string;
  events: string[];
}

// New types and enums

export enum WebhookEventType {
  CUSTOMER_CREATED = 'customer.created',
  CUSTOMER_UPDATED = 'customer.updated',
  CUSTOMER_DELETED = 'customer.deleted',
  ORDER_PLACED = 'order.placed',
  ORDER_FULFILLED = 'order.fulfilled',
  PAYMENT_RECEIVED = 'payment.received',
  PAYMENT_FAILED = 'payment.failed',
  // Add more event types as needed
}

export enum WebhookStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  FAILED = 'failed',
}

export interface WebhookPayload {
  event: WebhookEventType;
  data: any; // The actual data payload
  timestamp: number;
}

export interface WebhookDeliveryAttempt {
  id: number;
  webhookId: number;
  timestamp: number;
  success: boolean;
  responseStatus?: number;
  responseBody?: string;
}

export interface WebhookServiceConfig {
  id: string;
  name: string;
  baseUrl: string;
  authToken?: string;
  maxRetries: number;
  timeoutMs: number;
}

export interface WebhookTriggerRequest {
  webhookId: number;
  event: WebhookEventType;
  payload: any;
}

export interface WebhookUpdateRequest {
  id: number;
  url?: string;
  events?: string[];
  status?: WebhookStatus;
}

export interface WebhookFilterOptions {
  companyId?: string;
  status?: WebhookStatus;
  event?: WebhookEventType;
}