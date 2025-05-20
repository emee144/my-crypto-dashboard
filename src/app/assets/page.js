'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function AssetsPage() {
  const [assets, setAssets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accountType, setAccountType] = useState('real'); // "real" or "demo"

  useEffect(() => {
    if (accountType === 'real') {
      const fetchAssets = async () => {
        try {
          const res = await fetch("http://localhost:3000/api/auth/assets", {
            cache: "no-store",
          });
          const data = await res.json();
          setAssets(data);
        } catch (error) {
          console.error("Error fetching assets:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchAssets();
    } else {
      setLoading(false);
    }
  }, [accountType]);

  if (loading) {
    return <div className="text-center py-10 text-white">Loading assets...</div>;
  }

  // Demo account assets with perpetual set to 0, and exchange/trade set to 500,000
  const demoAssets = {
    exchange: 500000,
    trade: 500000,
    perpetual: 0
  };

  const currentAssets = accountType === 'real' ? assets : demoAssets;

  const exchange = parseFloat(currentAssets?.exchange) || 0;
  const trade = parseFloat(currentAssets?.trade) || 0;
  const perpetual = parseFloat(currentAssets?.perpetual) || 0;

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col p-6 text-white pb-24"> {/* Add bottom padding */}
      <h1 className="text-2xl font-bold mb-6">Assets</h1>

      <div className="bg-orange-500 p-4 rounded-2xl mb-6 shadow-lg">
        <div className="flex gap-3 flex-wrap">
          {["Withdraw", "Deposit", "Transfer", "Convert"].map((label) => (
            <Link
              key={label}
              href={`/assets/${label.toLowerCase()}`}
              passHref
            >
              <button
                className="bg-white text-black px-4 py-2 rounded-xl font-medium hover:bg-gray-200 transition"
                style={{ cursor: 'pointer' }}
              >
                {label}
              </button>
            </Link>
          ))}
        </div>
      </div>

      {/* Account Type Toggle */}
      <div className="flex justify-center gap-6 mb-6">
        <button
          onClick={() => setAccountType('real')}
          className={`px-4 py-2 rounded-xl font-medium transition ${accountType === 'real' ? 'bg-green-500 text-white' : 'bg-gray-500 text-black'}`}
        >
          Real Account
        </button>
        <button
          onClick={() => setAccountType('demo')}
          className={`px-4 py-2 rounded-xl font-medium transition ${accountType === 'demo' ? 'bg-green-500 text-white' : 'bg-gray-500 text-black'}`}
        >
          Demo Account
        </button>
      </div>

      <div className="bg-gray-800 p-5 rounded-2xl shadow-md">
        <div className="text-sm mb-1">
          Current Account: <span className="text-green-400">{accountType === 'real' ? 'Real Account' : 'Demo Account'}</span>
        </div>
        <div className="text-xs text-gray-400 mb-5">
          {accountType === 'real'
            ? 'Real account is equivalent to actual account and can be used for trading and withdrawals.'
            : 'Demo account has a constant balance of 500,000 for exchange and trade, and 0 for perpetual.'}
        </div>

        {/* Force 2 columns from small screens and up */}
        <div className="flex flex-wrap gap-6 text-center">
  <div className="p-4 bg-gray-700 rounded-xl shadow-md flex-1 min-w-[45%]">
    <div className="text-2xl font-semibold text-white break-words">{exchange.toFixed(2)}</div>
    <div className="text-sm text-gray-400 mt-1">Exchange</div>
  </div>
  <div className="p-4 bg-gray-700 rounded-xl shadow-md flex-1 min-w-[45%]">
    <div className="text-2xl font-semibold text-white break-words">{trade.toFixed(2)}</div>
    <div className="text-sm text-gray-400 mt-1">Trade</div>
  </div>
  <div className="p-4 bg-gray-700 rounded-xl shadow-md w-full">
    <div className="text-2xl font-semibold text-white break-words">{perpetual.toFixed(2)}</div>
    <div className="text-sm text-gray-400 mt-1">Perpetual</div>
  </div>
</div>

      </div>
    </div>
  );
}
