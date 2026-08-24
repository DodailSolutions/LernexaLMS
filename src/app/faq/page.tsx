import Link from "next/link";
import { GraduationCap, ChevronDown } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      q: "What stack is used in Lernexa?",
      a: "Lernexa is built on Next.js 15, TypeScript, Prisma ORM, PostgreSQL (via Supabase), and Tailwind CSS.",
    },
    {
      q: "How does licensing verification work?",
      a: "Verification is conducted dynamically over secure HTTPS using signed cryptographic public key verification.",
    },
    {
      q: "Can I use external video hosts?",
      a: "Yes. Lernexa supports local video storage, AWS S3, Cloudflare R2, and external links.",
    },
    {
      q: "Does the system support multiple currencies?",
      a: "Yes. All price formats load based on local currency settings.",
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

      <main className="flex-grow max-w-3xl w-full mx-auto px-4 py-16 space-y-10">
        <div className="text-center space-y-3">
          <span className="bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border border-violet-100 dark:border-violet-900/50">
            Support Center
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            Find answers to commonly asked questions about the platform, integration, and licenses.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 shadow-sm space-y-2"
            >
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                {faq.q}
                <ChevronDown className="h-4 w-4 text-violet-600 shrink-0" />
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {faq.a}
              </p>
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
