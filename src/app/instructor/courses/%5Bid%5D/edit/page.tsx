import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/features/auth/server";
import { db } from "@/lib/db";
import { CourseForm } from "@/components/course/course-form";
import { CurriculumBuilder } from "@/components/course/curriculum-builder";
import { ArrowLeft, Settings, ListCollapse } from "lucide-react";

export default async function EditCoursePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab = "settings" } = await searchParams;
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch course details with sections and lessons
  const course = await db.course.findUnique({
    where: { id },
    include: {
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
    redirect("/instructor/courses");
  }

  // Verify ownership
  if (course.instructorId !== user.id && user.role !== "Super Admin" && user.role !== "Admin") {
    redirect("/instructor/courses");
  }

  // Fetch all categories for selection
  const categories = await db.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back navigation & Title */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/instructor/courses"
          className="border border-border hover:bg-muted p-2 rounded-md transition-colors text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Back to Dashboard</span>
          <h1 className="text-2xl font-bold text-foreground">Edit Course: {course.title}</h1>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex gap-2 border-b border-border mb-8">
        <Link
          href={`/instructor/courses/${id}/edit?tab=settings`}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-semibold text-sm transition-all ${
            tab === "settings"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Settings className="h-4 w-4" />
          General Settings
        </Link>
        <Link
          href={`/instructor/courses/${id}/edit?tab=curriculum`}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-semibold text-sm transition-all ${
            tab === "curriculum"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ListCollapse className="h-4 w-4" />
          Curriculum Builder
        </Link>
      </div>

      {/* Tab Panels */}
      <div>
        {tab === "settings" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-foreground">Course Details</h2>
            {/* Format prisma decimal field to standard JS number for compatibility */}
            <CourseForm
              course={{
                ...course,
                price: parseFloat(course.price.toString()),
              }}
              categories={categories}
            />
          </div>
        )}

        {tab === "curriculum" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">Curriculum Outline</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Drag and drop sections or lessons to sort. Add lessons of type Video, Article, or Files.</p>
            </div>
            
            <CurriculumBuilder
              courseId={course.id}
              initialSections={course.sections.map((sec) => ({
                id: sec.id,
                title: sec.title,
                sortOrder: sec.sortOrder,
                lessons: sec.lessons.map((les) => ({
                  id: les.id,
                  title: les.title,
                  type: les.type,
                  sortOrder: les.sortOrder,
                })),
              }))}
            />
          </div>
        )}
      </div>
    </div>
  );
}
