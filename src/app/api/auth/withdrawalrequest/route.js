import { NextResponse } from 'next/server';
import { getUserFromCookies } from '@/app/lib/cookieUtils';
import { WithdrawalAddress } from '@/app/lib/models/withdrawaladdress';
import { WithdrawalRequest } from '@/app/lib/models/withdrawalrequest';
import { WithdrawalPassword } from '@/app/lib/models/withdrawalpassword';
import { User } from '@/app/lib/models/user';

export async function POST(req) {
  try {
    // Fetch user from cookies
    const currentUser = await getUserFromCookies(req);
    console.log('✅ Current user from cookies:', currentUser);

    if (!currentUser) {
      console.log('❌ No user found in cookies');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const { amount, withdrawalAddress, network, withdrawalPassword } = await req.json();
    console.log('📝 Withdrawal request body:', { amount, withdrawalAddress, network, withdrawalPassword });

    // Validate inputs
    if (!amount || !withdrawalAddress || !network || !withdrawalPassword) {
      console.log('❌ Missing required fields');
      return NextResponse.json({ message: 'Amount, Withdrawal Address, Network, and Withdrawal Password are required' }, { status: 400 });
    }

    // Check if the address is valid for the user and network
    const existingWithdrawalAddress = await WithdrawalAddress.findOne({
      where: { userId: currentUser.userId, network },
    });
    console.log('🏠 Matched withdrawal address:', existingWithdrawalAddress);

    if (!existingWithdrawalAddress || existingWithdrawalAddress.address !== withdrawalAddress) {
      console.log('❌ Withdrawal address mismatch or not found');
      return NextResponse.json({ message: `No valid ${network.toUpperCase()} withdrawal address found.` }, { status: 400 });
    }

    // Verify withdrawal password
    const withdrawalPasswordRecord = await WithdrawalPassword.findOne({
      where: { userId: currentUser.userId },
    });
    console.log('🔐 WithdrawalPassword record:', withdrawalPasswordRecord);

    if (!withdrawalPasswordRecord || withdrawalPasswordRecord.withdrawalPassword !== withdrawalPassword) {
      console.log('❌ Invalid withdrawal password');
      return NextResponse.json({ message: 'Invalid withdrawal password' }, { status: 400 });
    }

    try {
      const amountRequested = parseFloat(amount);
      console.log('💵 Amount requested:', amountRequested);

      const handlingFee = parseFloat((0.05 * amountRequested).toFixed(2));
      console.log('💰 Handling fee (5%):', handlingFee);

      const amountAfterFee = parseFloat((amountRequested - handlingFee).toFixed(2));
      console.log('💸 Amount after fee:', amountAfterFee);

      const transaction = await sequelize.transaction();
      try {
        const newWithdrawal = await WithdrawalRequest.create({
          userId: currentUser.userId,
          withdrawalAddress,
          network,
          amountRequested: amount,
          handlingFee,
          amountAfterFee,
          withdrawalPassword, // Ensure this is passed correctly
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
        console.error('💥 Error during withdrawal request transaction:', err);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
      }

    } catch (err) {
      console.error('💥 Error processing withdrawal request:', err);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }

  } catch (err) {
    console.error('💥 Error processing withdrawal request:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
