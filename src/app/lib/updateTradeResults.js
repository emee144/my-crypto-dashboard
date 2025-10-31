import { Order, Assets, sequelize } from '@/app/lib/sequelize';
import { getMarketPrice } from '@/app/lib/priceFetcher';
import { Op } from 'sequelize';

export async function updateExpiredTrades() {
  const now = new Date();

  const trades = await Order.findAll({
    where: {
      result: 'PENDING',
      expiryTime: { [Op.lte]: now },
    },
  });

  let count = 0;
  const settledTrades = [];

  for (const trade of trades) {
    const t = await sequelize.transaction();
    try {
      const assets = await Assets.findOne({ where: { userId: trade.userId }, transaction: t });
      if (!assets) {
        await t.rollback();
        continue;
      }

      const exitPrice = await getMarketPrice(trade.asset);
      const win = trade.direction === 'CALL'
        ? exitPrice > trade.entryPrice
        : exitPrice < trade.entryPrice;

      // Update trade record
      trade.exitPrice = exitPrice;
      trade.result = win ? 'WIN' : 'LOSE';
      trade.payout = win ? trade.amount * 2 : 0;
      await trade.save({ transaction: t });

      // Release locked money
      assets.moneyInTrades = Math.max(0, parseFloat(assets.moneyInTrades) - parseFloat(trade.amount));

      // Only credit payout if won
      if (win) {
        assets.trade = parseFloat(assets.trade) + parseFloat(trade.payout);
        console.log(`[updateExpiredTrades] WIN - Crediting payout. Asset trade new value:`, assets.trade);
      } else {
        console.log(`[updateExpiredTrades] LOSE - No payout, trade remains:`, assets.trade);
      }

      await assets.save({ transaction: t });

      await t.commit();
      count++;
      settledTrades.push({
        id: trade.id,
        userId: trade.userId,
        asset: trade.asset,
        direction: trade.direction,
        amount: parseFloat(trade.amount),
        entryPrice: parseFloat(trade.entryPrice),
        exitPrice: parseFloat(exitPrice),
        result: trade.result,
        payout: parseFloat(trade.payout)
      });
    } catch (err) {
      await t.rollback();
      console.error('[updateExpiredTrades] Failed for trade', trade.id, err);
    }
  }

  return { count, settledTrades };
}
