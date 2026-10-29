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
        className="rounded-sm bg-emerald px-3 py-2 text-sm font-semibold text-heading"
      >
        Load demo
      </button>
      <button
        type="button"
        onClick={startBlank}
        className="rounded-sm bg-white px-4 py-2.5 text-sm font-semibold text-ink border border-line"
      >
        Start from the role template
      </button>
    </div>
  );
}
