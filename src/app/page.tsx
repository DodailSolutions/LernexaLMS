import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  Users,
  ShieldCheck,
  CreditCard,
  LayoutDashboard,
  Check,
  ChevronRight,
  Star,
  Clock,
  ArrowRight,
  Sparkles,
  Globe,
  Award,
  Activity,
  Flame
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafbff] dark:bg-[#0b0f19] transition-colors duration-300">
      
      {/* 1. Header with Glassmorphism */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 dark:border-slate-800/40 backdrop-blur-md bg-white/70 dark:bg-[#0b0f19]/70 px-4 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-violet-600 to-indigo-600 p-2 rounded-xl text-white shadow-md shadow-violet-500/20">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
            Lernexa<span className="text-violet-600 dark:text-violet-400">LMS</span>
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <Link href="/courses" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Marketplace</Link>
          <Link href="/pricing" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Pricing</Link>
          <Link href="/blog" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Blog</Link>
          <Link href="/faq" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">FAQs</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors px-3 py-2"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="text-sm font-bold bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-violet-500/20 hover:shadow-violet-600/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex-grow">
        
        {/* 2. Hero Section with Modern EdTech Aesthetic */}
        <section className="relative py-20 lg:py-32 px-4 lg:px-8 overflow-hidden">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
            
            {/* Left Text Column */}
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/50 text-violet-600 dark:text-violet-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide">
                <Sparkles className="h-3.5 w-3.5" />
                ThemeForest & Envato Marketplace Ready
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                A Complete, Premium <br />
                <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-blue-600 bg-clip-text text-transparent">
                  LMS & Marketplace
                </span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Launch a self-hosted LMS portal or a multi-instructor marketplace. Built on Next.js 15, TypeScript, MySQL, and Prisma with cryptographically-signed license controls.
              </p>
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/register"
                  className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-600/35 transition-all hover:-translate-y-0.5 flex items-center gap-2"
                >
                  Start Classroom
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/courses"
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold px-8 py-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all flex items-center gap-2"
                >
                  Explore Courses
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/50 flex flex-wrap justify-center lg:justify-start items-center gap-6 text-slate-400 dark:text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Features:</span>
                <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  <Check className="h-4 w-4 text-emerald-500" /> Custom Auth
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  <Check className="h-4 w-4 text-emerald-500" /> RBAC Matrix
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  <Check className="h-4 w-4 text-emerald-500" /> Video Player
                </span>
              </div>
            </div>

            {/* Right Card / Interactive Element Column */}
            <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
              {/* Decorative Gradients */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full blur-[100px] opacity-20 -z-10" />

              {/* Classroom Dashboard Mockup */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-2xl p-6 space-y-6 relative z-10 transition-all hover:scale-[1.01]">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="h-3 w-3 rounded-full bg-rose-500" />
                    <span className="h-3 w-3 rounded-full bg-amber-500" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500" />
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-bold ml-2">Classroom Progress</span>
                  </div>
                  <span className="text-xs font-bold text-violet-600 bg-violet-50 dark:bg-violet-950/30 px-2 py-0.5 rounded">Active</span>
                </div>

                {/* Dashboard Metrics */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/40 text-center">
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">Watch Time</span>
                    <h4 className="text-lg font-extrabold text-slate-800 dark:text-white mt-1">12.5 hrs</h4>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/40 text-center">
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">Progress</span>
                    <h4 className="text-lg font-extrabold text-slate-800 dark:text-white mt-1">68.2%</h4>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/40 text-center">
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">Lessons</span>
                    <h4 className="text-lg font-extrabold text-slate-800 dark:text-white mt-1">18 / 24</h4>
                  </div>
                </div>

                {/* Interactive Player Mock */}
                <div className="bg-slate-955 dark:bg-slate-950 rounded-xl overflow-hidden aspect-video border border-slate-200 dark:border-slate-800/60 relative group flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-slate-950/20 z-0" />
                  <div className="z-10 text-center text-white space-y-2">
                    <span className="bg-violet-600/90 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">Video Lecture</span>
                    <h5 className="font-bold text-sm">02. Initial Database Setup</h5>
                  </div>
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] text-slate-300 font-semibold z-10">
                    <span>08:45 / 12:30</span>
                    <span>70% watched</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700/60 z-10">
                    <div className="h-full bg-violet-500 w-[70%]" />
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl shadow-xl z-20 flex items-center gap-2.5 animate-bounce-slow">
                <div className="bg-emerald-100 text-emerald-600 p-1.5 rounded-lg"><Check className="h-4 w-4" /></div>
                <div>
                  <h6 className="text-xs font-black text-slate-900 dark:text-white">Certificate Earned</h6>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">1 minute ago</span>
                </div>
              </div>
            </div>

          </div>
          {/* Abstract Grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-20" />
        </section>

        {/* 3. Stat Grid Counters */}
        <section className="py-12 border-y border-slate-200/60 dark:border-slate-800/40 bg-white/50 dark:bg-slate-900/10">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <h4 className="text-3xl md:text-4xl font-extrabold text-violet-600 dark:text-violet-400">12K+</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1 uppercase tracking-wider">Active Learners</p>
            </div>
            <div className="text-center">
              <h4 className="text-3xl md:text-4xl font-extrabold text-violet-600 dark:text-violet-400">250+</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1 uppercase tracking-wider">Premium Courses</p>
            </div>
            <div className="text-center">
              <h4 className="text-3xl md:text-4xl font-extrabold text-violet-600 dark:text-violet-400">4.8★</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1 uppercase tracking-wider">Average Rating</p>
            </div>
            <div className="text-center">
              <h4 className="text-3xl md:text-4xl font-extrabold text-violet-600 dark:text-violet-400">99.9%</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1 uppercase tracking-wider">Uptime Promise</p>
            </div>
          </div>
        </section>

        {/* 4. Core Features Grid */}
        <section className="py-20 px-4 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-3">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Enterprise Grade LMS Platform
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Designed for individual coaches, university institutes, and corporate compliance training dashboards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group hover:-translate-y-1">
              <div className="bg-violet-100 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-inner transition-transform group-hover:scale-105">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-lg mb-2 text-slate-900 dark:text-white">Curriculum Builder</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Add sections, reorder video lessons, articles, or downloadable worksheets using standard drag and drop controls.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group hover:-translate-y-1">
              <div className="bg-violet-100 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-inner transition-transform group-hover:scale-105">
                <CreditCard className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-lg mb-2 text-slate-900 dark:text-white">Pluggable Payments</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Integrated cart system supports Stripe payment checkouts, dynamic multi-use coupon discounts, and instructor payout request records.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group hover:-translate-y-1">
              <div className="bg-violet-100 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-inner transition-transform group-hover:scale-105">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-lg mb-2 text-slate-900 dark:text-white">Secure Licensing</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Verify activations dynamically over secure HTTPS using cryptographic public key signatures with offline grace period caching.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group hover:-translate-y-1">
              <div className="bg-violet-100 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-inner transition-transform group-hover:scale-105">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-lg mb-2 text-slate-900 dark:text-white">Corporate Portal</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Organizations can buy course seats in bulk, organize members into departments, and track completion progress charts.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group hover:-translate-y-1">
              <div className="bg-violet-100 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-inner transition-transform group-hover:scale-105">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-lg mb-2 text-slate-900 dark:text-white">Gamified Streak Engine</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Encourage student retention with XP points accumulation, learning badge rewards, and completion certificate verifiers.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group hover:-translate-y-1">
              <div className="bg-violet-100 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-inner transition-transform group-hover:scale-105">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-lg mb-2 text-slate-900 dark:text-white">Multi-lingual Scope</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Localized layout dictionary ready. Toggle easily between languages (Hindi, Arabic, English, Spanish) with formatted currency tags.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Marketplace Featured Course Cards */}
        <section className="bg-slate-50 dark:bg-[#0c1220]/40 py-20 px-4 lg:px-8 border-y border-slate-200/60 dark:border-slate-800/40">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-16">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Featured Courses</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Pick from the highest rated courses in the marketplace.</p>
              </div>
              <Link href="/courses" className="text-sm font-bold text-violet-600 hover:text-violet-700 dark:text-violet-400 flex items-center gap-1 hover:underline">
                View All Courses
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Course Card 1 */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between hover:-translate-y-0.5">
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      Development
                    </span>
                    <span className="flex items-center gap-0.5 text-xs text-amber-500 font-bold">
                      <Star className="h-3.5 w-3.5 fill-amber-500" /> 4.9
                    </span>
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white line-clamp-1">Next.js 15 Complete Course</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    Build production-ready web apps using App Router, React Server Components, and Prisma database connections.
                  </p>
                  <div className="flex items-center gap-4 text-[10px] text-slate-500 dark:text-slate-400 font-bold border-t border-slate-100 dark:border-slate-800/60 pt-4">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> 18 hours</span>
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> 3.2K enrolled</span>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/30 px-6 py-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                  <span className="text-lg font-black text-slate-950 dark:text-white">₹4,999</span>
                  <Link href="/courses" className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline">
                    View Course
                  </Link>
                </div>
              </div>

              {/* Course Card 2 */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between hover:-translate-y-0.5">
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      Database
                    </span>
                    <span className="flex items-center gap-0.5 text-xs text-amber-500 font-bold">
                      <Star className="h-3.5 w-3.5 fill-amber-500" /> 4.8
                    </span>
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white line-clamp-1">Prisma & MySQL Architecture</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    Learn database normalization, write transaction queries, and optimize composite indexes for scaling write loads.
                  </p>
                  <div className="flex items-center gap-4 text-[10px] text-slate-500 dark:text-slate-400 font-bold border-t border-slate-100 dark:border-slate-800/60 pt-4">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> 12 hours</span>
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> 1.8K enrolled</span>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/30 px-6 py-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                  <span className="text-lg font-black text-slate-950 dark:text-white">₹3,499</span>
                  <Link href="/courses" className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline">
                    View Course
                  </Link>
                </div>
              </div>

              {/* Course Card 3 */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between hover:-translate-y-0.5">
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      Security
                    </span>
                    <span className="flex items-center gap-0.5 text-xs text-amber-500 font-bold">
                      <Star className="h-3.5 w-3.5 fill-amber-500" /> 4.7
                    </span>
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white line-clamp-1">OWASP Defenses for Next.js Developers</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    Protect APIs from SQL injection, prevent cross-site scripting vulnerabilities, and secure file uploads dynamically.
                  </p>
                  <div className="flex items-center gap-4 text-[10px] text-slate-500 dark:text-slate-400 font-bold border-t border-slate-100 dark:border-slate-800/60 pt-4">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> 8 hours</span>
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> 920 enrolled</span>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/30 px-6 py-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                  <span className="text-lg font-black text-slate-950 dark:text-white">₹2,999</span>
                  <Link href="/courses" className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline">
                    View Course
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Pricing Section */}
        <section className="py-20 px-4 max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Flexible Commercial Licensing</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Choose the package that aligns with your educational business goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Standard License */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-8 rounded-2xl shadow-sm relative flex flex-col justify-between transition-all hover:border-slate-350 dark:hover:border-slate-700">
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">Regular License</h3>
                  <p className="text-xs text-slate-500">Perfect for single instructor setups.</p>
                </div>
                <div className="flex items-baseline gap-1 text-slate-900 dark:text-white">
                  <span className="text-4xl font-black">₹4,999</span>
                  <span className="text-xs text-slate-400">/ single site</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-400 font-semibold border-t border-slate-100 dark:border-slate-800/60 pt-6">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Single production domain</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> 2 local dev activations</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> 6 months support access</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Free minor version updates</li>
                </ul>
              </div>
              <button className="bg-slate-900 dark:bg-slate-800 text-white font-bold text-sm py-3.5 rounded-xl mt-8 hover:bg-slate-850 dark:hover:bg-slate-700 transition-colors w-full cursor-pointer">
                Purchase License
              </button>
            </div>

            {/* Extended License */}
            <div className="bg-white dark:bg-slate-900 border-2 border-violet-500 p-8 rounded-2xl shadow-md relative flex flex-col justify-between transition-all">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-[10px] uppercase font-bold tracking-widest px-4 py-1.5 rounded-full shadow-md shadow-violet-500/20">
                Recommended
              </div>
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">Extended License</h3>
                  <p className="text-xs text-slate-500 font-semibold">Ideal for multi-instructor platforms.</p>
                </div>
                <div className="flex items-baseline gap-1 text-slate-900 dark:text-white">
                  <span className="text-4xl font-black">₹24,999</span>
                  <span className="text-xs text-slate-400">/ multiple sites</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-400 font-semibold border-t border-slate-100 dark:border-slate-800/60 pt-6">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Multi-domain licensing rights</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Unlimited dev installations</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> 12 months premium priority support</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Free lifetime updates access</li>
                </ul>
              </div>
              <button className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm py-3.5 rounded-xl mt-8 shadow-lg shadow-violet-500/20 hover:shadow-violet-600/30 transition-colors w-full cursor-pointer">
                Buy Extended License
              </button>
            </div>
          </div>
        </section>

        {/* 7. FAQs Accordion Grid */}
        <section className="bg-slate-50 dark:bg-[#0c1220]/40 py-20 px-4 lg:px-8 border-t border-slate-200/60 dark:border-slate-800/40">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 space-y-3">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Frequently Asked Questions</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Have queries about deployment or licensing? We have answers.</p>
            </div>

            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-xl shadow-sm">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex justify-between items-center">
                  What tech stack is used in Lernexa LMS?
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-2.5">
                  Lernexa is developed using Next.js 15 (with App Router and Server Actions), TypeScript, MySQL, Prisma ORM, and Tailwind CSS.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-xl shadow-sm">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex justify-between items-center">
                  How does the dynamic client licensing work?
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-2.5">
                  The client communicates over HTTPS with the license server. Responses are cryptographically signed using private keys, which the client validates locally with the embedded public key, guaranteeing security without key leakage.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-xl shadow-sm">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex justify-between items-center">
                  Can I configure other storage engines like Cloudflare R2?
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-2.5">
                  Yes. The media storage layer is fully abstracted. By configuring `.env` storage provider keys, you can toggle between local file writes and cloud-signed buckets (AWS S3 or Cloudflare R2).
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* 8. Footer */}
      <footer className="bg-white dark:bg-[#0b0f19] border-t border-slate-200/60 dark:border-slate-800/40 py-12 px-4 lg:px-8 text-center text-xs text-slate-500 dark:text-slate-400 font-semibold space-y-4">
        <div className="flex flex-wrap justify-center gap-6 text-slate-600 dark:text-slate-400 text-xs mb-4">
          <Link href="/about" className="hover:text-primary hover:underline transition-colors">About Us</Link>
          <Link href="/contact" className="hover:text-primary hover:underline transition-colors">Contact Support</Link>
          <Link href="/faq" className="hover:text-primary hover:underline transition-colors">FAQ</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} Lernexa LMS. Distributable under ThemeForest Commercial Terms.</p>
      </footer>
    </div>
  );
}
