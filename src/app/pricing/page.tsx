import Link from "next/link";
import { GraduationCap, Check } from "lucide-react";

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      desc: "Perfect for individual teachers and mentors.",
      features: ["Single Instructor Portal", "Standard Video Players", "Up to 50 active learners", "Basic analytics"],
    },
    {
      name: "Professional",
      price: "$99",
      period: "/month",
      desc: "For growing academies and medium educators.",
      features: ["Multi-instructor accounts", "Custom domain binding", "Unlimited learners", "Advanced quiz templates", "Email campaigns Integration"],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      desc: "For large institutions and corporate portals.",
      features: ["SLA support contracts", "Departmental learning hierarchies", "SSO integration", "Dedicated database clusters", "Custom licensing"],
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

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-16 space-y-12">
        <div className="text-center space-y-3">
          <span className="bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border border-violet-100 dark:border-violet-900/50">
            Flexible Plans
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Transparent Pricing
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            Choose the best plan to launch and scale your online courses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-sm flex flex-col justify-between relative ${
                plan.popular
                  ? "border-violet-600 dark:border-violet-500 ring-2 ring-violet-600/10 dark:ring-violet-500/15"
                  : "border-slate-200/60 dark:border-slate-800/60"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-violet-600 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{plan.desc}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-950 dark:text-white">{plan.price}</span>
                  <span className="text-xs text-slate-400 font-bold">{plan.period}</span>
                </div>

                <ul className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800/40">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                      <Check className="h-4 w-4 text-violet-600 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <Link
                  href="/register"
                  className={`block text-center font-bold text-xs py-3.5 rounded-xl transition-all ${
                    plan.popular
                      ? "bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-500/20"
                      : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800"
                  }`}
                >
                  Get Started
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
