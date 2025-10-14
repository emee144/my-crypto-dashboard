import { Order } from '@/app/lib/sequelize';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const Binance = require('node-binance-api');
  const binance = new Binance().options({
    APIKEY: process.env.BINANCE_API_KEY,
    APISECRET: process.env.BINANCE_API_SECRET
  });

  try {
    const { orderId, result } = req.body;

    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Example: Get current price for a symbol
    const priceData = await binance.futuresPrices();
    const currentPrice = priceData[order.symbol];

    // Your logic to determine win/loss and payout
    const win = result === 'WIN'; // just for example
    order.result = result;
    order.payout = win ? order.amount * 2 : 0;
    await order.save();

    res.status(200).json({ message: 'Order settled', order, price: currentPrice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}
