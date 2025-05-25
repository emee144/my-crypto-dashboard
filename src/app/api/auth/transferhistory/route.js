import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { sequelize } from '@/lib/sequelize';
import { initModels } from '@/lib/models';

const { TransferHistory } = initModels(sequelize);

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('jwt')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const userId = decoded.userId;

    const history = await TransferHistory.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error('Error fetching transfer history:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
