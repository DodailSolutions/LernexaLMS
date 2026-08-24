import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/features/auth/server";
import { db } from "@/lib/db";
import { Plus, BookOpen, Clock, Users, Eye } from "lucide-react";

export default async function InstructorCoursesPage() {
  const user = await getSessionUser();

  // If not logged in, redirect to login
  if (!user) {
    redirect("/login");
  }

  // Fetch courses managed by this instructor
  const courses = await db.course.findMany({
    where: {
      instructorId: user.id,
    },
    include: {
      enrollments: {
        select: { id: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Server Action to create a new course draft
  async function createCourseDraft(formData: FormData) {
    "use server";
    const session = await getSessionUser();
    if (!session) return;

    const title = formData.get("title") as string;
    if (!title || title.trim().length < 3) return;

    // Generate unique slug
    let baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    
    // Ensure slug doesn't exist
    let slug = baseSlug;
    let count = 1;
    while (true) {
      const existing = await db.course.findUnique({ where: { slug } });
      if (!existing) break;
      slug = `${baseSlug}-${count}`;
      count++;
    }

    const course = await db.course.create({
      data: {
        title,
        slug,
        price: 0,
        level: "Beginner",
        instructorId: session.id,
        status: "DRAFT",
      },
    });

    redirect(`/instructor/courses/${course.id}/edit`);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">Instructor Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your catalog, edit curriculum details, and track students.</p>
        </div>

        {/* Create Course Form Action */}
        <form action={createCourseDraft} className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            name="title"
            placeholder="Course title..."
            required
            className="flex-1 bg-background border border-input rounded px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
          />
          <button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm px-4 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            Create Course
          </button>
        </form>
      </div>

      {/* Courses Grid */}
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-card border border-border rounded-lg overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                    course.status === "PUBLISHED"
                      ? "bg-emerald-100 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400"
                      : course.status === "DRAFT"
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      : "bg-amber-100 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400"
                  }`}>
                    {course.status.replace("_", " ")}
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {course.price.toString() === "0" ? "Free" : `₹${course.price.toLocaleString()}`}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-foreground line-clamp-1">{course.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{course.subtitle || "No subtitle provided."}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-border pt-4 text-xs text-muted-foreground font-medium">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>{course.level}</span>
                  </div>
                  <div className="flex items-center gap-1 justify-center">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{course.duration} hrs</span>
                  </div>
                  <div className="flex items-center gap-1 justify-end">
                    <Users className="h-3.5 w-3.5" />
                    <span>{course.enrollments.length} enrolled</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/20 border-t border-border px-5 py-3.5 flex items-center justify-between">
                <Link
                  href={`/courses/${course.slug}`}
                  target="_blank"
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-semibold"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Preview Link
                </Link>

                <Link
                  href={`/instructor/courses/${course.id}/edit`}
                  className="bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold px-3 py-1.5 rounded transition-colors"
                >
                  Edit Course
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-border rounded-lg bg-card">
          <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-lg text-foreground">No courses created yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1.5">
            Type a title above and click &quot;Create Course&quot; to initialize your first learning catalog!
          </p>
        </div>
      )}
    </div>
  );
}
