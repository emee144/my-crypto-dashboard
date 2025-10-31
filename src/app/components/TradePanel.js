// src/app/components/TradePanel.js
'use client';
import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function TradePanel({ price, fetchBalanceAndTrades }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [amount, setAmount] = useState(10);
  const [duration, setDuration] = useState(120);

  const formatCountdown = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const placeOrder = async (direction) => {
    if (!price || isNaN(price)) return alert('Price not available.');
    if (!amount || !duration) return alert('Amount and duration required.');
    if (order?.countdown > 0) return alert('Wait for the current order to finish.');

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/auth/trade/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asset: 'BTCUSDT', direction, amount, duration }),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.error || 'Failed to place order.');

      const backendTrade = data.trade;
      const remainingSeconds = Math.max(
        Math.floor((new Date(backendTrade.expiryTime) - Date.now()) / 1000),
        0
      );

      const newOrder = { ...backendTrade, countdown: remainingSeconds, uuid: uuidv4() };
      setOrder(newOrder);
      localStorage.setItem('activeOrder', JSON.stringify(newOrder));

      await fetchBalanceAndTrades(); // refresh parent balances
    } catch (err) {
      console.error(err);
      alert('Error placing order.');
    } finally {
      setLoading(false);
    }
  };

  // Countdown & resolve
  useEffect(() => {
    if (!order || order.countdown <= 0) return;

    const timer = setInterval(() => {
      setOrder((prev) => {
        if (!prev || prev.countdown <= 1) {
          clearInterval(timer);

          // Simulate result
          const finalResult = Math.random() < 0.5 ? 'Win' : 'Lose';
          setResult(finalResult);

          const newTrade = {
            uuid: prev.uuid,
            direction: prev.direction,
            amount: prev.amount,
            entryPrice: prev.entryPrice,
            result: finalResult,
            time: new Date().toLocaleTimeString(),
          };

          // Update history without duplicates
          setHistory((prevHistory) => {
            const exists = prevHistory.find((t) => t.uuid === newTrade.uuid);
            if (exists) return prevHistory;
            const updated = [newTrade, ...prevHistory].slice(0, 5);
            localStorage.setItem('tradeHistory', JSON.stringify(updated));
            return updated;
          });

          localStorage.removeItem('activeOrder');
          fetchBalanceAndTrades(); // refresh parent balances after trade resolves
          return null;
        }
        return { ...prev, countdown: prev.countdown - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [order, fetchBalanceAndTrades]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('tradeHistory') || '[]');
    setHistory(savedHistory.map((t) => ({ ...t, uuid: t.uuid || uuidv4() })));

    const savedOrder = JSON.parse(localStorage.getItem('activeOrder') || 'null');
    if (savedOrder) {
      const remaining = Math.max(
        Math.floor((new Date(savedOrder.expiryTime) - Date.now()) / 1000),
        0
      );
      if (remaining > 0) setOrder({ ...savedOrder, countdown: remaining });
      else localStorage.removeItem('activeOrder');
    }
  }, []);

  return (
    <div className="my-10 w-full max-w-xl mx-auto text-white">
      <div className="flex gap-4 justify-center mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Amount (USDT)"
          className="px-3 py-2 rounded text-white w-24"
        />
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          placeholder="Duration (sec)"
          className="px-3 py-2 rounded text-white w-24"
        />
      </div>

      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <button
          onClick={() => placeOrder('CALL')}
          disabled={loading || order?.countdown > 0}
          className={`flex items-center gap-2 px-6 py-3 rounded font-semibold shadow transition text-white ${
            loading || order?.countdown > 0
              ? 'bg-green-300 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          <ArrowUpRight className="w-5 h-5" /> CALL
        </button>
        <button
          onClick={() => placeOrder('PUT')}
          disabled={loading || order?.countdown > 0}
          className={`flex items-center gap-2 px-6 py-3 rounded font-semibold shadow transition text-white ${
            loading || order?.countdown > 0
              ? 'bg-red-300 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          <ArrowDownRight className="w-5 h-5" /> PUT
        </button>
      </div>

      {loading && <p className="text-center text-sm text-gray-400 mb-4">Placing order...</p>}

      {order && (
        <div
          className={`p-4 rounded shadow-md text-sm mb-6 ${
            order.direction === 'CALL'
              ? 'bg-green-800 border-l-4 border-green-400'
              : 'bg-red-800 border-l-4 border-red-400'
          }`}
        >
          <p>
            <span className="font-medium">Order:</span> <span className="font-bold">{order.direction}</span>
          </p>
          <p>
            <span className="font-medium">Amount:</span> {order.amount} USDT
          </p>
          <p>
            <span className="font-medium">Entry Price:</span> {order.entryPrice}
          </p>
          <p>
            <span className="font-medium">Time Left:</span> {formatCountdown(order.countdown)}
          </p>
        </div>
      )}

      {result && (
        <div
          className={`p-4 rounded shadow text-center font-semibold mb-6 ${
            result === 'Win' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          You {result} the trade!
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-6 mb-10">
          <h3 className="font-bold mb-2 text-white">Last Trades</h3>
          <ul className="space-y-2">
            {history.map((trade) => (
              <li
                key={trade.uuid}
                className={`p-3 rounded shadow flex justify-between items-center border ${
                  trade.result === 'Win'
                    ? 'bg-green-700 border-green-500'
                    : 'bg-red-700 border-red-500'
                }`}
              >
                <span className="font-medium">{trade.direction}</span>
                <span>{trade.amount} USDT</span>
                <span>{trade.entryPrice}</span>
                <span className="text-xs">{trade.time}</span>
                <span className={`font-semibold ${trade.result === 'Win' ? 'text-green-300' : 'text-red-300'}`}>
                  {trade.result}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}