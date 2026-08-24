import { cookies } from "next/headers";
import { verifyToken } from "./jwt";
import { db } from "@/lib/db";

export async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    // Fetch user details from database
    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: {
          select: {
            name: true,
          },
        },
        isActive: true,
      },
    });

    if (!user || !user.isActive) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.name,
    };
  } catch (error) {
    return null;
  }
}
