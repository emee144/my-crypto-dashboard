// app/api/perpetual/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  const mockData = [
    { timestamp: 1713744000, price: 3125 },
    { timestamp: 1713747600, price: 3132 },
    // more data points
  ];

  return NextResponse.json(mockData);
}