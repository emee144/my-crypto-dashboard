// src/app/api/auth/deposit/route.js

import models from '@/app/lib/models/init';  // <-- this initializes all models
import { getUserFromCookies } from '@/app/lib/cookieUtils'; // Adjust path as needed

const { User } = models;

export async function GET(req) {
  try {
    // Get user data (email) from the cookie
    const user = await getUserFromCookies(req);
    
    if (!user) {
      return new Response(
        JSON.stringify({ message: 'User not authenticated' }),
        { status: 401 }
      );
    }

    const { email } = user;

    // ✅ Now this will work because User is initialized
    const foundUser = await User.findOne({
      where: { email },
      attributes: ['ethAddress', 'tronAddress'],
    });

    if (!foundUser) {
      return new Response(
        JSON.stringify({ message: 'User not found' }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ ethAddress: foundUser.ethAddress, tronAddress: foundUser.tronAddress }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user addresses:', error);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
