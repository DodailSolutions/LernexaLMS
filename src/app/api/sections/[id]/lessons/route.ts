import { NextResponse } from "next/server";
import { getSessionUser } from "@/features/auth/server";
import { roleHasPermission } from "@/features/auth/permissions";
import { db } from "@/lib/db";
import { z } from "zod";

const createLessonSchema = z.object({
  title: z.string().min(1).max(255),
  type: z.enum([
    "VIDEO", "AUDIO", "TEXT", "PDF", "PRESENTATION",
    "QUIZ", "ASSIGNMENT", "EXAM", "LIVE_CLASS", "DOWNLOAD", "EXTERNAL"
  ]),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sectionId } = await params;
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const section = await db.section.findUnique({
      where: { id: sectionId },
      include: { course: true },
    });

    if (!section) {
      return NextResponse.json(
        { success: false, error: "Section not found" },
        { status: 404 }
      );
    }

    const isOwner = section.course.instructorId === user.id;
    const isAdmin = roleHasPermission(user.role, "course:update");
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const result = createLessonSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: result.error.errors },
        { status: 400 }
      );
    }

    // Get max sortOrder to append
    const lastLesson = await db.lesson.findFirst({
      where: { sectionId },
      orderBy: { sortOrder: "desc" },
    });

    const newSortOrder = lastLesson ? lastLesson.sortOrder + 1 : 0;

    const lesson = await db.lesson.create({
      data: {
        title: result.data.title,
        type: result.data.type,
        sectionId,
        sortOrder: newSortOrder,
      },
    });

    return NextResponse.json({ success: true, data: lesson }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
