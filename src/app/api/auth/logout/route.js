import { deleteTokenFromCookies } from '@/app/lib/cookieUtils';  // Import deleteTokenFromCookies utility

export async function POST() {
  try {
    // Clear the JWT token from cookies
    await deleteTokenFromCookies();

    return NextResponse.json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Logout error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
