export interface WebhookPayload {
    event: string;
    data: any;
  }
  
  export interface Webhook {
    id: string;
    url: string;
    events: string[];
    companyId: string;
  }