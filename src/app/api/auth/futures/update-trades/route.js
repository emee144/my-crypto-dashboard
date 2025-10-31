import { updateExpiredTrades } from '@/app/lib/updateTradeResults';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const count = await updateExpiredTrades();

    // Always return valid JSON
    return NextResponse.json({ message: 'Trades updated', count });
  } catch (error) {
    console.error('[update-trades] Error:', error);

    // Return safe JSON even when there's an error
    return NextResponse.json(
      { message: 'Failed to update trades', error: error.message },
      { status: 500 }
    );
  }
}
