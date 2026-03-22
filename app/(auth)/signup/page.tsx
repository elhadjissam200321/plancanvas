"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/planner");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
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
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="text-slate-500 mt-1">Start planning for free today</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <form onSubmit={handleSignup} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-slate-900 placeholder-slate-400"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-slate-900 placeholder-slate-400"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-slate-900 placeholder-slate-400"
                placeholder="Min. 6 characters"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
          <p className="text-center text-slate-400 text-xs mt-4">
            By signing up you agree to our Terms & Privacy Policy.
          </p>
        </div>

        <p className="text-center text-slate-500 mt-6 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-500 hover:text-brand-600 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
