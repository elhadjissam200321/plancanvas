"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Profile } from "@/lib/types";
import { PLANS } from "@/lib/stripe";

interface Props {
  profile: Profile | null;
  pageCount: number;
  email: string;
}

export default function SettingsClient({ profile, pageCount, email }: Props) {
  const router = useRouter();
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [error, setError] = useState("");

  const isPremium = profile?.plan === "premium";

  async function handleUpgrade() {
    setLoadingCheckout(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Failed to create checkout session");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoadingCheckout(false);
    }
  }

  async function handleManageBilling() {
    setLoadingPortal(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/create-portal", {
        method: "POST",
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Failed to open billing portal");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoadingPortal(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Link
            href="/planner"
            className="text-slate-400 hover:text-slate-700 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Link>
          <h1 className="text-lg font-semibold text-slate-900">Settings</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-8 py-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Account */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-4">
            Account
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-500">Email</span>
              <span className="text-sm text-slate-800 font-medium">{email}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-500">Name</span>
              <span className="text-sm text-slate-800 font-medium">
                {profile?.full_name ?? "—"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-500">Pages used</span>
              <span className="text-sm text-slate-800 font-medium">
                {pageCount}
                {!isPremium ? ` / ${PLANS.FREE.maxPages}` : " (unlimited)"}
              </span>
            </div>
          </div>
        </section>

        {/* Plan */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-4">
            Subscription
          </h2>

          {isPremium ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-brand-50 border border-brand-100 rounded-xl p-4">
                <div className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center text-white text-lg">
                  ⭐
                </div>
                <div>
                  <div className="font-semibold text-slate-900">
                    Premium Plan
                  </div>
                  <div className="text-sm text-slate-500">
                    Status:{" "}
                    <span className="capitalize text-green-600 font-medium">
                      {profile?.subscription_status ?? "active"}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-500">
                You have unlimited pages and all premium features.
              </p>
              <button
                onClick={handleManageBilling}
                disabled={loadingPortal}
                className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-60"
              >
                {loadingPortal ? "Loading..." : "Manage Billing & Cancel"}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 text-lg">
                  📄
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Free Plan</div>
                  <div className="text-sm text-slate-500">
                    {pageCount} of {PLANS.FREE.maxPages} pages used
                  </div>
                </div>
              </div>

              {/* Upgrade card */}
              <div className="bg-gradient-to-br from-brand-500 to-indigo-600 rounded-xl p-5 text-white">
                <div className="font-bold text-lg mb-1">Upgrade to Premium</div>
                <div className="text-brand-100 text-sm mb-3">
                  $9/month • Unlimited pages • Cancel anytime
                </div>
                <ul className="space-y-1.5 mb-4">
                  {["Unlimited pages", "Cloud sync", "Priority support"].map(
                    (item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-sm text-white/90"
                      >
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
                    )
                  )}
                </ul>
                <button
                  onClick={handleUpgrade}
                  disabled={loadingCheckout}
                  className="w-full bg-white text-brand-600 font-semibold py-2.5 rounded-lg hover:bg-brand-50 transition-colors disabled:opacity-70"
                >
                  {loadingCheckout ? "Redirecting..." : "Upgrade Now — $9/mo"}
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
