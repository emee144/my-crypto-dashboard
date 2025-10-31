// app/api/auth/balance-and-trades/route.js
import { NextResponse } from 'next/server';
import { connectDB, Assets, Order } from '@/app/lib/sequelize';
import { getUserFromCookies } from '@/app/lib/cookieUtils';
import { updateExpiredTrades } from '@/app/lib/updateTradeResults';

export async function GET(req) {
  try {
    // Connect to DB
    await connectDB();

    // Get current user
    const user = await getUserFromCookies();
    if (!user || !user.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Settle any expired trades before calculating balances
    const { settledTrades } = await updateExpiredTrades();

    // Fetch user's assets
    let assets = await Assets.findOne({ where: { userId: user.userId } });
    if (!assets) {
      // If assets don't exist, create minimal zeroed record (no hardcoded trade balance)
      assets = await Assets.create({
        userId: user.userId,
        trade: 0,
        moneyInTrades: 0,
        exchange: 0,
        perpetual: 0,
        assetType: 'USDT',
        assetName: ''
      });
    }

    // Fetch active trades (PENDING)
    const tradeList = await Order.findAll({
      where: { userId: user.userId, result: 'PENDING' },
      order: [['expiryTime', 'DESC']],
    });

    // Calculate moneyInTrades based on active trades
    const moneyInTrades = tradeList.reduce((sum, t) => sum + parseFloat(t.amount), 0);

    // Return structured JSON
    return NextResponse.json({
      assets: {
        BTCUSDT: {
          trade: parseFloat(assets.trade),
          moneyInTrades: moneyInTrades
        },
        exchange: parseFloat(assets.exchange),
        perpetual: parseFloat(assets.perpetual)
      },
      tradeList: tradeList.map(t => ({
        id: t.id,
        asset: t.asset,
        direction: t.direction,
        amount: parseFloat(t.amount),
        entryPrice: parseFloat(t.entryPrice),
        entryTime: t.entryTime,
        expiryTime: t.expiryTime,
        result: t.result
      })),
      settled: settledTrades || []
    });

  } catch (err) {
    console.error('[Balance and Trades API] Error:', err);
    return NextResponse.json({ error: 'Server error', details: err.message }, { status: 500 });
  }
}
