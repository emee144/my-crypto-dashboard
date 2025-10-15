import { NextResponse } from "next/server";
import { getUserFromCookies } from "@/app/lib/cookieUtils";
import { Assets, connectDB } from "@/lib/sequelize"; // ✅ keep using this

export async function GET() {
  try {
    await connectDB();
    console.log("✅ DB Connected");

    const user = await getUserFromCookies();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const assets = await Assets.findOne({
      where: { userId: user.id }, // make sure it's user.id, not user.userId
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
