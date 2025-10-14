// src/app/lib/hooks/useLivePrice.js
import { useEffect, useState } from 'react';

export function useLivePrice(symbol = 'btcusdt') {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@trade`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPrice(parseFloat(data.p));
    };
    return () => ws.close();
  }, [symbol]);

  return price;
}
