import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { sequelize } from '@/app/lib/sequelize';
import models from '@/app/lib/models';  // ✅ import all initialized models

const { Assets, TransferHistory } = models;  // Access the models directly

export async function GET() {
  return NextResponse.json({ message: 'Use POST instead' }, { status: 405 });
}

export async function POST(req) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('jwt')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized: Missing token' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const userId = decoded.userId;
    const body = await req.json();
    const { amount, balanceTypeFrom, balanceTypeTo, assetType } = body;

    console.log('Internal Transfer Request:', { userId, amount, balanceTypeFrom, balanceTypeTo, assetType });

    if (!amount || !balanceTypeFrom || !balanceTypeTo || !assetType) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const validTypes = ['trade', 'exchange', 'perpetual'];
    if (!validTypes.includes(balanceTypeFrom) || !validTypes.includes(balanceTypeTo)) {
      return NextResponse.json({ message: 'Invalid balance types' }, { status: 400 });
    }

    if (balanceTypeFrom === balanceTypeTo) {
      return NextResponse.json({ message: 'Source and destination balance types must be different' }, { status: 400 });
    }

    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      return NextResponse.json({ message: 'Invalid transfer amount' }, { status: 400 });
    }

    if (!/^[a-zA-Z0-9]+$/.test(assetType)) {
      return NextResponse.json({ message: 'Invalid asset type' }, { status: 400 });
    }

    const asset = await Assets.findOne({
      where: {
        userId,
        crypto: assetType.toUpperCase(),
      },
    });

    if (!asset) {
      return NextResponse.json({ message: 'Asset record not found for user' }, { status: 404 });
    }

    const fromBalance = parseFloat(asset[balanceTypeFrom]) || 0;
    if (fromBalance < transferAmount) {
      return NextResponse.json({ message: 'Insufficient balance in source balance type' }, { status: 400 });
    }

    // 🔁 Atomic transaction
    await sequelize.transaction(async (t) => {
      // Update balances
      asset[balanceTypeFrom] = fromBalance - transferAmount;
      asset[balanceTypeTo] = (parseFloat(asset[balanceTypeTo]) || 0) + transferAmount;
      await asset.save({ transaction: t });

      // ✅ Log transfer in history
      await TransferHistory.create({
        userId,
        assetType: assetType.toUpperCase(),
        from: balanceTypeFrom,
        to: balanceTypeTo,
        amount: transferAmount,
      }, { transaction: t });
    });

    return NextResponse.json({ message: 'Internal balance transfer successful' });

  } catch (error) {
    console.error('[INTERNAL_TRANSFER_ERROR]', error);

    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return NextResponse.json({ message: 'Invalid userId: User does not exist' }, { status: 400 });
    }

    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
