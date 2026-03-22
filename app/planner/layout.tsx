import { redirect } from "next/navigation";
import PlannerProvider from "@/components/planner/PlannerProvider";

function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return url.startsWith("http://") || url.startsWith("https://");
}

export default async function PlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) {
    redirect("/");
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <PlannerProvider userId={user.id} initialProfile={profile}>
      {children}
    </PlannerProvider>
  );
}
