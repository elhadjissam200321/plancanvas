import { create } from "zustand";
import { Page, Profile, ExcalidrawData } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

interface PlannerState {
  pages: Page[];
  activePage: Page | null;
  profile: Profile | null;
  isSaving: boolean;
  isLoading: boolean;
  unsavedChanges: boolean;

  setProfile: (profile: Profile | null) => void;
  setPages: (pages: Page[]) => void;
  setActivePage: (page: Page | null) => void;
  setUnsavedChanges: (val: boolean) => void;

  fetchPages: (userId: string) => Promise<void>;
  createPage: (userId: string, title?: string) => Promise<Page | null>;
  deletePage: (pageId: string) => Promise<void>;
  renamePage: (pageId: string, title: string) => Promise<void>;
  savePage: (pageId: string, data: ExcalidrawData) => Promise<void>;
  loadPage: (pageId: string) => Promise<ExcalidrawData | null>;
}

export const usePlannerStore = create<PlannerState>((set, get) => ({
  pages: [],
  activePage: null,
  profile: null,
  isSaving: false,
  isLoading: false,
  unsavedChanges: false,

  setProfile: (profile) => set({ profile }),
  setPages: (pages) => set({ pages }),
  setActivePage: (page) => set({ activePage: page, unsavedChanges: false }),
  setUnsavedChanges: (val) => set({ unsavedChanges: val }),

  fetchPages: async (userId) => {
    set({ isLoading: true });
    const supabase = createClient();
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("user_id", userId)
      .order("order_index", { ascending: true });

    if (!error && data) {
      set({ pages: data as Page[] });
      if (data.length > 0 && !get().activePage) {
        set({ activePage: data[0] as Page });
      }
    }
    set({ isLoading: false });
  },

  createPage: async (userId, title = "Untitled Page") => {
    const supabase = createClient();
    const { pages } = get();
    const maxOrder = pages.reduce(
      (max, p) => Math.max(max, p.order_index),
      -1
    );

    const { data, error } = await supabase
      .from("pages")
      .insert({
        user_id: userId,
        title,
        content: null,
        order_index: maxOrder + 1,
      })
      .select()
      .single();

    if (!error && data) {
      const newPage = data as Page;
      set((state) => ({
        pages: [...state.pages, newPage],
        activePage: newPage,
      }));
      return newPage;
    }
    return null;
  },

  deletePage: async (pageId) => {
    const supabase = createClient();
    await supabase.from("pages").delete().eq("id", pageId);

    set((state) => {
      const newPages = state.pages.filter((p) => p.id !== pageId);
      let newActivePage = state.activePage;
      if (state.activePage?.id === pageId) {
        newActivePage = newPages.length > 0 ? newPages[0] : null;
      }
      return { pages: newPages, activePage: newActivePage };
    });
  },

  renamePage: async (pageId, title) => {
    const supabase = createClient();
    await supabase.from("pages").update({ title }).eq("id", pageId);

    set((state) => ({
      pages: state.pages.map((p) => (p.id === pageId ? { ...p, title } : p)),
      activePage:
        state.activePage?.id === pageId
          ? { ...state.activePage, title }
          : state.activePage,
    }));
  },

  savePage: async (pageId, data) => {
    set({ isSaving: true });
    const supabase = createClient();
    const content = JSON.stringify(data);
    await supabase
      .from("pages")
      .update({ content, updated_at: new Date().toISOString() })
      .eq("id", pageId);

    set((state) => ({
      isSaving: false,
      unsavedChanges: false,
      pages: state.pages.map((p) =>
        p.id === pageId ? { ...p, content } : p
      ),
    }));
  },

  loadPage: async (pageId) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("pages")
      .select("content")
      .eq("id", pageId)
      .single();

    if (!error && data?.content) {
      try {
        return JSON.parse(data.content) as ExcalidrawData;
      } catch {
        return null;
      }
    }
    return null;
  },
}));
