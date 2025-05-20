import { initModels } from '@/app/lib/models';
import { NextResponse } from 'next/server';
import { getUserFromCookies } from '@/app/lib/cookieUtils';

const { Assets } = initModels();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const assetType = searchParams.get('assetType');
    const crypto = searchParams.get('crypto')?.toUpperCase();

    if (!assetType || !crypto) {
      return NextResponse.json({ error: 'assetType and crypto are required' }, { status: 400 });
    }

    const validAssetTypes = ['trade', 'exchange', 'perpetual'];
    if (!validAssetTypes.includes(assetType)) {
      return NextResponse.json({ error: 'Invalid assetType' }, { status: 400 });
    }

    const user = await getUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: 'Invalid or missing token' }, { status: 401 });
    }

    const userId = user.userId;

    // ✅ BTC and ETH should return 0
    if (crypto === 'BTC' || crypto === 'ETH') {
      return NextResponse.json({ balance: 0 }, { status: 200 });
    }

    // ✅ Only USDT should be fetched from DB
    const asset = await Assets.findOne({
      where: {
        userId,
        crypto: 'USDT',
      },
    });

    if (!asset) {
      return NextResponse.json({ balance: 0 }, { status: 200 });
    }

    const balance = parseFloat(asset[assetType]) || 0;
    return NextResponse.json({ balance }, { status: 200 });

  } catch (error) {
    console.error('Error fetching balance:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
