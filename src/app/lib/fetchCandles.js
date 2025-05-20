export async function fetchCandles() {
    const res = await fetch('/api/auth/candles');
  
    if (!res.ok) {
      throw new Error('Failed to fetch candlestick data');
    }
  
    return await res.json();
  }
  