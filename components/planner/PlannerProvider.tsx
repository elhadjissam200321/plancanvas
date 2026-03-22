"use client";

import { useEffect } from "react";
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

  useEffect(() => {
    setProfile(initialProfile);
    fetchPages(userId);
  }, [userId, initialProfile, setProfile, fetchPages]);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar userId={userId} />
      <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
    </div>
  );
}
