"use client";

import { useEffect, useState } from "react";
import { usePlannerStore } from "@/store/plannerStore";
import { Profile } from "@/lib/types";
import Sidebar from "@/components/sidebar/Sidebar";

interface Props {
  userId: string;
  initialProfile: Profile | null;
  children: React.ReactNode;
}

export default function PlannerProvider({
  userId,
  initialProfile,
  children,
}: Props) {
  const { setProfile, fetchPages } = usePlannerStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setProfile(initialProfile);
    fetchPages(userId);
  }, [userId, initialProfile, setProfile, fetchPages]);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 md:hidden">
            <Sidebar userId={userId} onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar userId={userId} />
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed bottom-4 left-4 z-30 w-12 h-12 bg-brand-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-brand-600 transition-colors"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
    </div>
  );
}
