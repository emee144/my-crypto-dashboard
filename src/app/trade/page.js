'use client';
import { useState } from 'react';
import Futures from './futures/page.js';
import Spot from './spot/page.js';
import TradingViewWidget from '@/components/TradingViewWidget'; // ✅

export default function TradingPage() {
  const [selectedTradeType, setSelectedTradeType] = useState('spot');

  const renderTradeSection = () => {
    if (selectedTradeType === 'spot') {
      return <Spot />;
    } else if (selectedTradeType === 'futures') {
      return <Futures />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Live Trading</h1>

      {/* Toggle between Spot and Futures */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setSelectedTradeType('spot')}
          className={`px-6 py-2 rounded-lg ${selectedTradeType === 'spot' ? 'bg-blue-600' : 'bg-gray-600'}`}
        >
          Spot Trading
        </button>
        <button
          onClick={() => setSelectedTradeType('futures')}
          className={`px-6 py-2 rounded-lg ${selectedTradeType === 'futures' ? 'bg-blue-600' : 'bg-gray-600'}`}
        >
          Futures Trading
        </button>
      </div>

      {/* Render Spot or Futures Section */}
      <div className="w-full mb-4">
        {renderTradeSection()}
      </div>

      {/* Display TradingView Chart if Spot is selected */}
      {selectedTradeType === 'spot' && (
        <div className="w-full">
          <TradingViewWidget />
        </div>
      )}
    </div>
  );
}