import { NextResponse } from "next/server";
import { getSessionUser } from "@/features/auth/server";
import { roleHasPermission } from "@/features/auth/permissions";
import { db } from "@/lib/db";
import { z } from "zod";

const updateLessonSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  duration: z.number().min(0).optional(),
  isFreePreview: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const lesson = await db.lesson.findUnique({
      where: { id },
      include: {
        section: {
          include: { course: true },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { success: false, error: "Lesson not found" },
        { status: 404 }
      );
    }

    const isOwner = lesson.section.course.instructorId === user.id;
    const isAdmin = roleHasPermission(user.role, "course:update");
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const result = updateLessonSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: result.error.errors },
        { status: 400 }
      );
    }

    const updated = await db.lesson.update({
      where: { id },
      data: result.data,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const lesson = await db.lesson.findUnique({
      where: { id },
      include: {
        section: {
          include: { course: true },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { success: false, error: "Lesson not found" },
        { status: 404 }
      );
    }

    const isOwner = lesson.section.course.instructorId === user.id;
    const isAdmin = roleHasPermission(user.role, "course:update");
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    await db.lesson.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Lesson deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
