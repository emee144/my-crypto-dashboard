import { NextResponse } from 'next/server';
import { getUserFromCookies } from '@/app/lib/cookieUtils';
import { initModels } from '@/app/lib/models';
const {DepositHistory, User} = initModels();

export async function GET(req) {
  try {
    const user = await getUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const depositHistory = await DepositHistory.findAll({
      where: { userId: user.userId },
       
      include: [{ model: User, as: 'user' }],
      order: [['depositDate', 'DESC']],
      attributes: [
        'id',
        'depositAmount',
        'chainName',
        'currency',
        'status',
        'depositDate',
        'createdAt',
        'updatedAt',
      ],
    });

    return NextResponse.json({ deposits: depositHistory });
  } catch (error) {
    console.error('Deposit history fetch error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
