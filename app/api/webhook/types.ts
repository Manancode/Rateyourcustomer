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
