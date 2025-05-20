'use client';
import { useEffect, useState } from 'react';

export default function WithdrawalHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [statusFilter, setStatusFilter] = useState('');
  const [currencyFilter, setCurrencyFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/auth/withdrawalhistory', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch history');
        const data = await res.json();
        console.log('Withdrawal History:', data); // Check what you get from the API
        setHistory(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Filtering logic
  const filteredHistory = Array.isArray(history)
  ? history.filter((item) => {
      const itemDate = new Date(item.createdAt);
      const isStatusMatch = statusFilter === '' || item.status === statusFilter;
      const isCurrencyMatch = currencyFilter === '' || item.currency === currencyFilter;
      const isStartDateMatch = startDate === '' || itemDate >= new Date(startDate);
      const isEndDateMatch = endDate === '' || itemDate <= new Date(endDate);
      return isStatusMatch && isCurrencyMatch && isStartDateMatch && isEndDateMatch;
    })
  : [];

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case 'USDT':
        return '💵';
      case 'BTC':
        return '₿';
      case 'ETH':
        return 'Ξ';
      default:
        return currency;
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-green-500 rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Withdrawal History</h1>

      {/* Filters Section */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded border bg-gray-700 text-green-500"
        >
          <option value="">All Statuses</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          value={currencyFilter}
          onChange={(e) => setCurrencyFilter(e.target.value)}
          className="px-4 py-2 rounded border bg-gray-700 text-green-500"
        >
          <option value="">All Currencies</option>
          <option value="USDT">USDT 💵</option>
          <option value="BTC">BTC ₿</option>
          <option value="ETH">ETH Ξ</option>
        </select>

        {/* Date Range Filters */}
        <div className="flex gap-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 rounded border bg-gray-700 text-green-500"
            placeholder="Start Date"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 rounded border bg-gray-700 text-green-500"
            placeholder="End Date"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-green-500">Loading...</div>
      ) : filteredHistory.length === 0 ? (
        <div className="text-green-500">No withdrawal history found.</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-700 text-left text-green-500 text-sm uppercase">
                <tr>
                  <th className="px-4 py-3">Currency</th>
                  <th className="px-4 py-3">Amount After Fee</th>
                  <th className="px-4 py-3">Chain</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {paginatedHistory.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-700 text-sm">
                    <td className="px-4 py-2">{getCurrencySymbol(item.currency)}</td>
                    <td className="px-4 py-2">{item.amountAfterFee}</td>
                    <td className="px-4 py-2">{item.chainName}</td>
                    <td className="px-4 py-2">{item.withdrawalAddress}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : item.status === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-4 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1 ? 'bg-green-500 text-white' : 'bg-gray-700'
                } hover:bg-gray-600`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
