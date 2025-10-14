// src/app/lib/updateTradeResults.js
import { Order } from '@/app/lib/sequelize';
import { getMarketPrice } from '@/app/lib/priceFetcher';
import { Op } from 'sequelize';

export async function updateExpiredTrades() {
  const now = new Date();
  const trades = await Order.findAll({
    where: {
      result: 'PENDING',
      exitTime: { [Op.lte]: now },
    },
  });

  for (let trade of trades) {
    const exitPrice = await getMarketPrice(trade.asset);
    let win = false;

    if (trade.direction === 'UP') {
      win = exitPrice > trade.entryPrice;
    } else {
      win = exitPrice < trade.entryPrice;
    }

    trade.exitPrice = exitPrice;
    trade.result = win ? 'WIN' : 'LOSE';
    await trade.save();
  }

  return trades.length;
}
