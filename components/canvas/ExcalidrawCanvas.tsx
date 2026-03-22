"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { ExcalidrawData } from "@/lib/types";
import { usePlannerStore } from "@/store/plannerStore";

const Excalidraw = dynamic(
  async () => {
    const mod = await import("@excalidraw/excalidraw");
    return mod.Excalidraw;
  },
  { ssr: false, loading: () => <CanvasLoader /> }
);

function CanvasLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Loading canvas...</p>
      </div>
    </div>
  );
}

interface Props {
  initialData: ExcalidrawData | null;
  onSave: (data: ExcalidrawData) => void;
}

export default function ExcalidrawCanvas({ initialData, onSave }: Props) {
  const setUnsavedChanges = usePlannerStore((s) => s.setUnsavedChanges);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (elements: any, appState: any) => {
      setUnsavedChanges(true);
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        onSave({
          elements,
          appState: {
            viewBackgroundColor: appState.viewBackgroundColor ?? "#ffffff",
            currentItemFontFamily: appState.currentItemFontFamily ?? 1,
          },
          files: {},
        });
      }, 2000);
    },
    [onSave, setUnsavedChanges]
  );

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  const excalidrawInitialData: any = initialData
    ? {
        elements: initialData.elements,
        appState: {
          viewBackgroundColor:
            (initialData.appState as any).viewBackgroundColor ?? "#ffffff",
        },
      }
    : undefined;

  return (
    <div className="w-full h-full excalidraw-wrapper">
      <Excalidraw
        initialData={excalidrawInitialData}
        onChange={handleChange}
        UIOptions={{
          canvasActions: {
            saveToActiveFile: false,
            loadScene: false,
            export: false,
          },
        }}
      />
    </div>
  );
}
