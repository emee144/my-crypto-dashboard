// fakeTradingEngine.js

// Start a "trade" and resolve after 1 minute
export function simulateTrade(type, entryPrice) {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const latestPrice = await fetchLatestPrice();
        
        if (type === 'CALL') {
          resolve(latestPrice > entryPrice ? 'win' : 'lose');
        } else {
          resolve(latestPrice < entryPrice ? 'win' : 'lose');
        }
      }, 60000); // 1 minute
    });
  }
  
  async function fetchLatestPrice(symbol = 'BTCUSDT') {
    const url = `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`;
    const res = await fetch(url);
    const data = await res.json();
    return parseFloat(data.price);
  }
  