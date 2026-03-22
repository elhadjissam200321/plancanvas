import Link from "next/link";
import { redirect } from "next/navigation";

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
      <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </div>
          <span className="font-bold text-xl text-slate-800">PlanCanvas</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
          Free to start — no credit card required
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Your ideas,{" "}
          <span className="text-brand-500">beautifully planned</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10">
          Draw, sketch, and write on an infinite canvas. Organize multiple
          pages, save to the cloud, and access your planner from any device.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/signup"
            className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors shadow-lg shadow-brand-500/25"
          >
            Start Planning for Free
          </Link>
          <Link
            href="/login"
            className="bg-white hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-xl font-semibold text-lg transition-colors border border-slate-200"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid md:grid-cols-3 gap-6">
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
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-slate-800 text-lg mb-2">
                {f.title}
              </h3>
              <p className="text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
          Simple, honest pricing
        </h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-8 border border-slate-200">
            <div className="text-slate-500 font-medium mb-2">Free</div>
            <div className="text-4xl font-bold text-slate-900 mb-1">$0</div>
            <div className="text-slate-400 text-sm mb-6">Forever free</div>
            <ul className="space-y-3 mb-8">
              {["Up to 3 pages", "Full drawing canvas", "Cloud save"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2 text-slate-600">
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
              className="block text-center w-full py-3 rounded-lg border border-brand-500 text-brand-500 font-medium hover:bg-brand-50 transition-colors"
            >
              Get Started
            </Link>
          </div>

          <div className="bg-brand-500 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-white/20 text-white text-xs px-2 py-1 rounded-full font-medium">
              Popular
            </div>
            <div className="font-medium mb-2 text-brand-100">Premium</div>
            <div className="text-4xl font-bold mb-1">$9</div>
            <div className="text-brand-200 text-sm mb-6">per month</div>
            <ul className="space-y-3 mb-8">
              {[
                "Unlimited pages",
                "Full drawing canvas",
                "Cloud sync",
                "Priority support",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-white">
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
              className="block text-center w-full py-3 rounded-lg bg-white text-brand-600 font-semibold hover:bg-brand-50 transition-colors"
            >
              Upgrade to Premium
            </Link>
          </div>
        </div>
      </section>

      <footer className="text-center py-8 text-slate-400 text-sm border-t border-slate-100 mt-8">
        © {new Date().getFullYear()} PlanCanvas. All rights reserved.
      </footer>
    </main>
  );
}
