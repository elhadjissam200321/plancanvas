import { createBrowserClient } from "@supabase/ssr";

function isConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return url.startsWith("http://") || url.startsWith("https://");
}

export function createClient() {
  if (!isConfigured()) {
    throw new Error(
      "Supabase is not configured. Please add your Supabase credentials to .env.local"
    );
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
