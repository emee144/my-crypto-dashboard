import { NextResponse } from 'next/server';
import { connectDB, Order, Assets } from '@/app/lib/sequelize';
import { getUserFromCookies } from '@/app/lib/cookieUtils';
import { v4 as uuidv4 } from 'uuid';
import { getMarketPrice } from '@/app/lib/priceFetcher';

export async function POST(request) {
  try {
    console.log('[Trade API]  Connecting to database...');
    await connectDB();

    console.log('[Trade API] Checking user from cookies...');
    const user = await getUserFromCookies();
    console.log('[Trade API] User from cookies:', user);

    if (!user || !user.userId) {
      console.warn('[Trade API]  Unauthorized access — no user found.');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[Trade API]  Parsing request body...');
    const body = await request.json();
    console.log('[Trade API] Request body:', body);

    const { asset, direction, amount, duration } = body;

    if (!asset || !direction || !amount || !duration) {
      console.warn('[Trade API] ⚠️ Missing fields:', { asset, direction, amount, duration });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log(`[Trade API]  Fetching market price for ${asset}...`);
    const entryPrice = await getMarketPrice(asset);
    console.log('[Trade API] Market price fetched:', entryPrice);

    if (!entryPrice || isNaN(entryPrice)) {
      console.error('[Trade API] ❌ Invalid entry price returned:', entryPrice);
      return NextResponse.json({ error: 'Invalid market price' }, { status: 400 });
    }

    const now = new Date();
    const expiryTime = new Date(now.getTime() + duration * 1000);
    console.log('[Trade API]  Entry & expiry time:', { entryTime: now, expiryTime });

    console.log('[Trade API]  Checking user assets...');
    const assets = await Assets.findOne({ where: { userId: user.userId } });
    console.log('[Trade API] Assets found:', assets ? true : false);

    if (!assets) {
      console.error('[Trade API] ❌ No assets found for user:', user.userId);
      return NextResponse.json({ error: 'Assets not found' }, { status: 404 });
    }

    console.log('[Trade API] 💰 Checking trade balance...');
    if (parseFloat(assets.trade) < parseFloat(amount)) {
      console.warn('[Trade API] ❌ Insufficient balance:', {
        current: assets.trade,
        required: amount
      });
      return NextResponse.json({ error: 'Insufficient trade balance' }, { status: 400 });
    }

    console.log('[Trade API] 🔄 Updating assets (move trade → moneyInTrades)...');
    assets.trade = parseFloat(assets.trade) - parseFloat(amount);
    assets.moneyInTrades = parseFloat(assets.moneyInTrades) + parseFloat(amount);
    await assets.save();
    console.log('[Trade API]  Assets updated:', {
      trade: assets.trade,
      moneyInTrades: assets.moneyInTrades
    });

    console.log('[Trade API] Creating new order record...');
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

    console.log('[Trade API]  Trade created successfully:', trade.id);

    return NextResponse.json({
      message: 'Trade placed successfully',
      trade,
      updatedAssets: {
        trade: assets.trade,
        moneyInTrades: assets.moneyInTrades,
      },
    });

  } catch (err) {
    console.error('[Trade API] 💥 Error placing trade:', err);
    return NextResponse.json(
      { error: 'Server error', details: err.message },
      { status: 500 }
    );
  }
}
