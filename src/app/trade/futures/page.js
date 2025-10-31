'use client';
import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useLivePrice } from '@/app/lib/hooks/useLivePrice';
import TradingViewWidget from '@/components/TradingViewWidget';

export default function FuturesTrade() {
  const price = useLivePrice();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [tradeList, setTradeList] = useState([]);
  const [assets, setAssets] = useState({});
  const [amount, setAmount] = useState(10);
  const [duration, setDuration] = useState(10);
  const asset = 'BTCUSDT';

  const formatCountdown = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  // fetch assets and trades
  const fetchTradesAndAssets = async () => {
    try {
      const res = await fetch('/api/auth/balance-and-trades');
      const data = await res.json();
      if (data.assets) setAssets(data.assets);
      if (data.tradeList) setTradeList(data.tradeList);
      return data;
    } catch (err) {
      console.error('Error fetching trades and assets:', err);
      return null;
    }
  };

  useEffect(() => {
    fetchTradesAndAssets();
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

  const placeOrder = async (direction) => {
    if (!price || isNaN(price)) return alert('Price not available');
    if (!amount || !duration) return alert('Amount and duration required');
    if (order?.countdown > 0) return alert('Wait for current order to finish');

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/auth/trade/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asset, direction, amount, duration }),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.error || 'Failed to place order');

      const backendTrade = data.trade;
      const remainingSeconds = Math.max(
        Math.floor((new Date(backendTrade.expiryTime) - Date.now()) / 1000),
        0
      );
      const newOrder = { ...backendTrade, countdown: remainingSeconds, uuid: uuidv4() };
      setOrder(newOrder);
      localStorage.setItem('activeOrder', JSON.stringify(newOrder));

      // sync with backend assets (in case of mismatch)
      if (data.updatedAssets) {
        setAssets((prev) => ({
          ...prev,
          [asset]: {
            trade: data.updatedAssets.trade,
            moneyInTrades: data.updatedAssets.moneyInTrades,
          },
        }));
      }
    } catch (err) {
      console.error(err);
      alert('Error placing order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!order || order.countdown <= 0) return;

    const timer = setInterval(() => {
      setOrder((prev) => {
        if (!prev) return null;

        if (prev.countdown <= 1) {
          clearInterval(timer);
          // Ask backend to settle and return authoritative balances and outcomes
          (async () => {
            const data = await fetchTradesAndAssets();
            let finalResult = null;
            if (data && Array.isArray(data.settled)) {
              const settledThis = data.settled.find((s) => s.id === prev.id);
              if (settledThis) {
                finalResult = settledThis.result === 'WIN' ? 'Win' : 'Lose';
              }
            }

            if (finalResult) {
              setResult(finalResult);
              const newTrade = {
                uuid: prev.uuid,
                direction: prev.direction,
                amount: prev.amount,
                entryPrice: prev.entryPrice,
                result: finalResult,
                time: new Date().toLocaleTimeString(),
              };
              setHistory((prevHistory) => {
                const updated = [newTrade, ...prevHistory];
                localStorage.setItem('tradeHistory', JSON.stringify(updated));
                return updated;
              });
            }

            localStorage.removeItem('activeOrder');
            setOrder(null);
          })();
          return null;
        }

        return { ...prev, countdown: prev.countdown - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [order]);

  const currentAsset = assets[asset] || { trade: 0, moneyInTrades: 0 };

  return (
    <div className="flex flex-col gap-6 px-4 py-4 md:px-8 md:py-6">
      <div className="w-full rounded overflow-hidden border mb-4 h-[300px] md:h-[400px]">
        <TradingViewWidget />
      </div>

      <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
        {asset}:{' '}
        {price ? (
          <span className="text-green-500">${price.toFixed(2)}</span>
        ) : (
          <span className="text-gray-400 flex items-center gap-2">
            <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-400" />
            Connecting...
          </span>
        )}
      </h2>

      <div className="flex gap-6 text-white">
        <p>Trade: ${Number(currentAsset.trade).toFixed(2)}</p>
        <p>Money in Trades: ${Number(currentAsset.moneyInTrades).toFixed(2)}</p>
      </div>

      <div className="flex gap-4 justify-center mb-4">
        <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} placeholder="Amount" className="px-3 py-2 rounded text-white w-24" />
        <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} placeholder="Duration (sec)" className="px-3 py-2 rounded text-white w-24" />
      </div>

      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <button onClick={() => placeOrder('CALL')} disabled={loading || order?.countdown > 0} className={`flex items-center gap-2 px-6 py-3 rounded font-semibold shadow transition text-white ${loading || order?.countdown > 0 ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}><ArrowUpRight className="w-5 h-5" /> CALL</button>
        <button onClick={() => placeOrder('PUT')} disabled={loading || order?.countdown > 0} className={`flex items-center gap-2 px-6 py-3 rounded font-semibold shadow transition text-white ${loading || order?.countdown > 0 ? 'bg-red-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}><ArrowDownRight className="w-5 h-5" /> PUT</button>
      </div>

      {loading && <p className="text-center text-sm text-gray-400 mb-4">Placing order...</p>}

      {order && (
        <div className={`p-4 rounded shadow-md text-sm mb-6 ${order.direction === 'CALL' ? 'bg-green-800 border-l-4 border-green-400' : 'bg-red-800 border-l-4 border-red-400'}`}>
          <p><span className="font-medium">Order:</span> <span className="font-bold">{order.direction}</span></p>
          <p><span className="font-medium">Amount:</span> {order.amount} USDT</p>
          <p><span className="font-medium">Entry Price:</span> {order.entryPrice}</p>
          <p><span className="font-medium">Time Left:</span> {formatCountdown(order.countdown)}</p>
        </div>
      )}

      {/* Trade Result, History, and Stylish Recent Trades Card */}
      {result && (
        <div className={`p-4 rounded shadow text-center font-semibold mb-20 ${result === 'Win' ? 'bg-green-500' : 'bg-red-500'}`}>
          You {result} the trade!
        </div>
      )}

      {history.length > 0 && (
        <div className="mb-32 shadow-lg rounded-lg bg-white/90 dark:bg-gray-900/80 p-4 border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-3-3h-4M9 17v1a3 3 0 003 3h2a3 3 0 003-3v-1m-4-5v2m0-2a2 2 0 11-4 0v0a2 2 0 014 0zm4 0v2a2 2 0 104 0v-2a2 2 0 10-4 0z" /></svg>
            Recent Trades
          </h3>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {history.map((t, i) => (
              <li key={t.uuid ? `${t.uuid}-${i}` : i} className="py-4 pr-6 w-full flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 min-w-[250px] max-w-full">
                <div className={`w-10 h-10 flex items-center justify-center rounded-full shadow shrink-0 ${t.result === 'Win' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {t.result === 'Win' ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center flex-1 gap-1 sm:gap-4">
                  <span className="font-bold text-base text-gray-800 dark:text-gray-100 min-w-12">{t.direction}</span>
                  <span className="text-xs text-gray-400 min-w-20">[{t.time}]</span>
                  <span className="text-blue-700 dark:text-blue-300 font-semibold text-sm min-w-20">{t.amount} USDT</span>
                  <span className="text-gray-600 dark:text-gray-400 text-xs min-w-24">@ {t.entryPrice}</span>
                  <span className={`px-3 py-1 rounded-full text-xs ml-2 font-bold tracking-wider ${t.result === 'Win' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>{t.result}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Remove any <table> and render using this for your stats or trade data (example): */}
      {tradeList && tradeList.length > 0 && (
        <div className="mb-10 w-full max-w-3xl mx-auto shadow-lg rounded-lg bg-white/95 dark:bg-gray-900/90 p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01"/></svg>
            Open Trades
          </h3>
          <ul className="flex flex-col gap-4">
            {tradeList.map((t, i) => (
              <li key={t.id || i} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-7 px-5 py-4 border rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm">
                {/* Direction with badge */}
                <div className={`font-bold text-base flex items-center gap-2 min-w-14 ${t.direction === 'CALL' ? 'text-green-700' : 'text-red-700'}`}> 
                  {t.direction} 
                  <span className={`inline-block px-2 py-0.5 text-xs rounded-full ml-1 ${t.direction === 'CALL' ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'}`}>{t.direction}</span>
                </div>
                {/* Time info */}
                <div className="text-xs text-gray-500 flex gap-2 items-center min-w-24">
                  <span className="">{t.entryTime ? new Date(t.entryTime).toLocaleTimeString() : ''}</span>
                  <span className="mx-1 text-gray-400">/</span>
                  <span className="">{t.expiryTime ? new Date(t.expiryTime).toLocaleTimeString() : ''}</span>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {/* Amount */}
                  <span className="text-blue-700 dark:text-blue-300 font-semibold text-sm min-w-20">{t.amount} USDT</span>
                  {/* Entry price */}
                  <span className="text-gray-700 dark:text-gray-200 text-xs min-w-24">@ {t.entryPrice}</span>
                  {/* Result */}
                  <span className={`px-3 py-1 rounded-full text-xs ml-2 font-bold tracking-wider capitalize ${t.result === 'WIN' ? 'bg-green-200 text-green-800' : t.result === 'LOSE' ? 'bg-red-200 text-red-800' : 'bg-blue-200 text-blue-800'}`}>{t.result || 'Pending'}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
