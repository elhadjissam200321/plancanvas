import { redirect } from "next/navigation";
import SettingsClient from "@/components/settings/SettingsClient";

function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return url.startsWith("http://") || url.startsWith("https://");
}

export default async function SettingsPage() {
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

  const { count: pageCount } = await supabase
    .from("pages")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  return (
    <SettingsClient
      profile={profile}
      pageCount={pageCount ?? 0}
      email={user.email ?? ""}
    />
  );
}
