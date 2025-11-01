export async function getMarketPrice(symbol = 'BTCUSDT') {
  const url = `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`;

  try {
    console.log(`[getMarketPrice] Fetching market price for ${symbol} from Binance...`);

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',             
      next: { revalidate: 0 },    
    });

    if (!response.ok) {
      console.error(`[getMarketPrice] ❌ Binance responded with: ${response.status} ${response.statusText}`);
      throw new Error(`Binance API returned ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.price) {
      console.error('[getMarketPrice] ⚠️ Unexpected Binance data format:', data);
      throw new Error('Invalid Binance API response');
    }

    console.log(`[getMarketPrice] Market price for ${symbol}: ${data.price}`);
    return parseFloat(data.price);
  } catch (error) {
    console.error(`[getMarketPrice] Fetch error for ${symbol}:`, error.message);
    throw new Error('Could not fetch market price');
  }
}
