'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WebhookManager = () => {
  const [webhooks, setWebhooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWebhook, setNewWebhook] = useState({ url: '', events: [], status: 'active' });
  const [error, setError] = useState('');

  const availableEvents = [
    'PAYMENT_RECEIVED', 'PAYMENT_MISSED', 'PAYMENT_TERMS_CHANGED',
    'ORDER_PLACED', 'ORDER_UPDATED', 'ORDER_CANCELLED',
    'LIFETIME_VALUE_UPDATED', 'LIFETIME_VALUE_CALCULATED',
    'PRODUCT_USAGE_UPDATED', 'FEATURE_USAGE_DECLINED',
    'PURCHASE_FREQUENCY_CHANGED', 'RENEWAL_RATE_UPDATED',
    'RENEWAL_RISK_IDENTIFIED', 'RETURN_RATE_UPDATED',
    'SUPPORT_TICKET_CREATED', 'SUPPORT_TICKET_RESOLVED',
    'UPSELL_OPPORTUNITY_CREATED', 'UPSELL_OPPORTUNITY_LOST',
    'CUSTOMER_ENGAGEMENT_UPDATED', 'CUSTOMER_SUCCESS_UPDATED',
    'SUCCESS_MILESTONE_ACHIEVED', 'FEEDBACK_SCORE_UPDATED',
    'DATA_SYNC_COMPLETED', 'CONTRACT_CREATED', 'CONTRACT_UPDATED',
    'CONTRACT_TERMINATED', 'ACCOUNT_HEALTH_UPDATED', 'ACCOUNT_AT_RISK',
    'RESOURCE_DOWNLOADED', 'SUPPORT_ARTICLE_VIEWED'
  ];

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    setIsLoading(true);
    setError('');
    try {
      const apiKey = localStorage.getItem('apiKey');
      if (!apiKey) {
        throw new Error('API key not found. Please log in again.');
      }
  
      const response = await axios.get('/api/get-webhook', {
        headers: {
          'x-api-key': apiKey,
        }
      });
  
      console.log('Fetched webhooks:', response.data);
  
      if (response.data && Array.isArray(response.data.webhooks)) {
        setWebhooks(response.data.webhooks);
      } else {
        throw new Error('Unexpected data format received from API.');
      }
    } catch (error) {
      console.error('Failed to fetch webhooks:', error);
      setError(error.message || 'Failed to fetch webhooks. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEndpoint = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('/api/create-webhook', {
        url: newWebhook.url,
        events: newWebhook.events,
        status: newWebhook.status
      }, {
        headers: {
          'x-api-key': localStorage.getItem('apiKey'),
        }
      });

      if (response.status === 201) {
        setWebhooks(prevWebhooks => [...prevWebhooks, response.data.webhook]);
        setNewWebhook({ url: '', events: [], status: 'active' });
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to add webhook:', error);
      setError('Failed to register webhook.');
    }
  };

  const handleDeleteEndpoint = async (webhookId) => {
    setError('');
    try {
      const response = await axios.delete(`/api/delete-webhook/${webhookId}`, {
        headers: {
          'x-api-key': localStorage.getItem('apiKey'),
        }
      });

      if (response.status === 200) {
        setWebhooks(prevWebhooks => prevWebhooks.filter(webhook => webhook.id !== webhookId));
      }
    } catch (error) {
      console.error('Failed to delete webhook:', error);
      setError('Failed to delete webhook url');
    }
  };

  const toggleEventSelection = (event) => {
    setNewWebhook(prev => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter(e => e !== event)
        : [...prev.events, event]
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Hosted endpoints</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          + Add endpoint
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {isLoading ? (
        <div className="text-center">Loading webhooks...</div>
      ) : webhooks.length === 0 ? (
        <div className="text-center">No webhooks available</div>
      ) : (
        <div className="space-y-4">
          {webhooks.map((webhook) => (
            <div key={webhook.id} className="border p-4 rounded flex justify-between items-center">
              <div>
                <h3 className="font-bold">{webhook.url}</h3>
                <p className="text-sm text-gray-600">
                  Events: {webhook.events.join(', ')}
                </p>
                <p className="text-sm text-gray-600">
                  Status: {webhook.status}
                </p>
                {webhook.lastDelivery && (
                  <p className="text-sm text-gray-600">
                    Last Delivery: {new Date(webhook.lastDelivery).toLocaleString()}
                  </p>
                )}
                {webhook.lastError && (
                  <p className="text-sm text-red-600">
                    Last Error: {webhook.lastError}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleDeleteEndpoint(webhook.id)}
                className="text-red-500 hover:text-red-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Endpoint</h2>
            <form onSubmit={handleAddEndpoint}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Webhook URL</label>
                <input
                  type="url"
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Events</label>
                <div className="max-h-40 overflow-y-auto border rounded p-2">
                  {availableEvents.map(event => (
                    <label key={event} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        checked={newWebhook.events.includes(event)}
                        onChange={() => toggleEventSelection(event)}
                        className="mr-2"
                      />
                      {event}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mr-2 px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Add Webhook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebhookManager;
