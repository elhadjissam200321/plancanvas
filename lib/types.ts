export interface Page {
  id: string;
  user_id: string;
  title: string;
  content: string | null; // JSON string of Excalidraw elements
  created_at: string;
  updated_at: string;
  order_index: number;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: "free" | "premium";
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: string | null;
  created_at: string;
}

export interface ExcalidrawData {
  elements: unknown[];
  appState: Record<string, unknown>;
  files: Record<string, unknown>;
}
