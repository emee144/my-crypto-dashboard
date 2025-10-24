import { NextResponse } from 'next/server';
import { User, WithdrawalAddress, connectDB } from '../../../lib/sequelize';
import { saveTokenToCookies } from '@/app/lib/cookieUtils'; 
import jwt from 'jsonwebtoken';

async function authenticateUser(normalizedEmail, password) {
  const user = await User.findOne({ where: { email: normalizedEmail } });
  if (!user || password.trim() !== user.password) return null;
  return user;
}

export async function POST(req) {
  await connectDB();

  try {
    const { email, password, rememberMe } = await req.json();
    const normalizedEmail = email.toLowerCase();

    const user = await authenticateUser(normalizedEmail, password);
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const withdrawalAddress = await WithdrawalAddress.findOne({
      where: { userId: user.id },
    });

    const token = jwt.sign(
      { userId: user.id, email: normalizedEmail },
      process.env.JWT_SECRET,
      { expiresIn: '365d' }
    );

    // Await saving token into cookies
    await saveTokenToCookies(token, rememberMe); 

    return NextResponse.json({
      message: 'Login successful',
      token,
      userId: user.id,
      email: normalizedEmail,
      withdrawalAddress: withdrawalAddress?.address || null,
      withdrawalNetwork: withdrawalAddress?.network || null,
      referralcode: user.referralcode,
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
