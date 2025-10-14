import { NextResponse } from 'next/server';
import { User } from '@/app/lib/sequelize';
import { getUserFromCookies } from '@/app/lib/cookieUtils'; // ✅ import utility

export async function GET() {
  try {
    const decoded = await getUserFromCookies(); // ✅ use cookieUtils
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      walletAddress: user.walletAddress,
      referralcode: user.referralcode
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}