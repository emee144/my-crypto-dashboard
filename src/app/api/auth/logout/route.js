import { NextResponse } from 'next/server'; // ✅ ADD THIS LINE
import { deleteTokenFromCookies } from '@/app/lib/cookieUtils';

export async function POST() {
  try {
    await deleteTokenFromCookies();
    return NextResponse.json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Logout error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
