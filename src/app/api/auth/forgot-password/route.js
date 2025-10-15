// app/api/auth/forgot-password/route.js
import { NextResponse } from 'next/server';
import { User } from '@/app/lib/sequelize'; // ✅ import directly
import { transporter } from '@/lib/mailer';
import crypto from 'crypto';
export async function POST(request) {
  const { email } = await request.json();

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  // Create token and expiry
  const token = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();

  const resetLink = `http://localhost:3000/reset-password/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Password Reset Request',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  };

try {
  await transporter.sendMail(mailOptions);
  return NextResponse.json({ message: 'Reset link sent to email' });
} catch (error) {
  console.error('❌ Email error:', error); // Add this
  return NextResponse.json({ message: 'Error sending email' }, { status: 500 });
}
}
