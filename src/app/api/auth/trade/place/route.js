import { NextResponse } from 'next/server';
import { connectDB, Order } from '@/lib/sequelize';
import { getUserFromCookies } from '@/app/lib/cookieUtils';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    console.log('[Trade API] Connecting to DB...');
    await connectDB();

    // 🔐 Get user from cookies
    const user = await getUserFromCookies();
    console.log('[Trade API] User:', user);

    if (!user || !user.userId) {
      console.warn('[Trade API] Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 📥 Parse trade data from request
    const data = await request.json();
    console.log('[Trade API] Received data:', data);

    const { asset = 'BTCUSDT', direction, entryPrice, expiryTime, amount } = data;

    if (!['CALL', 'PUT'].includes(direction)) {
      console.warn('[Trade API] Invalid direction:', direction);
      return NextResponse.json({ error: 'Invalid direction' }, { status: 400 });
    }

    if (!entryPrice || !expiryTime || !amount) {
      console.warn('[Trade API] Missing fields:', { entryPrice, expiryTime, amount });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const expiryDate = new Date(expiryTime);
    if (isNaN(expiryDate.getTime())) {
      console.warn('[Trade API] Invalid expiry date:', expiryTime);
      return NextResponse.json({ error: 'Invalid expiryTime' }, { status: 400 });
    }

    // 💾 Save trade
    const newOrder = await Order.create({
      id: uuidv4(),
      userId: user.userId,
      asset,
      direction,
      entryPrice: parseFloat(entryPrice),
      expiryTime: expiryDate,
      amount: parseFloat(amount),
    });

    console.log('[Trade API] Order created:', newOrder.toJSON());

    return NextResponse.json({
      id: newOrder.id,
      direction: newOrder.direction,
      entryPrice: newOrder.entryPrice,
      amount: newOrder.amount,
      expiryTime: newOrder.expiryTime,
    }, { status: 201 });

  } catch (err) {
    console.error('[Trade API] Server error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}