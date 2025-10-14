import { NextResponse } from 'next/server';
import { initModels } from '@/app/lib/models';
import { getUserFromCookies } from '@/app/lib/cookieUtils';

const { WithdrawalHistory, User } = initModels();

// GET: Retrieve withdrawal history for the authenticated user
export async function GET() {
  try {
    const user = await getUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const histories = await WithdrawalHistory.findAll({
      where: { userId: user.userId },
      include: {
        model: User,
        as: 'user',
        attributes: ['id', 'email'],
      },
      order: [['createdAt', 'DESC']],
    });

    return NextResponse.json({ data: histories }, { status: 200 });
  } catch (error) {
    console.error('GET /withdrawalhistory:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Create a new withdrawal history record
export async function POST(req) {
  try {
    const user = await getUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // Validate required fields
    const requiredFields = ['currency', 'amountAfterFee', 'chainName', 'withdrawalAddress'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    // Validate amount
    if (typeof body.amountAfterFee !== 'number' || body.amountAfterFee <= 0) {
      return NextResponse.json({ error: 'amountAfterFee must be a positive number' }, { status: 400 });
    }

    const validStatuses = ['pending', 'completed', 'failed'];
    const status = body.status && validStatuses.includes(body.status) ? body.status : 'pending';

    const newHistory = await WithdrawalHistory.create({
      userId: user.userId,
      currency: body.currency,
      amountAfterFee: body.amountAfterFee,
      chainName: body.chainName,
      withdrawalAddress: body.withdrawalAddress,
      status,
    });

    return NextResponse.json(newHistory, { status: 201 });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error('POST /withdrawalhistory:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
