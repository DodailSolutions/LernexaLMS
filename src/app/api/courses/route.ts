import { NextResponse } from "next/server";
import { getSessionUser } from "@/features/auth/server";
import { roleHasPermission } from "@/features/auth/permissions";
import { db } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

const createCourseSchema = z.object({
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(255).regex(/^[a-z0-9-]+$/),
  subtitle: z.string().max(255).optional(),
  description: z.string().optional(),
  price: z.number().min(0),
  level: z.string(),
  categoryId: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const level = searchParams.get("level") || undefined;
    const search = searchParams.get("search") || "";
    
    // Default page parameters
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const courses = await db.course.findMany({
      where: {
        status: "PUBLISHED",
        categoryId,
        level,
        OR: search
          ? [
              { title: { contains: search } },
              { subtitle: { contains: search } },
            ]
          : undefined,
      },
      include: {
        category: {
          select: { name: true, slug: true },
        },
        instructor: {
          select: { name: true },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const total = await db.course.count({
      where: {
        status: "PUBLISHED",
        categoryId,
        level,
        OR: search
          ? [
              { title: { contains: search } },
              { subtitle: { contains: search } },
            ]
          : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      data: courses,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const hasCreatePerm = roleHasPermission(user.role, "course:create");
    if (!hasCreatePerm) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const result = createCourseSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: result.error.errors },
        { status: 400 }
      );
    }

    const { title, slug, subtitle, description, price, level, categoryId } = result.data;

    // Check slug duplication
    const existing = await db.course.findUnique({
      where: { slug },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "A course with this slug already exists" },
        { status: 400 }
      );
    }

    const course = await db.course.create({
      data: {
        title,
        slug,
        subtitle,
        description,
        price,
        level,
        categoryId,
        instructorId: user.id,
        status: "DRAFT",
      },
    });

    return NextResponse.json({ success: true, data: course }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
