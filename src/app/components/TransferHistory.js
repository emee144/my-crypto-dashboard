"use client";
import React, { useEffect, useState } from 'react';

const TransferHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransferHistory = async () => {
      try {
        const res = await fetch('/api/auth/transferhistory');
        const data = await res.json();
        console.log('API response:', data);  // Log raw API response

        if (!Array.isArray(data)) {
          console.warn('Warning: API response is not an array:', data);
          // If data is an object, maybe it has a property with the array? Adjust here if needed
          // e.g., setHistory(data.history || []);
          setHistory([]);
        } else {
          setHistory(data);
        }
      } catch (err) {
        console.error('Failed to fetch transfer history:', err);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransferHistory();
  }, []);

  console.log('Rendering history:', history);  // Log the state right before rendering

  return (
    <div className="p-4 bg-gray rounded-xl shadow-md mb-20">
      <h2 className="text-xl font-semibold mb-4">Transfer History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : history.length === 0 ? (
        <p>No transfer history found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm text-left">
            <thead className="bg-gray-500">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Asset</th>
                <th className="px-4 py-2">From</th>
                <th className="px-4 py-2">To</th>
                <th className="px-4 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-900">
                  <td className="px-4 py-2">{new Date(item.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-2">{item.assetType}</td>
                  <td className="px-4 py-2 capitalize">{item.from}</td>
                  <td className="px-4 py-2 capitalize">{item.to}</td>
                  <td className="px-4 py-2">{parseFloat(item.amount).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransferHistory;