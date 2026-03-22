"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-4 md:px-8 py-4 max-w-7xl mx-auto">
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

      <div className="hidden md:flex items-center gap-4">
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

      <button
        className="md:hidden p-2 text-slate-600 hover:text-slate-900"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-slate-100 p-4 md:hidden z-50">
          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="text-slate-600 hover:text-slate-900 font-medium py-2 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-3 rounded-lg font-medium transition-colors text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
