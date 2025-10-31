import { NextResponse } from 'next/server';
import { connectDB, Order, Assets } from '@/app/lib/sequelize';
import { getUserFromCookies } from '@/app/lib/cookieUtils';
import { v4 as uuidv4 } from 'uuid';
import { getMarketPrice } from '@/app/lib/priceFetcher';

export async function POST(request) {
  try {
    await connectDB();

    const user = await getUserFromCookies();
    if (!user || !user.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { asset, direction, amount, duration } = body;

    if (!asset || !direction || !amount || !duration) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const entryPrice = await getMarketPrice(asset);
    const now = new Date();
    const expiryTime = new Date(now.getTime() + duration * 1000);

    const assets = await Assets.findOne({ where: { userId: user.userId } });
    if (!assets) {
      return NextResponse.json({ error: 'assets not found' }, { status: 404 });
    }

    // ✅ Check if user has enough in `trade`
    if (parseFloat(assets.trade) < parseFloat(amount)) {
      return NextResponse.json({ error: 'Insufficient trade balance' }, { status: 400 });
    }

    // ✅ Move amount from trade → moneyInTrades
    assets.trade = parseFloat(assets.trade) - parseFloat(amount);
    assets.moneyInTrades = parseFloat(assets.moneyInTrades) + parseFloat(amount);
    await assets.save();

    // ✅ Create trade order
    const trade = await Order.create({
      id: uuidv4(),
      userId: user.userId,
      asset,
      direction,
      entryPrice,
      amount: parseFloat(amount),
      entryTime: now,
      expiryTime,
      result: 'PENDING',
    });

    return NextResponse.json({
      message: 'Trade placed successfully',
      trade,
      updatedAssets: {
        trade: assets.trade,
        moneyInTrades: assets.moneyInTrades,
      },
    });

  } catch (err) {
    console.error('[Trade API] Error:', err);
    return NextResponse.json({ error: 'Server error', details: err.message }, { status: 500 });
  }
}
