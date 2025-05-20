import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { User, Assets, connectDB } from '../../../lib/sequelize';
import { z } from 'zod';
import { saveTokenToCookies } from '@/app/lib/cookieUtils';
import generateReferralCode from '@/app/lib/referralcodegenerator';
import { ethers } from 'ethers';
import * as bip39 from 'bip39';
import HDKey from 'hdkey';
import TronWeb from 'tronweb';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid'; // 👈 add this

const JWT_SECRET = process.env.JWT_SECRET;
const MASTER_PRIVATE_KEY = process.env.MASTER_PRIVATE_KEY;

const signupSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  referral: z.string().nullable().optional(),
});

function getWalletIndexFromUUID(uuid) {
  const hash = crypto.createHash('sha256').update(uuid).digest('hex');
  return parseInt(hash.slice(0, 8), 16); // First 8 chars → number
}

async function generateWallets(index = 0) {
  const root = HDKey.fromExtendedKey(MASTER_PRIVATE_KEY);

  // === Ethereum ===
  const ethPath = `m/44'/60'/0'/0/${index}`;
  const ethNode = root.derive(ethPath);
  if (!ethNode.privateKey) throw new Error("Failed to derive Ethereum private key.");
  const ethPrivateKey = ethNode.privateKey.toString("hex");
  const ethWallet = new ethers.Wallet(ethPrivateKey);

  // === TRON ===
  const tronPath = `m/44'/195'/0'/0/${index}`;
  const tronNode = root.derive(tronPath);
  if (!tronNode.privateKey) throw new Error("Failed to derive TRON private key.");
  const tronPrivateKey = tronNode.privateKey.toString("hex");
  const tronWeb = new TronWeb({
    fullNode: "https://api.trongrid.io",
    solidityNode: "https://api.trongrid.io",
    eventServer: "https://api.trongrid.io",
  });
  const tronAddress = tronWeb.address.fromPrivateKey(tronPrivateKey);

  return {
    ethAddress: ethWallet.address,
    tronAddress,
  };
}

export async function POST(req) {
  await connectDB();
  console.log('✅ DB Connected');

  try {
    const body = await req.json();
    console.log('📥 Request body:', body);

    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      console.log('❌ Validation failed:', parsed.error.format());
      return NextResponse.json({ message: 'Validation failed', errors: parsed.error.format() }, { status: 400 });
    }

    const { email, password, referral } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    // 🔍 Check existing user
    const existingUser = await User.findOne({ where: { email: normalizedEmail } });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    // ✅ Validate referral code if provided
    let uplineReferral = null;
    if (referral) {
      const referrer = await User.findOne({ where: { referralcode: referral } });
      if (!referrer) {
        return NextResponse.json({ message: 'Invalid referral code' }, { status: 400 });
      }
      uplineReferral = referrer.id;
    }

    // 🆕 Generate UUID manually before creation
    const userId = uuidv4();

    // 🧠 Use UUID to derive deterministic wallet index
    const walletIndex = getWalletIndexFromUUID(userId);
    const { ethAddress, tronAddress } = await generateWallets(walletIndex);

    // 🆕 Create user with full info
    const newReferralCode = generateReferralCode();
    const newUser = await User.create({
      id: userId,
      email: normalizedEmail,
      password,
      referral: uplineReferral,
      referralcode: newReferralCode,
      ethAddress,
      tronAddress,
    });

    // 💰 Create empty assets
    await Assets.create({
      userId: userId,
      exchange: 0.0,
      perpetual: 0.0,
      trade: 0.0,
    });

    // 🔐 Generate JWT and set cookie
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '365d' }
    );
    saveTokenToCookies(token);

    return NextResponse.json({
      message: 'Signup successful',
      user: {
        id: newUser.id,
        email: newUser.email,
        referral: newUser.referral,
        referralcode: newUser.referralcode,
        ethAddress: newUser.ethAddress,
        tronAddress: newUser.tronAddress,
      },
    });
  } catch (error) {
    console.error('❌ Signup error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
