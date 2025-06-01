export async function getMarketPrice(symbol = 'BTCUSDT') {
  try {
    const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
    if (!response.ok) throw new Error('Failed to fetch market price');

    const data = await response.json();
    return parseFloat(data.price);
  } catch (error) {
    console.error('Market price fetch error:', error);
    throw new Error('Could not fetch market price');
  }
}
