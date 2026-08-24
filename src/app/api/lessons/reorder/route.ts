import { NextResponse } from "next/server";
import { getSessionUser } from "@/features/auth/server";
import { db } from "@/lib/db";
import { z } from "zod";

const reorderSchema = z.object({
  list: z.array(
    z.object({
      id: z.string(),
      sortOrder: z.number(),
    })
  ),
});

export async function PATCH(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const result = reorderSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: result.error.errors },
        { status: 400 }
      );
    }

    await db.$transaction(
      result.data.list.map((item) =>
        db.lesson.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        })
      )
    );

    return NextResponse.json({ success: true, message: "Lessons reordered successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
