import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { sequelize } from '@/app/lib/sequelize';
import { initModels } from '@/app/lib/models';

const { Assets } = initModels(sequelize);

export async function GET() {
  return NextResponse.json({ message: 'Use POST instead' }, { status: 405 });
}

export async function POST(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const senderId = decoded.userId;

    const { assetType, amount, receiverId } = await req.json();

    if (!assetType || !amount || !receiverId) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const transferAmount = Number(amount);

    const senderAsset = await Assets.findOne({
      where: {
        userId: senderId,
        assetType,
      },
    });

    if (!senderAsset || senderAsset.amount < transferAmount) {
      return NextResponse.json({ message: 'Insufficient balance' }, { status: 400 });
    }

    let receiverAsset = await Assets.findOne({
      where: {
        userId: receiverId,
        assetType,
      },
    });

    await sequelize.transaction(async (t) => {
      senderAsset.amount -= transferAmount;
      await senderAsset.save({ transaction: t });

      if (receiverAsset) {
        receiverAsset.amount += transferAmount;
        await receiverAsset.save({ transaction: t });
      } else {
        await Assets.create({
          userId: receiverId,
          assetType,
          amount: transferAmount,
        }, { transaction: t });
      }
    });

    return NextResponse.json({ message: 'Transfer successful' });
  } catch (error) {
    console.error('[TRANSFER_ERROR]', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
