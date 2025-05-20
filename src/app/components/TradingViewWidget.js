'use client';
import { useEffect, useRef } from 'react';

export default function TradingViewWidget() {
  const container = useRef(null);

  useEffect(() => {
    if (container.current) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        new window.TradingView.widget({
          autosize: true,
          symbol: "BINANCE:BTCUSDT", // Default symbol
          interval: "1", // 1-minute candles
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1", // 1 = candlestick
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          container_id: "tradingview-chart",
        });
      };
      container.current.appendChild(script);
    }
  }, []);

  return (
    <div
      id="tradingview-chart"
      ref={container}
      style={{ height: '500px', width: '100%' }}
    />
  );
}
