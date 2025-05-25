'use client';

import { useState, useEffect } from 'react';

export default function TransferForm() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [assetType, setAssetType] = useState(''); // This is crypto: btc, eth, usdt
  const [amount, setAmount] = useState('');
  const [balances, setBalances] = useState({
    exchange: 0,
    trade: 0,
    perpetual: 0,
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fetchingBalances, setFetchingBalances] = useState(false);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!assetType) return;

      setFetchingBalances(true);
      setErrorMessage('');

      try {
        if (assetType.toLowerCase() === 'usdt') {
          const types = ['exchange', 'trade', 'perpetual'];

          const results = await Promise.all(
            types.map((type) =>
              fetch(`/api/auth/getBalance?assetType=${type}&crypto=USDT`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
              }).then((res) => (res.ok ? res.json() : { balance: 0 }))
            )
          );

          setBalances({
            exchange: results[0].balance,
            trade: results[1].balance,
            perpetual: results[2].balance,
          });
        } else {
          // For BTC and ETH, balances are always zero
          setBalances({
            exchange: 0,
            trade: 0,
            perpetual: 0,
          });
        }
      } catch (error) {
        console.error('Error fetching balances:', error);
        setErrorMessage('Failed to fetch balances. Please try again.');
        setBalances({
          exchange: 0,
          trade: 0,
          perpetual: 0,
        });
      } finally {
        setFetchingBalances(false);
      }
    };

    fetchBalances();
  }, [assetType]);

  const handleTransfer = async () => {
    setErrorMessage('');
    setLoading(true);
  
    if (from === to) {
      setErrorMessage('Source and destination must be different');
      setLoading(false);
      return;
    }
  
    try {
      const res = await fetch('/api/auth/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          balanceTypeFrom: from,
          balanceTypeTo: to,
          amount,
          assetType,
        }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        alert('Transfer successful!');
        setAmount('');
        setBalances((prev) => ({
          ...prev,
          [from]: prev[from] - parseFloat(amount),
          [to]: prev[to] + parseFloat(amount),
        }));
      } else {
        setErrorMessage(data.message || 'Transfer failed');
      }
    } catch (error) {
      console.error('Error during transfer:', error);
      setErrorMessage('An error occurred while processing the transfer.');
    } finally {
      setLoading(false);
    }
  };
  
  
  
  return (
    <div className="max-w-sm w-full bg-[#1e1e2f] text-white p-6 rounded-lg shadow-lg space-y-6">
      <h2 className="text-xl font-semibold text-center">Transfer</h2>

      <div className="space-y-4">
        {/* From */}
        <div>
          <label className="block text-sm mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            From
          </label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full bg-[#2b2b3c] p-2 rounded"
          >
            <option value="">Select account</option>
            <option value="trade">Trade</option>
            <option value="exchange">Exchange</option>
            <option value="perpetual">Perpetual</option>
          </select>
        </div>

        {/* To */}
        <div>
          <label className="block text-sm mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            To
          </label>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full bg-[#2b2b3c] p-2 rounded"
          >
            <option value="">Select account</option>
            <option value="exchange">Exchange</option>
            <option value="trade">Trade</option>
            <option value="perpetual">Perpetual</option>
          </select>
        </div>

        {/* Asset Type (crypto) */}
        <div>
          <label className="block text-sm mb-1">Asset</label>
          <select
            value={assetType}
            onChange={(e) => setAssetType(e.target.value)}
            className="w-full bg-[#2b2b3c] p-2 rounded"
          >
            <option value="">Please select</option>
            <option value="btc">BTC</option>
            <option value="eth">ETH</option>
            <option value="usdt">USDT</option>
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm mb-1">Amount of transfer</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full bg-[#2b2b3c] p-2 rounded"
          />
          <div className="text-right text-xs text-gray-400 mt-1">
            {fetchingBalances ? (
              <span>Loading balance...</span>
            ) : (
              <>
                Balance:{' '}
                {assetType && from ? (
                  <span>{balances[from]}</span>
                ) : (
                  <span>Select asset and account</span>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Error */}
      {errorMessage && (
        <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
      )}

      {/* Button */}
      <button
        onClick={handleTransfer}
        className="w-full cursor-pointer py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={loading || !from || !to || !assetType || !amount}
      >
        {loading ? 'Transferring...' : 'Transfer'}
      </button>
    </div>
  );
}
