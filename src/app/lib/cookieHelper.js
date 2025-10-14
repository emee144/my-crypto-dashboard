import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Function to set the JWT token in cookies
export function setTokenCookie(token) {
  const cookieStore = cookies();
  cookieStore.set({
    name: 'token',                   // Cookie name
    value: token,                    // The token value
    httpOnly: true,                  // Ensures it's not accessible via JavaScript
    path: '/',                       // Path for which the cookie is valid
    sameSite: 'Lax',                 // Prevents CSRF attacks
    secure: 'false',               // Set to true in production
    maxAge: 60 * 60 * 24 * 365,     // Cookie expiration time (1 year)
  });
}

// Function to get the JWT token from cookies
export function getTokenFromCookies() {
  const cookieStore = cookies();
  const tokenObj = cookieStore.get('token');
  return tokenObj ? tokenObj.value : null;  // Return token value or null if not found
}

// Function to decode and verify the JWT token
export function getUserFromCookieToken(token) {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using your secret
    return decoded; // { userId, email }
  } catch (err) {
    console.error("JWT verification error:", err.message); 
    return null;
  }
}
