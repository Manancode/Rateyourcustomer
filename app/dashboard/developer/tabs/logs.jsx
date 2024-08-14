'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EventLogViewer = () => {
  const [eventLogs, setEventLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEventLogs();
  }, []);

  const fetchEventLogs = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/get-event-logs', {
        headers: {
          'x-api-key': localStorage.getItem('apiKey'),
        }
      });

      if (response.data && Array.isArray(response.data.eventLogs)) {
        setEventLogs(response.data.eventLogs);
      } else {
        throw new Error('Unexpected data format received from API.');
      }
    } catch (error) {
      console.error('Failed to fetch event logs:', error);
      setError('Failed to fetch event logs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Event Logs</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ul className="space-y-4">
          {eventLogs.map((log) => (
            <li key={log.id} className="p-4 border rounded">
              <p><strong>Event Type:</strong> {log.eventType}</p>
              <p><strong>Company ID:</strong> {log.companyId}</p>
              <p><strong>Payload:</strong> {JSON.stringify(log.payload)}</p>
              <p><strong>Created At:</strong> {new Date(log.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventLogViewer;
