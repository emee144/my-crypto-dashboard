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
    <div className="flex flex-col gap-6 px-4 py-4 md:px-8 md:py-6">

      {/* TradingView Widget */}
      <div className="w-full rounded overflow-hidden border mb-4 h-[300px] md:h-[400px]">
        <TradingViewWidget />
      </div>

      {/* Live Price */}
      <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
        BTC/USDT:
        {price ? (
          <span className="text-green-500">${price.toFixed(2)}</span>
        ) : (
          <span className="flex items-center gap-2 text-gray-400">
            <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-400" />
            Connecting...
          </span>
        )}
      </h2>

      {/* Futures Balance */}
      <FuturesBalance balance={balance} />

      {/* Trade Panel */}
      <TradePanel price={price} fetchBalanceAndTrades={fetchBalanceAndTrades} />

      {/* Open Trades */}
      {trades.length > 0 && (
        <div>
          <h3 className="text-md md:text-lg font-semibold mb-2">Open Trades</h3>
          <div className="flex flex-col gap-2">
            {trades.map((t) => (
              <div key={t.id} className="border rounded p-2 bg-white text-black">
                <p><strong>Direction:</strong> {t.direction}</p>
                <p><strong>Amount:</strong> {t.amount}</p>
                <p><strong>Entry Price:</strong> {t.entryPrice}</p>
                <p><strong>Expires:</strong> {new Date(t.expiryTime).toLocaleTimeString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Extra bottom padding to avoid footer overlap */}
      <div className="h-20 md:h-32"></div>
    </div>
  );
}
