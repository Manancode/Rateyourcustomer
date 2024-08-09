'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WebhookManager = () => {
  const [webhooks, setWebhooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWebhook, setNewWebhook] = useState({ url: '', events: [] });
  const [error, setError] = useState('');

  const availableEvents = [
    'account.updated',
    'customer.created',
    'customer.updated',
    'invoice.paid',
    'invoice.payment_failed',
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
  ];

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    try {
      // This endpoint needs to be implemented on the backend
      const response = await axios.get('/api/get-webhook');
      setWebhooks(response.data);
    } catch (error) {
      console.error('Failed to fetch webhooks:', error);
      setError('Failed to fetch webhooks');
    }
  };
  const handleAddEndpoint = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('/api/create-webhook', {
        url: newWebhook.url,
        events: newWebhook.events,
      }, {
        headers: {
          'x-api-key': localStorage.getItem('apiKey'),
        }
      });
      
      if (response.status === 201) {
        setWebhooks([...webhooks, response.data.webhook]);
        setNewWebhook({ url: '', events: [] });
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to add webhook:', error);
      if (error.response) {
        setError(error.response.data.error);
      } else {
        setError('Failed to register webhook');
      }
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

      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2">URL</th>
            <th className="text-left p-2">Events</th>
          </tr>
        </thead>
        <tbody>
          {webhooks.map((webhook) => (
            <tr key={webhook.id} className="border-b">
              <td className="p-2">{webhook.url}</td>
              <td className="p-2">{webhook.events.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>

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