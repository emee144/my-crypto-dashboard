import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers'; // Next.js dynamic API (async)

// Save the JWT token to cookies
export async function saveTokenToCookies(token, rememberMe = false) {
  const cookieStore = await cookies(); // 👈 await here
  const maxAge = rememberMe ? 60 * 60 * 24 * 365 : undefined;
  await cookieStore.set('jwt', token, {
    httpOnly: true,
    secure: false,
    path: '/',
    maxAge,
  });
}
// Get the JWT token from cookies and decode it to get the user data
export async function getUserFromCookies() {
  const cookieStore = await cookies(); // 👈 await here
  const token = cookieStore.get('jwt')?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Decoded JWT payload:', decoded); // log decoded result
    return {
      userId: decoded.userId,
      email: decoded.email,
    };
  } catch (err) {
    console.error('JWT verification error:', err);
    return null;
  }
}

// Delete the JWT token (for logging out the user)
export async function deleteTokenFromCookies() {
  const cookieStore = await cookies(); // 👈 await here
  await cookieStore.delete('jwt', {
    path: '/',
  });
}