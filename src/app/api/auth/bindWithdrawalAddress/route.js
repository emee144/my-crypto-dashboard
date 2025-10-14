import { User, WithdrawalAddress, connectDB } from '../../../lib/sequelize';
import { NextResponse } from "next/server";
import { getUserFromCookies } from "@/app/lib/cookieUtils";

// POST handler to bind address
export async function POST(req) {
  try {
    await connectDB();

    const { address, network } = await req.json();
    const user = await getUserFromCookies();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = user.userId;

    // Check if address already exists for this user and network
    let withdrawalAddress = await WithdrawalAddress.findOne({
      where: { userId, network }, // 🔥 Check by userId AND network
    });

    if (withdrawalAddress) {
      // Update existing address for the network
      withdrawalAddress.address = address;
      await withdrawalAddress.save();
    } else {
      // Create a new address entry for the network
      withdrawalAddress = await WithdrawalAddress.create({
        userId,
        address,
        network,
      });
    }

    return NextResponse.json({
      message: "Address successfully bound",
      withdrawalAddress: withdrawalAddress.address,
      withdrawalNetwork: withdrawalAddress.network,
    });
  } catch (err) {
    console.error("Error binding withdrawal address:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// GET handler to retrieve all withdrawal addresses for user
export async function GET() {
  try {
    await connectDB();
    const user = await getUserFromCookies();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = user.userId;

    const dbUser = await User.findByPk(userId);  // Capitalize 'User'
    if (!dbUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 🔥 Fetch all withdrawal addresses for user
    const withdrawalAddresses = await WithdrawalAddress.findAll({
      where: { userId },
    });

    // Build a simple { network: address } object
    const addressMap = {};
    withdrawalAddresses.forEach((item) => {
      addressMap[item.network] = item.address;
    });

    return NextResponse.json({
      withdrawalAddresses: addressMap, // 🔥 Return all addresses
    });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// Validators (optional helpers you already had)
function isValidERC20Address(address) {
  const erc20Regex = /^0x[a-fA-F0-9]{40}$/;
  return erc20Regex.test(address);
}

function isValidTRC20Address(address) {
  const trc20Regex = /^T[a-zA-Z0-9]{33}$/;
  return trc20Regex.test(address);
}
