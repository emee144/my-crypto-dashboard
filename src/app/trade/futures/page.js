'use client';
import { useState, useEffect } from 'react';
import { useLivePrice } from '@/app/lib/hooks/useLivePrice';
import FuturesBalance from './futuresBalance';
import TradingViewWidget from '@/components/TradingViewWidget';
import TradePanel from '@/components/TradePanel';

export default function FuturesTrade() {
  const price = useLivePrice();
  const [trades, setTrades] = useState([]);
  const [balance, setBalance] = useState(null);

  const fetchBalanceAndTrades = async () => {
    try {
      const res = await fetch('/api/auth/balance-and-trades');
      if (!res.ok) throw new Error('Failed to fetch balance and trades');
      const data = await res.json();
      setTrades(data.trades || []);
      setBalance(data.balance || 0);
    } catch (error) {
      console.error("Error fetching balance and trades:", error);
    }
  };

  useEffect(() => {
    fetchBalanceAndTrades();
  }, []);

  return (
    <div className="p-4">
      {/* TradingView Widget */}
      <div className="mb-6 h-[400px] rounded overflow-hidden border">
        <TradingViewWidget />
      </div>

      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        BTC/USDT:
        {price ? (
          <span className="text-green-600">${price.toFixed(2)}</span>
        ) : (
          <span className="flex items-center gap-2 text-gray-500">
            <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-400" />
            Connecting to live feed...
          </span>
        )}
      </h2>

      <FuturesBalance balance={balance} />

      {/* 🚀 Trade panel */}
      <TradePanel price={price} fetchBalanceAndTrades={fetchBalanceAndTrades} />

      {/* 🧾 Open trades list */}
      {trades.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Open Trades</h3>
          <div className="space-y-2">
            {trades.map((t) => (
              <div key={t.id} className="border rounded p-2 bg-white">
                <p><strong>Direction:</strong> {t.direction}</p>
                <p><strong>Amount:</strong> {t.amount}</p>
                <p><strong>Entry Price:</strong> {t.entryPrice}</p>
                <p><strong>Expires:</strong> {new Date(t.expiryTime).toLocaleTimeString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}