import { NextResponse } from 'next/server';
import { WithdrawalPassword } from '@/app/lib/sequelize';
import { getUserFromCookies } from '@/app/lib/cookieUtils';

export async function POST(req) {
  try {
    const user = await getUserFromCookies(req);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = user;
    const { withdrawalPassword, isUpdate = false } = await req.json();

    if (!withdrawalPassword || withdrawalPassword.trim().length < 6) {
      return NextResponse.json(
        { message: 'Withdrawal password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const existingPassword = await WithdrawalPassword.findOne({ where: { userId } });

    if (existingPassword) {
      if (isUpdate) {
        existingPassword.withdrawalPassword = withdrawalPassword;
        await existingPassword.save();
        return NextResponse.json({ message: 'Withdrawal password updated successfully' }, { status: 200 });
      } else {
        return NextResponse.json({ message: 'Withdrawal password already exists. Use update instead.' }, { status: 409 });
      }
    } else {
      await WithdrawalPassword.create({ userId, withdrawalPassword });
      return NextResponse.json({ message: 'Withdrawal password set successfully' }, { status: 200 });
    }
  } catch (error) {
    console.error('Error setting withdrawal password:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
