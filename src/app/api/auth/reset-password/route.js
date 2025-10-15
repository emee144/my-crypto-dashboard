import { NextResponse } from 'next/server';
import { User } from '@/app/lib/models/user'; // ✅ direct import

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    const user = await User.findOne({
      where: { resetPasswordToken: token },
    });

    if (!user || user.resetPasswordExpires < Date.now()) {
      return NextResponse.json(
        { message: 'Token is invalid or expired' },
        { status: 400 }
      );
    }

    // Replace with hashed password if not handled by Sequelize hook
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return NextResponse.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
