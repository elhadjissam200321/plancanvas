import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/Header";

function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return url.startsWith("http://") || url.startsWith("https://");
}

export default async function LandingPage() {
  if (isSupabaseConfigured()) {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect("/planner");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-indigo-50">
      {/* Nav */}
      <Header />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-12 md:pt-20 pb-12 md:pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
          Free to start — no credit card required
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 md:mb-6 leading-tight">
          Your ideas,{" "}
          <span className="text-brand-500">beautifully planned</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-8 md:mb-10 px-2">
          Draw, sketch, and write on an infinite canvas. Organize multiple
          pages, save to the cloud, and access your planner from any device.
        </p>
        <div className="flex items-center justify-center gap-3 md:gap-4 flex-wrap px-4">
          <Link
            href="/signup"
            className="bg-brand-500 hover:bg-brand-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg transition-colors shadow-lg shadow-brand-500/25"
          >
            Start Planning for Free
          </Link>
          <Link
            href="/login"
            className="bg-white hover:bg-slate-50 text-slate-700 px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg transition-colors border border-slate-200"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {[
            {
              icon: "✏️",
              title: "Powerful Drawing Canvas",
              desc: "Powered by Excalidraw — draw, erase, annotate, and sketch with a full suite of tools.",
            },
            {
              icon: "☁️",
              title: "Cloud Sync",
              desc: "Your pages save automatically and sync across all devices. Never lose your work.",
            },
            {
              icon: "📄",
              title: "Multi-Page Planner",
              desc: "Create and manage multiple pages. Rename, reorder, and delete with ease.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-5 md:p-6 border border-slate-100 shadow-sm"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-slate-800 text-lg mb-2">
                {f.title}
              </h3>
              <p className="text-slate-500 text-sm md:text-base">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-8 md:mb-12">
          Simple, honest pricing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200">
            <div className="text-slate-500 font-medium mb-2">Free</div>
            <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">$0</div>
            <div className="text-slate-400 text-sm mb-4 md:mb-6">Forever free</div>
            <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
              {["Up to 3 pages", "Full drawing canvas", "Cloud save"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2 text-slate-600 text-sm md:text-base">
                    <svg
                      className="w-4 h-4 text-green-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {item}
                  </li>
                )
              )}
            </ul>
            <Link
              href="/signup"
              className="block text-center w-full py-2.5 md:py-3 rounded-lg border border-brand-500 text-brand-500 font-medium hover:bg-brand-50 transition-colors"
            >
              Get Started
            </Link>
          </div>

          <div className="bg-brand-500 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-white/20 text-white text-xs px-2 py-1 rounded-full font-medium">
              Popular
            </div>
            <div className="font-medium mb-2 text-brand-100">Premium</div>
            <div className="text-3xl md:text-4xl font-bold mb-1">$9</div>
            <div className="text-brand-200 text-sm mb-4 md:mb-6">per month</div>
            <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
              {[
                "Unlimited pages",
                "Full drawing canvas",
                "Cloud sync",
                "Priority support",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-white text-sm md:text-base">
                  <svg
                    className="w-4 h-4 text-white flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="block text-center w-full py-2.5 md:py-3 rounded-lg bg-white text-brand-600 font-semibold hover:bg-brand-50 transition-colors"
            >
              Upgrade to Premium
            </Link>
          </div>
        </div>
      </section>

      <footer className="text-center py-6 md:py-8 text-slate-400 text-sm border-t border-slate-100 mt-8 px-4">
        © {new Date().getFullYear()} PlanCanvas. All rights reserved.
      </footer>
    </main>
  );
}
