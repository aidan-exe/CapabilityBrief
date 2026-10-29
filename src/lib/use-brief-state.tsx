"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { blankState, demoState } from "./seed";
import { loadState, saveState } from "./storage";
import type { AppState } from "./types";

function useBriefStateValue() {
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    setState(loadState());
  }, []);

  const replace = useCallback((next: AppState) => {
    saveState(next);
    setState(next);
  }, []);

  const update = useCallback((patch: (current: AppState) => AppState) => {
    setState((current) => {
      if (!current) return current;
      const next = patch(current);
      saveState(next);
      return next;
    });
  }, []);

  const loadDemo = useCallback(() => replace(demoState()), [replace]);
  const startBlank = useCallback(() => replace(blankState()), [replace]);

  return { state, update, loadDemo, startBlank };
}

type BriefState = ReturnType<typeof useBriefStateValue>;

const BriefStateContext = createContext<BriefState | null>(null);

export function BriefStateProvider({ children }: { children: ReactNode }) {
  const value = useBriefStateValue();
  return <BriefStateContext.Provider value={value}>{children}</BriefStateContext.Provider>;
}

export function useBriefState() {
  const value = useContext(BriefStateContext);
  if (!value) {
    throw new Error("useBriefState must be used within BriefStateProvider");
  }
  return value;
}
