// app/api/candles/route.js

export async function GET(req) {
    const url = new URL(req.url);
    const days = url.searchParams.get('days') || '1';  // Default to 1 day if not provided

    // CoinGecko API Key
    const apiKey = process.env.COINGECKO_API_KEY; // Ensure you have this in your environment variables
    if (!apiKey) {
        console.error('CoinGecko API key is missing');  // Debug: Log if API key is missing
        return new Response(JSON.stringify({ error: 'CoinGecko API key is missing' }), { status: 500 });
    }

    // Construct the CoinGecko API URL for OHLC data (candlestick data)
    const apiUrl = `https://api.coingecko.com/api/v3/coins/bitcoin/ohlc?vs_currency=usd&days=${days}&x_cg_demo_api_key=${apiKey}`;

    console.log(`Fetching data from CoinGecko: ${apiUrl}`);  // Debug: Log the URL

    try {
        const res = await fetch(apiUrl);

        if (!res.ok) {
            const errorText = await res.text(); // Get the response body text to debug
            console.error('CoinGecko fetch failed: ', errorText); // Log the error response
            throw new Error(`Failed to fetch candlestick data from CoinGecko: ${errorText}`);
        }

        const data = await res.json();
        console.log('CoinGecko response data:', data);  // Debug: Log the response data

        if (!data || data.length === 0) {
            throw new Error('No candlestick data found in the response');
        }

        // Convert and prepare the candlestick data in a readable format
        const candles = data.map(([timestamp, open, high, low, close]) => ({
            time: new Date(timestamp).toLocaleString(),  // Convert timestamp to human-readable format
            open: open,
            high: high,
            low: low,
            close: close
        }));

        return new Response(JSON.stringify(candles), { status: 200 });
    } catch (error) {
        console.error('Error: ', error.message);  // Log the error message
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
