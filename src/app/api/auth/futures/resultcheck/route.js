import { updateExpiredTrades } from '@/app/lib/updateTradeResults';
import { NextResponse } from 'next/server';

export async function GET() {
  const count = await updateExpiredTrades();
  return NextResponse.json({ message: 'Trades updated', count });
}
