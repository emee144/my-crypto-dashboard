// src/app/lib/assetsUtils.js
import {Assets}  from './models/assets.js'; // Adjust the import path if necessary

export async function getExchangeBalanceByUserId(userId) {
  try {
    const userAssets = await Assets.findOne({
      where: { userId }, // Assuming the 'userId' column exists in the 'assets' table
    });

    if (!userAssets) {
      throw new Error('User assets not found');
    }
    
    // If assets found, return the exchange balance (assuming it's stored in an 'exchange' column)
    return userAssets.exchange; // Updated to return the correct column
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw error;
  }
}
