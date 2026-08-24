import Link from "next/link";
import { GraduationCap, ArrowRight } from "lucide-react";

export default function BlogPage() {
  const posts = [
    {
      title: "Building Production Web Apps with Next.js 15 & RSC",
      excerpt: "Learn how React Server Components can reduce bundle sizes and improve page load speeds.",
      date: "August 24, 2026",
      author: "Jane Doe",
    },
    {
      title: "Abstracting Media Storage using Pluggable Providers",
      excerpt: "A guide to implementing file system uploads, AWS S3, and Cloudflare R2 presigned URLs in Node.js.",
      date: "August 18, 2026",
      author: "John Smith",
    },
    {
      title: "Designing Cryptographically Secure Software Licensing",
      excerpt: "How to implement client-side public key verification and grace periods for self-hosted apps.",
      date: "August 10, 2026",
      author: "Alice Johnson",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafbff] dark:bg-[#0b0f19] flex flex-col justify-between">
      <header className="border-b border-slate-200/60 dark:border-slate-800/40 backdrop-blur-md bg-white/70 dark:bg-[#0b0f19]/70 px-4 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-violet-600 to-indigo-600 p-2 rounded-xl text-white shadow-md shadow-violet-500/20">
            <GraduationCap className="h-6 w-6" />
          </div>
          <Link href="/" className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
            Lernexa<span className="text-violet-600 dark:text-violet-400">LMS</span>
          </Link>
        </div>
      </header>

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 py-16 space-y-12">
        <div className="text-center space-y-3">
          <span className="bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border border-violet-100 dark:border-violet-900/50">
            Tech Blog
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Latest Articles & Resources
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            Read engineering write-ups, EdTech insights, and tips from leading instructors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                <div className="text-[10px] text-slate-400 font-bold flex gap-3">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>By {post.author}</span>
                </div>
                <h3 className="font-black text-base text-slate-900 dark:text-white leading-snug line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-6">
                <Link
                  href="/blog"
                  className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 flex items-center gap-1.5"
                >
                  Read Article
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-6 border-t border-slate-100 dark:border-slate-800/40 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Lernexa LMS. All rights reserved.
      </footer>
    </div>
  );
}
