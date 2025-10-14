'use client'; // important in Next.js 13+ app router

import { useEffect, useRef } from 'react';

export default function Spot() {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        new window.TradingView.widget({
          width: '100%',
          height: 500,
          symbol: 'BINANCE:BTCUSDT', // Example: Bitcoin/USDT from Binance
          interval: '1',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1', // Candlestick style
          locale: 'en',
          toolbar_bg: '#000000',
          enable_publishing: false,
          hide_top_toolbar: false,
          hide_legend: false,
          container_id: 'tradingview_chart',
        });
      };
      chartContainerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className="w-full">
      <div
        id="tradingview_chart"
        ref={chartContainerRef}
        style={{ width: '100%', height: '500px' }}
      />
    </div>
  );
}
