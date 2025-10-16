import { NextResponse } from "next/server";
import { getUserFromCookies } from "@/app/lib/cookieUtils";
import { Assets, connectDB } from "@/lib/sequelize";

export async function GET() {
  console.log("[GET /api/auth/assets] Request received");
  try {
    console.log(" Attempting DB connection...");
    await connectDB();
    console.log("Database connected successfully");

    console.log("Getting user from cookies...");
    const user = await getUserFromCookies();
    console.log(" User from cookies:", user);

    if (!user) {
      console.warn("Unauthorized request — no user found from cookies");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.log(`Fetching assets for userId: ${user.userId}`);
    const assets = await Assets.findOne({
      where: { userId: user.userId },
    });
    console.log(" Assets query result:", assets);

    if (!assets) {
      console.warn(` No assets found for userId: ${user.userId}`);
      return NextResponse.json({ message: "Assets not found" }, { status: 404 });
    }

    console.log("Assets retrieved successfully");
    return NextResponse.json({
      exchange: assets.exchange,
      perpetual: assets.perpetual,
      trade: assets.trade,
    });
  } catch (err) {
    console.error("❌ Error fetching assets:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
