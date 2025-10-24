'use client';

import { useEffect, useState } from 'react';

export default function DepositHistory() {
  const [deposits, setDeposits] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [statusFilter, setStatusFilter] = useState('all');
  const [currencyFilter, setCurrencyFilter] = useState('all');

  useEffect(() => {
    const fetchDepositHistory = async () => {
      try {
        const res = await fetch('/api/auth/deposit/history', {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Failed to fetch deposit history');

        const data = await res.json();
        setDeposits(data.deposits || []);
      } catch (err) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchDepositHistory();
  }, []);

  useEffect(() => {
    const filteredData = deposits.filter((dep) => {
      const matchStatus = statusFilter === 'all' || dep.status === statusFilter;
      const matchCurrency = currencyFilter === 'all' || dep.currency === currencyFilter;
      return matchStatus && matchCurrency;
    });
    setFiltered(filteredData);
  }, [statusFilter, currencyFilter, deposits]);

  if (loading) return <p className="text-sm">Loading...</p>;
  if (error) return <p className="text-red-500 text-sm">{error}</p>;

  return (
    <div className="mb-10 text-center bg-blue-900 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Deposit History</h2>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-4 text-sm">
        <select
          className="border border-blue-500 bg-blue-800 text-white px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>

        <select
          className="border border-blue-500 bg-blue-800 text-white px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={currencyFilter}
          onChange={(e) => setCurrencyFilter(e.target.value)}
        >
          <option value="all">All Currencies</option>
          <option value="USDT">USDT</option>
          <option value="BTC">BTC</option>
          <option value="ETH">ETH</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-blue-500 shadow bg-blue-800">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-blue-700">
            <tr>
              <th className="p-2 border border-blue-600">Amount</th>
              <th className="p-2 border border-blue-600">Chain</th>
              <th className="p-2 border border-blue-600">Currency</th>
              <th className="p-2 border border-blue-600">Status</th>
              <th className="p-2 border border-blue-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((dep) => (
                <tr key={dep.id} className="hover:bg-blue-600 transition">
                  <td className="p-2 border border-blue-700">{dep.depositAmount}</td>
                  <td className="p-2 border border-blue-700">{dep.chainName}</td>
                  <td className="p-2 border border-blue-700">{dep.currency}</td>
                  <td
                    className={`p-2 border border-blue-700 capitalize font-semibold ${
                      dep.status === 'completed'
                        ? 'text-green-400'
                        : dep.status === 'pending'
                        ? 'text-yellow-400'
                        : 'text-red-400'
                    }`}
                  >
                    {dep.status}
                  </td>
                  <td className="p-2 border border-blue-700">
                    {new Date(dep.depositDate).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-2 text-gray-400">
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
