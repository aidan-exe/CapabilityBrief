"use client";

import { useCallback, useEffect, useState } from "react";
import { blankState, demoState } from "./seed";
import { loadState, saveState } from "./storage";
import type { AppState } from "./types";

export function useBriefState() {
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
