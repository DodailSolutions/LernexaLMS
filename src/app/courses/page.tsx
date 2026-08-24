import Link from "next/link";
import { getSessionUser } from "@/features/auth/server";
import { db } from "@/lib/db";
import { BookOpen, Clock, Users, Star, Search, Filter, GraduationCap } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CoursesCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; categoryId?: string; level?: string }>;
}) {
  const { search = "", categoryId = "", level = "" } = await searchParams;
  const user = await getSessionUser();

  let categories: any[] = [];
  let courses: any[] = [];
  let dbError = null;

  try {
    categories = await db.category.findMany({
      orderBy: { name: "asc" },
    });

    courses = await db.course.findMany({
      where: {
        status: "PUBLISHED",
        categoryId: categoryId || undefined,
        level: level || undefined,
        OR: search
          ? [
              { title: { contains: search } },
              { subtitle: { contains: search } },
            ]
          : undefined,
      },
      include: {
        instructor: {
          select: { name: true },
        },
        category: {
          select: { name: true },
        },
        enrollments: {
          select: { id: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
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

  return (
    <div className="min-h-screen bg-[#fafbff] dark:bg-[#0b0f19] flex flex-col">
      {/* Navbar */}
      <header className="border-b border-slate-200/60 dark:border-slate-800/40 backdrop-blur-md bg-white/70 dark:bg-[#0b0f19]/70 px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-violet-600 to-indigo-600 p-2 rounded-xl text-white shadow-md shadow-violet-500/20">
            <GraduationCap className="h-6 w-6" />
          </div>
          <Link href="/" className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
            Lernexa<span className="text-violet-600 dark:text-violet-400">LMS</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <Link
              href="/instructor/courses"
              className="text-xs font-bold bg-primary text-primary-foreground px-4 py-2 rounded-md"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold text-slate-700 dark:text-slate-300 px-3 py-2">
                Sign In
              </Link>
              <Link href="/register" className="text-sm font-bold bg-violet-600 text-white px-4 py-2 rounded-lg">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-6xl w-full mx-auto px-4 py-10 flex-grow flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-5 rounded-2xl shadow-sm space-y-6">
            <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Filter className="h-4 w-4 text-violet-600" />
              Filter Catalog
            </h3>

            {/* Category Filter */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Categories</label>
              <div className="flex flex-col gap-1.5">
                <Link
                  href="/courses"
                  className={`text-xs font-semibold px-2 py-1.5 rounded transition-colors ${
                    !categoryId ? "bg-violet-50 dark:bg-violet-950/20 text-violet-600" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  }`}
                >
                  All Categories
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/courses?categoryId=${cat.id}&level=${level}&search=${search}`}
                    className={`text-xs font-semibold px-2 py-1.5 rounded transition-colors ${
                      categoryId === cat.id ? "bg-violet-50 dark:bg-violet-950/20 text-violet-600" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Difficulty Level Filter */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Difficulty</label>
              <div className="flex flex-col gap-1.5">
                {["", "Beginner", "Intermediate", "Advanced", "All Levels"].map((lvl) => (
                  <Link
                    key={lvl}
                    href={`/courses?categoryId=${categoryId}&level=${lvl}&search=${search}`}
                    className={`text-xs font-semibold px-2 py-1.5 rounded transition-colors ${
                      level === lvl ? "bg-violet-50 dark:bg-violet-950/20 text-violet-600" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    {lvl || "All Levels"}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Content Catalog Grid */}
        <main className="flex-1 space-y-6">
          {/* Search bar form */}
          <form className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-4 rounded-2xl shadow-sm flex items-center gap-3">
            <Search className="h-5 w-5 text-slate-400 shrink-0" />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search premium courses..."
              className="w-full bg-transparent border-0 outline-none text-sm text-foreground focus:ring-0 placeholder-slate-400"
            />
            {categoryId && <input type="hidden" name="categoryId" value={categoryId} />}
            {level && <input type="hidden" name="level" value={level} />}
            <button
              type="submit"
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Courses List */}
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded">
                        {course.category?.name || "General"}
                      </span>
                      <span className="flex items-center gap-0.5 text-xs text-amber-500 font-bold">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> 4.8
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-lg text-slate-900 dark:text-white line-clamp-1">
                        <Link href={`/courses/${course.slug}`} className="hover:text-violet-600 transition-colors">
                          {course.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {course.subtitle || "No course subtitle provided."}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-[10px] text-slate-500 dark:text-slate-400 font-bold border-t border-slate-100 dark:border-slate-800/40 pt-4">
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {course.duration} hours</span>
                      <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {course.level}</span>
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {course.enrollments.length} enrolled</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/30 px-6 py-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                    <span className="text-lg font-black text-slate-950 dark:text-white">
                      {course.price.toString() === "0" ? "Free" : `₹${parseFloat(course.price.toString()).toLocaleString()}`}
                    </span>
                    <Link
                      href={`/courses/${course.slug}`}
                      className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900">
              <BookOpen className="h-12 w-12 text-slate-300 dark:text-slate-800 mx-auto mb-4" />
              <h3 className="font-bold text-lg text-foreground">No courses found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1.5 leading-relaxed">
                We couldn&apos;t find any courses matching your search criteria. Try removing filters or searching for another keyword.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
