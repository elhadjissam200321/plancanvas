"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePlannerStore } from "@/store/plannerStore";
import { createClient } from "@/lib/supabase/client";
import { PLANS } from "@/lib/stripe";

interface SidebarProps {
  userId: string;
  onClose?: () => void;
}

export default function Sidebar({ userId, onClose }: SidebarProps) {
  const router = useRouter();
  const {
    pages,
    activePage,
    profile,
    setActivePage,
    createPage,
    deletePage,
    renamePage,
    isSaving,
    unsavedChanges,
  } = usePlannerStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [contextMenu, setContextMenu] = useState<{
    pageId: string;
    x: number;
    y: number;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isPremium = profile?.plan === "premium";
  const maxPages = isPremium ? PLANS.PREMIUM.maxPages : PLANS.FREE.maxPages;
  const canAddPage =
    isPremium || pages.length < PLANS.FREE.maxPages;

  async function handleCreatePage() {
    if (!canAddPage) return;
    await createPage(userId);
  }

  function startEdit(pageId: string, currentTitle: string) {
    setEditingId(pageId);
    setEditTitle(currentTitle);
    setContextMenu(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  async function commitEdit(pageId: string) {
    if (editTitle.trim()) {
      await renamePage(pageId, editTitle.trim());
    }
    setEditingId(null);
  }

  async function handleDelete(pageId: string) {
    setContextMenu(null);
    if (pages.length === 1) return; // keep at least 1
    if (!confirm("Delete this page? This cannot be undone.")) return;
    await deletePage(pageId);
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="w-64 bg-slate-900 flex flex-col h-full select-none">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-500 rounded-md flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4 text-white"
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
          <span className="font-bold text-white">PlanCanvas</span>
          {(isSaving || unsavedChanges) && (
            <span className="ml-auto text-xs text-slate-400">
              {isSaving ? "Saving..." : "Unsaved"}
            </span>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="ml-auto md:hidden p-1 text-slate-400 hover:text-white"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Pages Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Pages
          <span className="ml-1 text-slate-500">
            ({pages.length}
            {!isPremium ? `/${maxPages}` : ""})
          </span>
        </span>
        <button
          onClick={handleCreatePage}
          disabled={!canAddPage}
          title={!canAddPage ? "Upgrade to add more pages" : "New page"}
          className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Page List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
        {pages.map((page) => (
          <div
            key={page.id}
            className={`group flex items-center rounded-md px-2 py-2 cursor-pointer transition-colors ${
              activePage?.id === page.id
                ? "bg-brand-500/20 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
            onClick={() => {
              if (editingId !== page.id) setActivePage(page);
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              setContextMenu({ pageId: page.id, x: e.clientX, y: e.clientY });
            }}
          >
            <svg
              className="w-4 h-4 flex-shrink-0 mr-2 opacity-60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>

            {editingId === page.id ? (
              <input
                ref={inputRef}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={() => commitEdit(page.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitEdit(page.id);
                  if (e.key === "Escape") setEditingId(null);
                }}
                className="bg-transparent border-b border-brand-400 outline-none text-sm flex-1 min-w-0"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="text-sm truncate flex-1">{page.title}</span>
            )}

            {/* Context actions */}
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 ml-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startEdit(page.id, page.title);
                }}
                className="p-0.5 rounded hover:bg-slate-600 text-slate-400 hover:text-white"
                title="Rename"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              {pages.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(page.id);
                  }}
                  className="p-0.5 rounded hover:bg-slate-600 text-slate-400 hover:text-red-400"
                  title="Delete"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Upgrade Banner (free plan) */}
      {!isPremium && (
        <div className="mx-3 mb-3 mt-2 bg-gradient-to-br from-brand-500/20 to-indigo-500/20 border border-brand-500/30 rounded-lg p-3">
          <p className="text-xs text-slate-300 font-medium mb-1">
            {pages.length >= PLANS.FREE.maxPages
              ? "Page limit reached"
              : `${PLANS.FREE.maxPages - pages.length} page${
                  PLANS.FREE.maxPages - pages.length !== 1 ? "s" : ""
                } left`}
          </p>
          <p className="text-xs text-slate-400 mb-2">
            Upgrade for unlimited pages
          </p>
          <Link
            href="/settings"
            className="block text-center text-xs bg-brand-500 hover:bg-brand-600 text-white px-3 py-1.5 rounded-md font-medium transition-colors"
          >
            Upgrade to Premium
          </Link>
        </div>
      )}
      {isPremium && (
        <div className="mx-3 mb-3 mt-2 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-lg p-2">
          <p className="text-xs text-yellow-400 font-medium flex items-center gap-1">
            <span>⭐</span> Premium Plan
          </p>
        </div>
      )}

      {/* Bottom Nav */}
      <div className="border-t border-slate-700/50 px-2 py-2 space-y-0.5">
        <Link
          href="/settings"
          className="flex items-center gap-2 px-2 py-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-2 py-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setContextMenu(null)}
          />
          <div
            className="fixed z-50 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 min-w-[140px]"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <button
              className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
              onClick={() => {
                const page = pages.find((p) => p.id === contextMenu.pageId);
                if (page) startEdit(page.id, page.title);
              }}
            >
              Rename
            </button>
            {pages.length > 1 && (
              <button
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700"
                onClick={() => handleDelete(contextMenu.pageId)}
              >
                Delete
              </button>
            )}
          </div>
        </>
      )}
    </aside>
  );
}
