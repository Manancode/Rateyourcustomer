export function validateWebhookUrl(url) {
    const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
    return urlRegex.test(url);
  }
  