import { getUserFromCookies } from '@/app/lib/cookieUtils';
import { Order } from '@/app/lib/sequelize';
import { getMarketPrice } from '@/app/lib/priceFetcher';
import { NextResponse } from 'next/server';
import { updateExpiredTrades } from '@/app/lib/updateTradeResults';

export async function POST(req) {
  try {
    const body = await req.json();
    const { asset, direction, amount, duration } = body;

    if (!asset || !direction || !amount || !duration) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const userData = await getUserFromCookies(); // You already have this
    if (!userData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const entryPrice = await getMarketPrice(asset);
    const now = new Date();
    const exitTime = new Date(now.getTime() + duration * 1000);

    const trade = await Order.create({
      userId: userData.id,
      asset,
      direction,
      entryPrice,
      amount,
      duration,
      entryTime: now,
      exitTime,
      result: 'PENDING',
    });

    return NextResponse.json({ message: 'Trade placed', trade });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
