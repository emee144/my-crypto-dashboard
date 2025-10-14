import { NextResponse } from "next/server";
import { getUserFromCookies } from "@/app/lib/cookieUtils"; // ✅ Correct import for cookieUtils.js
import { Assets, connectDB } from "@/lib/sequelize"; // Assuming you have your sequelize models here

export async function GET() {
  try {
    await connectDB(); // Step 1: Connect to DB
    console.log("✅ DB Connected");

    // Get user from the cookies
    const user = await getUserFromCookies();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch assets for the authenticated user
    const assets = await Assets.findOne({
      where: { userId: user.userId },
    });

    if (!assets) {
      return NextResponse.json({ message: "Assets not found" }, { status: 404 });
    }

    return NextResponse.json({
      exchange: assets.exchange,
      perpetual: assets.perpetual,
      trade: assets.trade,
    });
  } catch (err) {
    console.error("Error fetching assets:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
