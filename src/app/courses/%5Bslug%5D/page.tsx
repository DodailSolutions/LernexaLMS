import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/features/auth/server";
import { db } from "@/lib/db";
import { BookOpen, Clock, Users, PlayCircle, Lock, GraduationCap } from "lucide-react";

import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function CourseLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getSessionUser();

  let course: Prisma.CourseGetPayload<{
    include: {
      instructor: {
        select: { name: true, email: true };
      };
      category: {
        select: { name: true };
      };
      sections: {
        include: {
          lessons: true;
        };
      };
    };
  }> | null = null;
  let isEnrolled = false;
  let dbError = null;

  try {
    course = await db.course.findUnique({
      where: { slug },
      include: {
        instructor: {
          select: { name: true, email: true },
        },
        category: {
          select: { name: true },
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

    if (course && user) {
      const enrollment = await db.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: user.id,
            courseId: course.id,
          },
        },
      });
      isEnrolled = !!enrollment;
    }
  } catch (err) {
    dbError = err instanceof Error ? err.message : String(err);
  }

  if (dbError) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-sm max-w-md w-full text-center space-y-6">
          <div className="inline-flex bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 p-3 rounded-full">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Database Offline</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Lernexa LMS could not connect to your MySQL database server at <code>localhost:3306</code>.
            </p>
          </div>
          <div className="text-left bg-slate-50 dark:bg-slate-950 p-4 rounded-xl text-xs font-mono space-y-3 text-slate-700 dark:text-slate-400 border border-slate-100 dark:border-slate-900">
            <div>
              <p className="font-semibold text-slate-500 mb-1">1. Start MySQL database:</p>
              <code className="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded block select-all">docker-compose up -d</code>
            </div>
            <div>
              <p className="font-semibold text-slate-500 mb-1">2. Push Prisma schema:</p>
              <code className="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded block select-all">npx prisma db push</code>
            </div>
            <div>
              <p className="font-semibold text-slate-500 mb-1">3. Seed database tables:</p>
              <code className="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded block select-all">npx prisma db seed</code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    redirect("/");
  }

  // Server action to enroll student (for Phase 2 development / free access)
  async function handleEnroll() {
    "use server";
    if (!course) return;
    const session = await getSessionUser();
    if (!session) {
      redirect("/login");
    }

    // Upsert enrollment
    await db.enrollment.upsert({
      where: {
        studentId_courseId: {
          studentId: session.id,
          courseId: course.id,
        },
      },
      update: {},
      create: {
        studentId: session.id,
        courseId: course.id,
        status: "ACTIVE",
      },
    });

    redirect(`/dashboard/courses/${course.id}/learn`);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header info */}
      <div className="bg-slate-900 text-slate-100 py-12 md:py-20 px-4">
        <div className="max-w-5xl mx-auto space-y-4">
          {course.category && (
            <span className="bg-primary/20 text-primary border border-primary/30 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              {course.category.name}
            </span>
          )}
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">{course.title}</h1>
          <p className="text-slate-400 text-base md:text-lg max-w-3xl font-medium">{course.subtitle}</p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300 font-medium pt-2">
            <span className="flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4 text-primary" />
              Instructor: {course.instructor.name}
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              Level: {course.level}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              Duration: {course.duration} hours
            </span>
          </div>
        </div>
      </div>

      {/* Main Content split layout */}
      <div className="max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-12">
        {/* Course Details (Left Column) */}
        <div className="flex-[2] space-y-8">
          {/* Description */}
          {course.description && (
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-foreground">Course Description</h2>
              <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">{course.description}</p>
            </div>
          )}

          {/* Curriculum */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground font-black">Course Curriculum</h2>
            <div className="space-y-4">
              {course.sections.map((section) => (
                <div key={section.id} className="border border-border rounded-lg bg-card shadow-sm overflow-hidden">
                  <div className="bg-slate-50 dark:bg-slate-900/40 p-4 font-bold text-sm text-foreground border-b border-border">
                    {section.title}
                  </div>
                  <div className="divide-y divide-border">
                    {section.lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between p-4 text-xs font-medium text-muted-foreground hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                        <div className="flex items-center gap-2.5">
                          <PlayCircle className="h-4 w-4 text-primary/70 shrink-0" />
                          <span className="text-foreground">{lesson.title}</span>
                          <span className="bg-slate-100 dark:bg-slate-800 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded scale-90">
                            {lesson.type}
                          </span>
                        </div>
                        {isEnrolled || lesson.isFreePreview ? (
                          <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Available</span>
                        ) : (
                          <Lock className="h-3.5 w-3.5 text-slate-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing & Checkout card (Right Column) */}
        <div className="flex-1">
          <div className="border border-border bg-card p-6 rounded-lg shadow-md sticky top-24 space-y-6">
            <div className="text-center md:text-left space-y-1">
              <span className="text-xs text-muted-foreground font-semibold">Course Price</span>
              <h3 className="text-3xl font-black text-foreground">
                {course.price.toString() === "0" ? "Free" : `₹${parseFloat(course.price.toString()).toLocaleString()}`}
              </h3>
            </div>

            {isEnrolled ? (
              <Link
                href={`/dashboard/courses/${course.id}/learn`}
                className="block text-center bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3.5 rounded-md transition-colors w-full"
              >
                Go to Classroom
              </Link>
            ) : (
              <form action={handleEnroll}>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3.5 rounded-md transition-colors w-full cursor-pointer shadow-lg shadow-primary/20"
                >
                  Enroll Now
                </button>
              </form>
            )}

            <ul className="text-xs text-muted-foreground space-y-2.5 font-medium border-t border-border pt-4">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Lifetime access
              </li>
              <li className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Certificate of completion
              </li>
              <li className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Exercise files & downloads
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
