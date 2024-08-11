'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ApiKeysPage = () => {
  
  const [apiKeyData, setApiKeyData] = useState(null);                                                       

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const response = await axios.get('/api/api-keys');
        setApiKeyData(response.data);

        // Store the API key in local storage
        if (response.data.token) {
          localStorage.setItem('apiKey', response.data.token);
        }
      } catch (error) {
        console.error('Error fetching API keys:', error);
      }
    };

    fetchApiKeys();
  }, []);

  if (!apiKeyData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">API keys</h1>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Standard keys</h2>
        <a href="/docs" className="text-blue-500 hover:underline">Learn more about API authentication &rarr;</a>
      </div>
      <p className="mb-4">Create a key that unlocks full API access, enabling extensive interaction with your account.</p>
      <div className="bg-white shadow rounded-lg mb-6">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">NAME</th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">TOKEN</th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">LAST USED</th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">CREATED</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">{apiKeyData.name || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">{apiKeyData.token || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">{apiKeyData.lastUsed || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">{apiKeyData.created || 'N/A'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApiKeysPage;
