import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/features/auth/server";
import { db } from "@/lib/db";
import { LearningPlayer } from "@/components/learning/learning-player";
import { CheckCircle, Circle, PlayCircle, FileText, ArrowLeft, Download, ExternalLink } from "lucide-react";

export default async function StudentClassroomPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lessonId?: string }>;
}) {
  const { id: courseId } = await params;
  const { lessonId } = await searchParams;
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch student enrollment
  const enrollment = await db.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId: user.id,
        courseId,
      },
    },
    include: {
      lessonProgress: true,
    },
  });

  if (!enrollment) {
    redirect(`/courses`);
  }

  // Fetch course details with sections & lessons
  const course = await db.course.findUnique({
    where: { id: courseId },
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
    redirect("/dashboard/courses");
  }

  // Find all lessons in order
  const allLessons = course.sections.flatMap((sec) => sec.lessons);
  if (allLessons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <p className="text-muted-foreground">This course doesn&apos;t have any lessons yet.</p>
        <Link href="/" className="text-primary hover:underline mt-4 text-sm font-semibold">Back to Home</Link>
      </div>
    );
  }

  // Select active lesson
  const activeLesson = allLessons.find((l) => l.id === lessonId) || allLessons[0];

  // Find progress for active lesson
  const activeProgress = enrollment.lessonProgress.find((p) => p.lessonId === activeLesson.id);
  const watchTime = activeProgress ? activeProgress.watchTime : 0;
  const isCompleted = activeProgress ? activeProgress.isCompleted : false;

  // Server Action to manually toggle text/download lesson progress
  async function toggleLessonProgress() {
    "use server";
    if (!enrollment) return;
    const session = await getSessionUser();
    if (!session) return;

    const nextCompletedState = !isCompleted;

    // Call API / db directly
    await db.lessonProgress.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId: activeLesson.id,
        },
      },
      update: {
        isCompleted: nextCompletedState,
        completedAt: nextCompletedState ? new Date() : null,
      },
      create: {
        enrollmentId: enrollment.id,
        lessonId: activeLesson.id,
        isCompleted: nextCompletedState,
        completedAt: nextCompletedState ? new Date() : null,
      },
    });

    // Recalculate enrollment progress
    const totalCount = await db.lesson.count({
      where: {
        section: { courseId },
        isPublished: true,
      },
    });

    if (totalCount > 0) {
      const completedCount = await db.lessonProgress.count({
        where: {
          enrollmentId: enrollment.id,
          isCompleted: true,
          lesson: { isPublished: true },
        },
      });

      const progressPercentage = parseFloat(((completedCount / totalCount) * 100).toFixed(2));

      await db.enrollment.update({
        where: { id: enrollment.id },
        data: {
          progressPercentage,
          lastAccessedAt: new Date(),
        },
      });
    }

    redirect(`/dashboard/courses/${courseId}/learn?lessonId=${activeLesson.id}`);
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar - Lessons Outline */}
      <aside className="w-80 border-r border-border bg-card flex flex-col h-full shrink-0">
        <div className="p-4 border-b border-border space-y-2">
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-semibold">
            <ArrowLeft className="h-3 w-3" /> Back to Catalog
          </Link>
          <h2 className="font-extrabold text-foreground text-lg line-clamp-1">{course.title}</h2>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2 relative">
            <div
              className="bg-primary h-full rounded-full transition-all"
              style={{ width: `${enrollment.progressPercentage}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-muted-foreground">{enrollment.progressPercentage}% Completed</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {course.sections.map((section) => (
            <div key={section.id} className="space-y-2">
              <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">{section.title}</h3>
              <div className="space-y-1">
                {section.lessons.map((lesson) => {
                  const progressRec = enrollment.lessonProgress.find((p) => p.lessonId === lesson.id);
                  const complete = progressRec ? progressRec.isCompleted : false;
                  const isActive = lesson.id === activeLesson.id;

                  return (
                    <Link
                      key={lesson.id}
                      href={`/dashboard/courses/${courseId}/learn?lessonId=${lesson.id}`}
                      className={`flex items-start gap-2.5 p-2.5 rounded-md text-xs font-semibold transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-slate-50 dark:hover:bg-slate-900/40"
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {complete ? (
                          <CheckCircle className="h-4 w-4 text-emerald-500 fill-emerald-100 dark:fill-transparent" />
                        ) : (
                          <Circle className="h-4 w-4 text-slate-400" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <span className="line-clamp-2 leading-tight">{lesson.title}</span>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase">
                          {lesson.type === "VIDEO" ? <PlayCircle className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                          <span>{lesson.type}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Workspace Viewer */}
      <main className="flex-1 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/10">
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 max-w-4xl w-full mx-auto">
          {/* Active Lesson Title & Type */}
          <div className="border-b border-border pb-4">
            <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
              {activeLesson.type} Lecture
            </span>
            <h1 className="text-2xl font-black text-foreground mt-2">{activeLesson.title}</h1>
          </div>

          {/* Lesson Content Renderer */}
          <div className="space-y-6">
            {activeLesson.type === "VIDEO" && activeLesson.videoUrl && (
              <LearningPlayer
                lessonId={activeLesson.id}
                videoUrl={activeLesson.videoUrl}
                initialWatchTime={watchTime}
                onCompleted={() => {}}
              />
            )}

            {activeLesson.type === "TEXT" && (
              <div className="bg-card border border-border p-6 rounded-lg shadow-sm space-y-6">
                <div
                  className="prose dark:prose-invert text-sm text-foreground leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: activeLesson.content || "This reading lesson has no content yet." }}
                />

                <form action={toggleLessonProgress} className="border-t border-border pt-6 flex justify-end">
                  <button
                    type="submit"
                    className={`font-semibold text-xs px-5 py-2.5 rounded-md cursor-pointer transition-colors flex items-center gap-1.5 ${
                      isCompleted
                        ? "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        : "bg-primary hover:bg-primary/90 text-primary-foreground"
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : null}
                    {isCompleted ? "Completed (Click to undo)" : "Mark as Complete"}
                  </button>
                </form>
              </div>
            )}

            {activeLesson.type === "DOWNLOAD" && (
              <div className="bg-card border border-border p-8 rounded-lg shadow-sm text-center max-w-md mx-auto space-y-4">
                <Download className="h-10 w-10 text-primary mx-auto" />
                <h3 className="font-bold text-base text-foreground">Exercise Files & Resources</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Download the files associated with this lesson to follow along with the exercises.
                </p>
                <div className="flex gap-2 justify-center">
                  <a
                    href={activeLesson.videoUrl || "#"}
                    download
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download File
                  </a>
                  <form action={toggleLessonProgress}>
                    <button
                      type="submit"
                      className="border border-border text-foreground hover:bg-muted font-semibold text-xs px-4 py-2 rounded-md transition-colors"
                    >
                      {isCompleted ? "Mark Uncomplete" : "Mark Complete"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
