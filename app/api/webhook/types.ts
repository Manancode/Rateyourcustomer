interface WebhookRequest {
  url: string;
  events: string[];
}

interface WebhookResponse {
  id: string;
  url: string;
  events: string[];
  companyId: string;
}