"use client";

import type { ReactNode } from "react";
import { BriefView } from "@/components/brief-view";

export function SplitWorkspace({ children }: { children: ReactNode }) {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.92fr)]">
      <div className="min-w-0">{children}</div>
      <div className="min-w-0 lg:sticky lg:top-4 lg:max-h-[calc(100vh-1.5rem)] lg:overflow-y-auto">
        <BriefView />
      </div>
    </div>
  );
}
