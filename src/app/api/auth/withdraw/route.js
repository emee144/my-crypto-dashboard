import { NextResponse } from 'next/server';
import { getUserFromCookies } from '@/app/lib/cookieUtils';
import { sequelize } from '@/app/lib/sequelize';
import defineUserModel from '@/app/lib/models/user';
import defineWithdrawalRequestModel from '@/app/lib/models/withdrawalrequest';
import defineWithdrawalAddressModel from '@/app/lib/models/withdrawaladdress';
import defineWithdrawalPasswordModel from '@/app/lib/models/withdrawalpassword';
import defineAssetsModel from '@/app/lib/models/assets';
import defineWithdrawalHistoryModel from '@/app/lib/models/withdrawalhistory';

// 1️⃣ Initialize User first
const User = defineUserModel(sequelize);

// 2️⃣ Initialize models that need User for associations
const WithdrawalAddress = defineWithdrawalAddressModel(sequelize, User);
const WithdrawalRequest = defineWithdrawalRequestModel(sequelize, User);
const WithdrawalPassword = defineWithdrawalPasswordModel(sequelize, User);
const WithdrawalHistory = defineWithdrawalHistoryModel(sequelize, User);

// 3️⃣ Models that don’t need associations
const Assets = defineAssetsModel(sequelize);

// ✅ Now all models are ready to use


export async function POST(req) {
  try {
    const currentUser = await getUserFromCookies(req);
    console.log('✅ Current user from cookies:', currentUser);

    if (!currentUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { amount, withdrawalAddress, network, withdrawalPassword } = await req.json();
    console.log('📝 Withdrawal request body:', { amount, withdrawalAddress, network, withdrawalPassword });

    if (!amount || !withdrawalAddress || !network || !withdrawalPassword) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // 🏠 Match withdrawal address
    const existingWithdrawalAddress = await WithdrawalAddress.findOne({
      where: { userId: currentUser.userId, network },
    });

    console.log('🏠 Matched withdrawal address:', existingWithdrawalAddress?.address);

    if (!existingWithdrawalAddress || existingWithdrawalAddress.address !== withdrawalAddress) {
      console.log('❌ Withdrawal address mismatch or not found');
      return NextResponse.json({ message: `No valid ${network.toUpperCase()} withdrawal address found.` }, { status: 400 });
    }

    // 🔐 Check withdrawal password
    const withdrawalPasswordEntry = await WithdrawalPassword.findOne({
      where: { userId: currentUser.userId },
    });

    console.log('🔐 WithdrawalPassword entry:', withdrawalPasswordEntry?.withdrawalPassword);
    console.log('🧾 Entered withdrawal password:', withdrawalPassword);

    if (
      !withdrawalPasswordEntry ||
      withdrawalPasswordEntry.withdrawalPassword.trim() !== withdrawalPassword.trim()
    ) {
      console.log('❌ Invalid withdrawal password (after trim and compare)');
      return NextResponse.json({ message: 'Invalid withdrawal password' }, { status: 400 });
    }

    const handlingFee = parseFloat(amount) * 0.05;
    const amountAfterFee = parseFloat(amount) - handlingFee;

    const transaction = await sequelize.transaction();
    try {
      // 💰 Get and check user balance
      const userAssets = await Assets.findOne({
        where: { userId: currentUser.userId },
        transaction,
      });

      const currentBalance = parseFloat(userAssets?.exchange || 0);
      const amountNum = parseFloat(amount);

      console.log('💰 Current balance:', currentBalance);
      console.log('💸 Requested withdrawal amount:', amountNum);

      if (!userAssets || currentBalance < amountNum) {
        await transaction.rollback();
        return NextResponse.json({ message: 'Insufficient exchange balance' }, { status: 400 });
      }

      // ✅ Deduct balance using set() to ensure change tracking
      const newBalance = currentBalance - amountNum;
      userAssets.set('exchange', newBalance);
      await userAssets.save({ transaction });

      // 📝 Create withdrawal request
      const newWithdrawal = await WithdrawalRequest.create({
        userId: currentUser.userId,
        withdrawalAddress,
        network,
        amountRequested: amount,
        handlingFee,
        amountAfterFee,
        withdrawalPassword, // only for dev mode
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      }, { transaction });

      // 🧾 Create withdrawal history inside the transaction block
      await WithdrawalHistory.create({
        userId: currentUser.userId,
        currency: 'USDT', // or whatever you're using
        amountAfterFee,
        chainName: network, // 'ERC20', 'TRC20', etc.
        withdrawalAddress,
        status: 'pending',
      }, { transaction });

      await transaction.commit();

      console.log('✅ Withdrawal request created successfully:', newWithdrawal);

      return NextResponse.json({
        message: 'Withdrawal request submitted successfully.',
        withdrawalRequest: newWithdrawal,
      }, { status: 201 });

    } catch (err) {
      await transaction.rollback();
      console.error('💥 Error during withdrawal transaction:', err);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }

  } catch (err) {
    console.error('💥 Server Error in withdrawal route:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
