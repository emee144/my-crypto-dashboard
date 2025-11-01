export async function getMarketPrice(symbol = 'BTCUSDT') {
  try {
    const response = await fetch(`https://api.coinbase.com/v2/prices/${symbol.replace('USDT', '-USD')}/spot`);
    if (!response.ok) throw new Error('Failed to fetch market price');

    const data = await response.json();
    return parseFloat(data.data.amount);
  } catch (error) {
    console.error('[getMarketPrice] Fetch error:', error);
    throw new Error('Could not fetch market price');
  }
}
