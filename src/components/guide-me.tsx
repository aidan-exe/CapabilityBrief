"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "capability-brief-guide-v1";

const TIPS: Record<string, string> = {
  "/": "Capability Brief swaps a years-of-experience filter for project evidence. It runs in three steps: set the role, add projects, then read the brief.",
  "/role": "Step 1, the employer: set the competencies and what each level looks like.",
  "/projects":
    "Step 2, the graduate: answer the questions and paste evidence. Try adding a sentence about a unit test.",
  "/brief": "Step 3, the reviewer: read the evidence and decide.",
  "/about": "This page covers the problem, how the brief works, and its limits.",
};

type GuideState = {
  on: boolean;
  dismissed: string[];
};

function emptyGuide(): GuideState {
  return { on: false, dismissed: [] };
}

function loadGuide(): GuideState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyGuide();
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return emptyGuide();
    const record = parsed as { on?: unknown; dismissed?: unknown };
    const dismissed = Array.isArray(record.dismissed)
      ? record.dismissed.filter((item): item is string => typeof item === "string")
      : [];
    return { on: record.on === true, dismissed };
  } catch {
    return emptyGuide();
  }
}

export function useGuide() {
  const [guide, setGuide] = useState<GuideState | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = loadGuide();
    setGuide((current) => current ?? stored);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || guide === null) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(guide));
    } catch {
      // Keep the in-memory choice if the browser refuses to store it.
    }
  }, [ready, guide]);

  const toggle = useCallback(() => {
    setGuide((current) => {
      const base = current ?? emptyGuide();
      return base.on ? { on: false, dismissed: base.dismissed } : { on: true, dismissed: [] };
    });
  }, []);

  const dismiss = useCallback((pathname: string) => {
    setGuide((current) => {
      const base = current ?? emptyGuide();
      if (base.dismissed.includes(pathname)) return base;
      return { ...base, dismissed: [...base.dismissed, pathname] };
    });
  }, []);

  return { guide, toggle, dismiss };
}

export function GuideToggle({ pressed, onToggle }: { pressed: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onToggle}
      className={`no-print rounded-[10px] border px-3 py-1.5 text-sm font-semibold ${
        pressed ? "border-emerald bg-emerald text-heading" : "border-white bg-transparent text-white"
      }`}
    >
      Guide me
    </button>
  );
}

export function GuideTip({
  pathname,
  guide,
  onDismiss,
}: {
  pathname: string;
  guide: GuideState | null;
  onDismiss: (pathname: string) => void;
}) {
  const tip = TIPS[pathname];
  if (!guide?.on || !tip || guide.dismissed.includes(pathname)) return null;

  return (
    <aside
      aria-label="Guide tip"
      className="no-print mb-5 flex items-start justify-between gap-4 rounded-[14px] border border-heading bg-sheet px-4 py-3 text-sm leading-6 text-heading"
    >
      <p>{tip}</p>
      <button
        type="button"
        aria-label="Dismiss this tip"
        onClick={() => {
          onDismiss(pathname);
          document.getElementById("content")?.focus();
        }}
        className="shrink-0 rounded-[10px] border border-[#6d6d6d] bg-white px-2.5 py-1 text-sm font-semibold text-ink"
      >
        Dismiss
      </button>
    </aside>
  );
}
