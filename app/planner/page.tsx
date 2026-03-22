"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { usePlannerStore } from "@/store/plannerStore";
import { ExcalidrawData } from "@/lib/types";
import dynamic from "next/dynamic";

const ExcalidrawCanvas = dynamic(
  () => import("@/components/canvas/ExcalidrawCanvas"),
  { ssr: false }
);

export default function PlannerPage() {
  const searchParams = useSearchParams();
  const { activePage, savePage, loadPage, pages, isLoading } = usePlannerStore();
  const [canvasData, setCanvasData] = useState<ExcalidrawData | null>(null);
  const [canvasKey, setCanvasKey] = useState<string>("");
  const [upgraded, setUpgraded] = useState(false);

  useEffect(() => {
    if (searchParams.get("upgraded") === "true") {
      setUpgraded(true);
      setTimeout(() => setUpgraded(false), 5000);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!activePage) return;

    async function loadData() {
      if (!activePage) return;
      const data = await loadPage(activePage.id);
      setCanvasData(data);
      setCanvasKey(activePage.id);
    }

    loadData();
  }, [activePage?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = useCallback(
    async (data: ExcalidrawData) => {
      if (!activePage) return;
      await savePage(activePage.id, data);
    },
    [activePage, savePage]
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading your planner...</p>
        </div>
      </div>
    );
  }

  if (!activePage && pages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="text-5xl mb-4">📄</div>
          <h2 className="text-xl font-semibold text-slate-700 mb-2">
            No pages yet
          </h2>
          <p className="text-slate-400 text-sm">
            Click the + button in the sidebar to create your first page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      {/* Top Bar */}
      <div className="h-10 border-b border-slate-100 flex items-center px-4 gap-3 flex-shrink-0 bg-white">
        <h1 className="text-sm font-medium text-slate-700 truncate">
          {activePage?.title ?? "Select a page"}
        </h1>
      </div>

      {/* Upgrade Toast */}
      {upgraded && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium">
          <span>🎉</span> Welcome to Premium! Unlimited pages unlocked.
        </div>
      )}

      {/* Canvas */}
      <div className="flex-1 overflow-hidden">
        {activePage && canvasKey === activePage.id && (
          <ExcalidrawCanvas
            key={canvasKey}
            initialData={canvasData}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
}
