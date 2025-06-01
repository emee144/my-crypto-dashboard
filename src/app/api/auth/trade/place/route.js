import { NextResponse } from 'next/server';
import { connectDB, Order } from '@/lib/sequelize';
import { getUserFromCookies } from '@/app/lib/cookieUtils';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    await connectDB();

    // 🔐 Extract user from JWT in cookies
    const user = await getUserFromCookies();
    if (!user || !user.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 📥 Get order data
    const data = await request.json();
    const { asset = 'BTCUSDT', direction, entryPrice, expiryTime, amount } = data;

    // Validate input
    if (!['CALL', 'PUT'].includes(direction)) {
      return NextResponse.json({ error: 'Invalid direction' }, { status: 400 });
    }
    if (!entryPrice || !expiryTime || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const expiryDate = new Date(expiryTime);
    if (isNaN(expiryDate.getTime())) {
      return NextResponse.json({ error: 'Invalid expiryTime' }, { status: 400 });
    }

    // Save to DB
    const newOrder = await Order.create({
      id: uuidv4(),
      userId: user.userId,
      asset,
      direction,
      entryPrice: parseFloat(entryPrice),
      expiryTime: expiryDate,
      amount: parseFloat(amount),
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (err) {
    console.error('Order error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
