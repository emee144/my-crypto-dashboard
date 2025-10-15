import { NextResponse } from "next/server";
import { getUserFromCookie } from "@/app/lib/authHelpers"; 
import models from "@/app/lib/models";  // ✅ import all initialized models

const { Assets } = models; // Access the Assets model directly

export async function GET(req) {
  const user = getUserFromCookie(req); // Ensure you pass `req` if required for cookies
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userAssets = await Assets.findOne({
      where: { userId: user.userId },
      attributes: ["exchange"], // Fetch only the "exchange" field
    });

    // Check if userAssets is null or undefined
    if (!userAssets) {
      return NextResponse.json({ error: "User has no assets" }, { status: 404 });
    }

    // If exchange balance exists, return it, otherwise return 0
    const exchange = userAssets.exchange || 0;
    return NextResponse.json({ exchange });

  } catch (err) {
    console.error("Error fetching exchange balance:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
