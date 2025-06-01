import { getUserFromCookies } from '@/app/lib/cookieUtils';
import { Order } from '@/app/lib/sequelize';
import { NextResponse } from 'next/server';
import { getUserTotalBalance } from '@/app/lib/dbHelpers'; // or whatever file it's in

export async function GET(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const user = await getUserFromCookies(token);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Get total balance from your assets table/model for this user
    // This depends on your DB setup — example:
    const totalBalance = await getUserTotalBalance(user.userId); // you implement this

    // Get all open futures trades with amount (result: 'PENDING')
    const openTrades = await Order.findAll({
      where: { userId: user.userId, result: 'PENDING' },
      attributes: ['id', 'amount'],
    });

    return NextResponse.json({
      totalBalance,
      openTrades,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
