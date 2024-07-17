import React from 'react';

const ApiKeysPage = () => {
  const standardKeys = [
    { name: 'Publishable key', token: 'pk_test_...', lastUsed: 'Jul 15', created: 'Nov 25, 2023' },
    { name: 'Secret key', token: 'sk_test_...', lastUsed: 'Jul 15', created: 'Jul 5' }
  ];

  const restrictedKeys = [
    { name: 'CLI key for penguin', token: 'rk_test_...', lastUsed: 'Jul 9', created: 'Jul 9', expiresIn: '84 days' }
  ];

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
            {standardKeys.map((key, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">{key.name}</td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">{key.token}</td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">{key.lastUsed}</td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">{key.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold mb-4">Restricted keys</h2>
      <p className="mb-4">Create a key with specific access limits and permissions for greater security.</p>
      <div className="bg-white shadow rounded-lg mb-6">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">NAME</th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">TOKEN</th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">LAST USED</th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">CREATED</th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">EXPIRES IN</th>
            </tr>
          </thead>
          <tbody>
            {restrictedKeys.map((key, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">{key.name}</td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">{key.token}</td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">{key.lastUsed}</td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">{key.created}</td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">{key.expiresIn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="bg-blue-500 text-white px-4 py-2 rounded">Create restricted key</button>
    </div>
  );
}

export default ApiKeysPage;
