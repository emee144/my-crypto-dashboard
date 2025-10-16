import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Save the JWT token to cookies
export async function saveTokenToCookies(token, rememberMe = false) {
  const cookieStore = await cookies(); 
  const maxAge = rememberMe ? 60 * 60 * 24 * 365 : undefined;

  await cookieStore.set('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true on Vercel, false on localhost
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' on production, 'lax' on localhost
    path: '/',
    maxAge,
  });
}

// Get the JWT token from cookies
export async function getUserFromCookies() {
  const cookieStore = await cookies(); 
  const token = cookieStore.get('jwt')?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Decoded JWT payload:', decoded);
    return {
      userId: decoded.userId,
      email: decoded.email,
    };
  } catch (err) {
    console.error('JWT verification error:', err);
    return null;
  }
}

// Delete the JWT token
export async function deleteTokenFromCookies() {
  const cookieStore = await cookies();
  await cookieStore.delete('jwt', { path: '/' });
}
