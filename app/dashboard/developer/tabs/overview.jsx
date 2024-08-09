import React from 'react';

const Overview = () => {
  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-4">
        <div className="text-2xl font-semibold">Your Integration</div>
        <div className="flex items-center">
          <input type="text" placeholder="Search..." className="border rounded px-3 py-1" />
          <img src="/path/to/icon.svg" alt="notifications" className="ml-4" />
          <img src="/path/to/icon.svg" alt="settings" className="ml-4" />
          <label className="flex items-center ml-4">
            <input type="checkbox" className="hidden" />
            <span className="toggle-switch"></span>
            Test mode
          </label>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold">API Requests</h2>
          {/* Insert chart or data here */}
        </div>
        {/* Repeat similar blocks for other cards */}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">Recent Errors</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b border-gray-200">Error</th>
              <th className="px-6 py-3 border-b border-gray-200">Time</th>
              {/* Add more headers as needed */}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-6 py-4 border-b border-gray-200">Error 1</td>
              <td className="px-6 py-4 border-b border-gray-200">Timestamp</td>
            </tr>
            {/* Repeat rows for more errors */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Overview;
