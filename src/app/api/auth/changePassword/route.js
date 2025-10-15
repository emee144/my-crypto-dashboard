import { NextResponse } from "next/server";
import { getUserFromCookies } from "@/app/lib/cookieUtils";
import { User } from "@/app/lib/sequelize";

export async function POST(req) {
  try {
    const { oldPassword, newPassword } = await req.json();

    // ✅ pass req to read cookies correctly
    const user = getUserFromCookies(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Make sure this matches your DB column for PK
    const dbUser = await User.findByPk(user.userId);
    if (!dbUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (dbUser.password !== oldPassword) {
      return NextResponse.json({ message: "Old password is incorrect" }, { status: 400 });
    }

    await dbUser.update({ password: newPassword });

    return NextResponse.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
