import { demoState } from "./seed";
import type { AppState } from "./types";

export const STORAGE_KEY = "capability-brief-mvp-v1";

function isState(value: unknown): value is AppState {
  if (!value || typeof value !== "object") return false;
  const candidate = value as AppState;
  return (
    typeof candidate.role?.title === "string" &&
    Array.isArray(candidate.role.competencies) &&
    Array.isArray(candidate.projects) &&
    typeof candidate.overrides === "object" &&
    candidate.overrides !== null
  );
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return demoState();
    const parsed: unknown = JSON.parse(raw);
    if (!isState(parsed)) return demoState();
    return parsed;
  } catch {
    return demoState();
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
