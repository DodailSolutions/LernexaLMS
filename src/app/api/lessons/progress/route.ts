import { NextResponse } from "next/server";
import { getSessionUser } from "@/features/auth/server";
import { db } from "@/lib/db";
import { z } from "zod";

const progressSchema = z.object({
  lessonId: z.string(),
  isCompleted: z.boolean(),
  watchTime: z.number().optional(),
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
    const result = progressSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: result.error.errors },
        { status: 400 }
      );
    }

    const { lessonId, isCompleted, watchTime = 0 } = result.data;

    // Find lesson and course
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: {
        section: {
          select: { courseId: true },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { success: false, error: "Lesson not found" },
        { status: 404 }
      );
    }

    const courseId = lesson.section.courseId;

    // Find enrollment
    const enrollment = await db.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: user.id,
          courseId,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { success: false, error: "Student is not enrolled in this course" },
        { status: 403 }
      );
    }

    // Upsert lesson progress
    await db.lessonProgress.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId,
        },
      },
      update: {
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
        watchTime,
      },
      create: {
        enrollmentId: enrollment.id,
        lessonId,
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
        watchTime,
      },
    });

    // Recalculate enrollment progress percentage
    const totalLessons = await db.lesson.count({
      where: {
        section: { courseId },
        isPublished: true,
      },
    });

    if (totalLessons > 0) {
      const completedLessons = await db.lessonProgress.count({
        where: {
          enrollmentId: enrollment.id,
          isCompleted: true,
          lesson: { isPublished: true },
        },
      });

      const progressPercentage = parseFloat(((completedLessons / totalLessons) * 100).toFixed(2));

      await db.enrollment.update({
        where: { id: enrollment.id },
        data: {
          progressPercentage,
          lastAccessedAt: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true, message: "Progress updated successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
