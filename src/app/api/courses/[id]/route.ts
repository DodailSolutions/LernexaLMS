import { NextResponse } from "next/server";
import { getSessionUser } from "@/features/auth/server";
import { roleHasPermission } from "@/features/auth/permissions";
import { db } from "@/lib/db";
import { z } from "zod";

const updateCourseSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  slug: z.string().min(3).max(255).regex(/^[a-z0-9-]+$/).optional(),
  subtitle: z.string().max(255).optional().nullable(),
  description: z.string().optional().nullable(),
  thumbnail: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  previewVideo: z.string().optional().nullable(),
  price: z.number().min(0).optional(),
  discountPrice: z.number().min(0).optional().nullable(),
  level: z.string().optional(),
  language: z.string().optional(),
  categoryId: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PENDING_REVIEW", "PUBLISHED", "REJECTED", "ARCHIVED"]).optional(),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const course = await db.course.findUnique({
      where: { id },
      include: {
        category: true,
        instructor: {
          select: { id: true, name: true, email: true },
        },
        sections: {
          orderBy: { sortOrder: "asc" },
          include: {
            lessons: {
              orderBy: { sortOrder: "asc" },
            },
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: course });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

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

    const course = await db.course.findUnique({
      where: { id },
    });

    if (!course) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 }
      );
    }

    // Verify ownership or admin permission
    const isOwner = course.instructorId === user.id;
    const isAdmin = roleHasPermission(user.role, "course:update");
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const result = updateCourseSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: result.error.errors },
        { status: 400 }
      );
    }

    // If slug is updated, check duplication
    if (result.data.slug && result.data.slug !== course.slug) {
      const existing = await db.course.findUnique({
        where: { slug: result.data.slug },
      });
      if (existing) {
        return NextResponse.json(
          { success: false, error: "A course with this slug already exists" },
          { status: 400 }
        );
      }
    }

    const updated = await db.course.update({
      where: { id },
      data: {
        ...result.data,
        price: result.data.price !== undefined ? result.data.price : undefined,
        discountPrice: result.data.discountPrice !== undefined ? result.data.discountPrice : undefined,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
