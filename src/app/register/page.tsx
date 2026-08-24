import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function RegisterPage() {
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

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-8 rounded-3xl shadow-sm max-w-sm w-full space-y-6">
          <div className="text-center space-y-1.5">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Create Account</h2>
            <p className="text-xs text-slate-500 leading-relaxed">Sign up to start learning or teaching.</p>
          </div>

          <form className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                placeholder="Jane Doe"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-xl px-4 py-3 text-xs text-foreground outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600/20"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                placeholder="you@domain.com"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-xl px-4 py-3 text-xs text-foreground outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600/20"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
              <input
                type="password"
                placeholder="Min 8 characters"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-xl px-4 py-3 text-xs text-foreground outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600/20"
                required
              />
            </div>

            <div className="pt-2">
              <Link
                href="/courses"
                className="block text-center bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md shadow-violet-500/20 w-full"
              >
                Create Account
              </Link>
            </div>
          </form>

          <div className="text-center text-[10px] text-slate-500 font-medium">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-violet-600 hover:text-violet-700">Sign In</Link>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t border-slate-100 dark:border-slate-800/40 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Lernexa LMS. All rights reserved.
      </footer>
    </div>
  );
}
