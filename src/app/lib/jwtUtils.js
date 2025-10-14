// lib/jwtUtils.js
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'jwt';
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Save JWT token to HTTP-only cookie
 */
export function setTokenCookie(token, rememberMe = false) {
  const cookieStore = cookies();
  cookieStore.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'Lax',
    maxAge: rememberMe ? 60 * 60 * 24 * 365 : 60 * 60 * 24, // 1 year or 1 day
  });
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1y' });
}

/**
 * Read JWT token from HTTP-only cookie
 */
export function getTokenFromCookies() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return token || null;
}

/**
 * Verify and decode JWT token
 */
export function getUserFromToken() {
  const token = getTokenFromCookies();
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded; // Example: { userId, email, isAdmin }
  } catch (err) {
    console.error('❌ Invalid token:', err.message);
    return null;
  }
}

/**
 * Delete the JWT cookie (logout)
 */
export function clearTokenCookie() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}
