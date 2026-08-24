import { NextResponse } from "next/server";
import { getSessionUser } from "@/features/auth/server";
import { roleHasPermission } from "@/features/auth/permissions";
import { db } from "@/lib/db";
import { z } from "zod";

const createSectionSchema = z.object({
  title: z.string().min(1).max(255),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courseId } = await params;
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 }
      );
    }

    // Verify instructor ownership or admin permissions
    const isOwner = course.instructorId === user.id;
    const isAdmin = roleHasPermission(user.role, "course:update");
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const result = createSectionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: result.error.errors },
        { status: 400 }
      );
    }

    // Get max sort order to append
    const lastSection = await db.section.findFirst({
      where: { courseId },
      orderBy: { sortOrder: "desc" },
    });

    const newSortOrder = lastSection ? lastSection.sortOrder + 1 : 0;

    const section = await db.section.create({
      data: {
        title: result.data.title,
        courseId,
        sortOrder: newSortOrder,
      },
    });

    return NextResponse.json({ success: true, data: section }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
