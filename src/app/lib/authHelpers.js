import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export function getUserFromCookie() {
  const token = cookies().get("jwt")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // e.g. { userId: "...", email: "..." }
  } catch (err) {
    console.error("JWT verification error:", err);
    return null;
  }
}
