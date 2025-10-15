import { NextResponse } from "next/server";
import { sequelize } from "@/app/lib/sequelize";
import defineUserModel from "@/app/lib/models/user";
import { getUserFromCookies } from "@/app/lib/cookieUtils";

const User = defineUserModel(sequelize);

export async function POST(req) {
  console.log("[POST /api/auth/changePassword] Incoming request");
  try {
    const body = await req.json();
    const { oldPassword, newPassword } = body;
    console.log("Request body:", body);

    console.log("Attempting to read user from cookies...");
    const user = await getUserFromCookies(req);
    console.log(" User from cookies:", user);

    if (!user) {
      console.warn("Unauthorized — no valid user cookie found");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.log(`Looking up DB user by ID: ${user.userId}`);
    const dbUser = await User.findByPk(user.userId);
    console.log(" DB lookup result:", dbUser ? dbUser.toJSON() : null);

    if (!dbUser) {
      console.warn(` User not found in DB for ID: ${user.userId}`);
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    console.log("Comparing old passwords...");
    console.log("Provided old password:", oldPassword);
    console.log("Stored password:", dbUser.password);

    if (dbUser.password !== oldPassword) {
      console.warn("❌ Old password is incorrect");
      return NextResponse.json({ message: "Old password is incorrect" }, { status: 400 });
    }

    console.log(" Updating password...");
    await dbUser.update({ password: newPassword });
    console.log("✅ Password updated successfully for user:", dbUser.id);

    return NextResponse.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("❌ Change password error:", err);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
