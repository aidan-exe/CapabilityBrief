"use client";

import { useBriefState } from "@/lib/use-brief-state";

export function DemoActions() {
  const { state, loadDemo, startBlank } = useBriefState();
  if (!state) return null;

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={loadDemo}
        className="rounded-md bg-clay px-4 py-2.5 text-sm font-semibold text-white"
      >
        Load demo
      </button>
      <button
        type="button"
        onClick={startBlank}
        className="rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-stone-900 ring-1 ring-stone-300"
      >
        Start from the role template
      </button>
    </div>
  );
}
