'use client';
import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function TradePanel({ price, fetchBalanceAndTrades }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const formatCountdown = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const placeOrder = async (direction) => {
    if (!price || isNaN(price)) {
      alert('Price not available yet. Please wait...');
      return;
    }

    if (order && order.countdown > 0) {
      alert("Please wait for the current order to finish.");
      return;
    }

    setLoading(true);
    setResult(null);

    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
    try {
      const res = await fetch('/api/auth/trade/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          direction,
          entryPrice: price,
          expiryTime: expiry.toISOString(),
          amount: 10,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to place order.");
        setLoading(false);
        return;
      }

      const newOrder = { ...data, countdown: 300 };
      setOrder(newOrder);
      localStorage.setItem('activeOrder', JSON.stringify(newOrder));
      await fetchBalanceAndTrades();
    } catch (err) {
      alert('Error placing order.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!order || order.countdown <= 0) return;

    const timer = setInterval(() => {
      setOrder((prev) => {
        if (!prev || prev.countdown <= 1) {
          clearInterval(timer);
          const finalResult = Math.random() < 0.5 ? 'Win' : 'Lose';
          setResult(finalResult);

          const newTrade = {
            direction: prev.direction,
            entryPrice: prev.entryPrice,
            result: finalResult,
            time: new Date().toLocaleTimeString(),
          };

          setHistory((prevHistory) => {
            const updated = [newTrade, ...prevHistory.slice(0, 4)];
            localStorage.setItem('tradeHistory', JSON.stringify(updated));
            return updated;
          });

          localStorage.removeItem('activeOrder');
          return null;
        }

        const updated = { ...prev, countdown: prev.countdown - 1 };
        localStorage.setItem('activeOrder', JSON.stringify(updated));
        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [order]);

  useEffect(() => {
    const saved = localStorage.getItem('activeOrder');
    if (saved) {
      const parsed = JSON.parse(saved);
      const remaining = Math.floor((new Date(parsed.expiryTime) - new Date()) / 1000);
      if (remaining > 0) {
        setOrder({ ...parsed, countdown: remaining });
      } else {
        localStorage.removeItem('activeOrder');
      }
    }

    const storedHistory = localStorage.getItem('tradeHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  return (
    <div className="my-6 w-full max-w-xl mx-auto">
      {/* Buttons */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <button
          aria-label="Place CALL Order"
          onClick={() => placeOrder('CALL')}
          disabled={loading || order?.countdown > 0}
          className={`flex items-center gap-2 px-6 py-3 rounded text-white font-semibold shadow transition ${
            loading || order?.countdown > 0
              ? 'bg-green-300 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          <ArrowUpRight className="w-5 h-5" />
          CALL
        </button>
        <button
          aria-label="Place PUT Order"
          onClick={() => placeOrder('PUT')}
          disabled={loading || order?.countdown > 0}
          className={`flex items-center gap-2 px-6 py-3 rounded text-white font-semibold shadow transition ${
            loading || order?.countdown > 0
              ? 'bg-red-300 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          <ArrowDownRight className="w-5 h-5" />
          PUT
        </button>
      </div>

      {loading && (
        <p className="text-center text-sm text-gray-500 mb-4">Placing order...</p>
      )}

      {/* Active Order */}
      {order && (
        <div
          className={`p-4 rounded shadow-md text-sm mb-4 ${
            order.direction === 'CALL'
              ? 'bg-green-50 border-l-4 border-green-500'
              : 'bg-red-50 border-l-4 border-red-500'
          }`}
        >
          <p>
            <span className="font-medium">Order:</span>{' '}
            <span className={`font-bold ${order.direction === 'CALL' ? 'text-green-600' : 'text-red-600'}`}>
              {order.direction}
            </span>
          </p>
          <p><span className="font-medium">Entry Price:</span> {order.entryPrice}</p>
          <p><span className="font-medium">Time Left:</span> {formatCountdown(order.countdown)}</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div
          className={`p-4 rounded shadow text-white font-semibold text-center ${
            result === 'Win' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          You {result} the trade!
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="mt-6">
          <h3 className="font-bold mb-2">Last Trades</h3>
          <ul className="space-y-2 text-sm">
            {history.map((trade, index) => (
              <li
                key={index}
                className={`p-3 rounded shadow-sm flex justify-between items-center ${
                  trade.result === 'Win' ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                <span className="font-medium">{trade.direction}</span>
                <span className="text-gray-600">{trade.entryPrice}</span>
                <span className="text-xs">{trade.time}</span>
                <span className={`font-semibold ${trade.result === 'Win' ? 'text-green-700' : 'text-red-700'}`}>
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