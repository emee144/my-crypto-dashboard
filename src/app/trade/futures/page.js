'use client';
import { useState, useEffect } from 'react';
import { useLivePrice } from '@/app/lib/hooks/useLivePrice';
import FuturesBalance from './futuresBalance';
import TradingViewWidget from '@/components/TradingViewWidget';

export default function FuturesTrade() {
  const price = useLivePrice();
  const [timeLeft, setTimeLeft] = useState(0);
  const [order, setOrder] = useState(null);

  const placeOrder = async (direction) => {
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    const res = await fetch('/api/auth/trade/place', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ direction, price, expiry, amount: 10 }),
    });

    const data = await res.json();
    setOrder({ ...data, countdown: 300 }); // 300 seconds countdown
  };

  useEffect(() => {
    if (!order || order.countdown <= 0) return;

    const timer = setInterval(() => {
      setOrder((prev) => {
        if (!prev || prev.countdown <= 1) {
          clearInterval(timer);
          return null;
        }
        return { ...prev, countdown: prev.countdown - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [order]);

  return (
    <div className="p-4">
      {/* ✅ TradingView Widget */}
      <div className="mb-6 h-[400px] rounded overflow-hidden border">
        <TradingViewWidget />
      </div>

      <h2 className="text-xl font-bold mb-2">
        BTC/USDT: {price ? price.toFixed(2) : 'Loading...'}
      </h2>

      {/* ✅ Futures balance displayed here */}
      <FuturesBalance />

      <div className="my-4">
        <button
          onClick={() => placeOrder('CALL')}
          className="bg-green-500 text-white px-4 py-2 m-2 rounded"
        >
          CALL
        </button>
        <button
          onClick={() => placeOrder('PUT')}
          className="bg-red-500 text-white px-4 py-2 m-2 rounded"
        >
          PUT
        </button>
      </div>

      {order && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <p><strong>Order:</strong> {order.direction}</p>
          <p><strong>Entry Price:</strong> {order.entryPrice}</p>
          <p><strong>Time Left:</strong> {order.countdown}s</p>
        </div>
      )}
    </div>
  );
}
