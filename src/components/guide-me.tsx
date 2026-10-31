"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { usePathname, useRouter } from "next/navigation";

const STORAGE_KEY = "capability-brief-guide-v1";

type GuideState = {
  on: boolean;
  step: number;
};

type TourStep = {
  id: string;
  route: string;
  title: string;
  body: string;
};

const STEPS: TourStep[] = [
  {
    id: "overview",
    route: "/",
    title: "Overview",
    body: "Capability Brief swaps a years-of-experience filter for project evidence. The walkthrough visits the role, the projects, and the brief.",
  },
  {
    id: "load-demo",
    route: "/",
    title: "Load the demo",
    body: "Load the sample junior web developer role and two projects. Edits stay in this browser.",
  },
  {
    id: "role-identity",
    route: "/role",
    title: "Role",
    body: "Name the role and use an applicant code, not a person's name.",
  },
  {
    id: "rubric",
    route: "/role",
    title: "Rubric",
    body: "For one competency, write what Gap, Some, Clear, and Strong evidence looks like.",
  },
  {
    id: "phrases",
    route: "/role",
    title: "Phrases that count",
    body: "List phrases. A level is suggested only when one of those phrases appears in a project or reflection.",
  },
  {
    id: "reflections",
    route: "/projects",
    title: "Reflections",
    body: "Answer what you did, what was hardest, and what you would change. Try a sentence about a unit test.",
  },
  {
    id: "notes",
    route: "/projects",
    title: "Evidence notes",
    body: "Paste a short excerpt from a file, a README, or a commit message so the brief can quote it.",
  },
  {
    id: "evidence",
    route: "/brief",
    title: "Evidence",
    body: "Each competency has a level and a quoted phrase. Gap means it was not shown.",
  },
  {
    id: "override",
    route: "/brief",
    title: "Reviewer override",
    body: "You can change a level. The brief shows your change only after you write a reason.",
  },
  {
    id: "work-sample",
    route: "/brief",
    title: "Work sample and print",
    body: "The brief can suggest one 45-minute task. Print this brief when you want a paper copy.",
  },
  {
    id: "tour-end",
    route: "/about",
    title: "Finish",
    body: "That is the walkthrough. Finish turns Guide me off.",
  },
];

type Box = { top: number; left: number; width: number; height: number };

function emptyGuide(): GuideState {
  return { on: false, step: 0 };
}

function loadGuide(): GuideState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyGuide();
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return emptyGuide();
    const record = parsed as { on?: unknown; step?: unknown };
    const step =
      typeof record.step === "number" && Number.isFinite(record.step)
        ? Math.max(0, Math.min(STEPS.length - 1, Math.floor(record.step)))
        : 0;
    return { on: record.on === true, step };
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
      return base.on ? { on: false, step: 0 } : { on: true, step: 0 };
    });
  }, []);

  const stop = useCallback(() => {
    setGuide((current) => ({ on: false, step: 0, ...(current ? { step: 0 } : {}) }));
  }, []);

  const go = useCallback((nextStep: number) => {
    setGuide((current) => {
      if (!current?.on) return current;
      const step = Math.max(0, Math.min(STEPS.length - 1, nextStep));
      return { ...current, step };
    });
  }, []);

  return { guide, toggle, stop, go };
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

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function GuideTour({
  guide,
  stop,
  go,
}: {
  guide: GuideState | null;
  stop: () => void;
  go: (step: number) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);
  const focusedStep = useRef<number | null>(null);
  const [box, setBox] = useState<Box | null>(null);
  const [narrow, setNarrow] = useState(false);

  const active = guide?.on === true;
  const stepIndex = guide?.step ?? 0;
  const step = STEPS[stepIndex];

  useEffect(() => {
    if (!active || !step) return;
    if (pathname === step.route) return;
    router.push(step.route);
  }, [active, pathname, router, step]);

  useEffect(() => {
    if (!active || !step || pathname !== step.route) {
      setBox(null);
      return;
    }
    let cancelled = false;
    let frames = 0;
    let timer = 0;

    const measure = () => {
      const target = document.querySelector<HTMLElement>(`[data-tour="${step.id}"]`);
      if (!target) return false;
      const rect = target.getBoundingClientRect();
      const pad = 6;
      const left = Math.max(8, rect.left - pad);
      const right = Math.min(window.innerWidth - 8, rect.right + pad);
      const top = Math.max(8, rect.top - pad);
      const bottom = Math.min(window.innerHeight - 8, rect.bottom + pad);
      setBox({
        top,
        left,
        width: Math.max(24, right - left),
        height: Math.max(24, bottom - top),
      });
      setNarrow(window.innerWidth < 640);
      return true;
    };

    const look = () => {
      if (cancelled) return;
      const found = measure();
      if (found) {
        const target = document.querySelector<HTMLElement>(`[data-tour="${step.id}"]`);
        target?.scrollIntoView({
          block: "center",
          inline: "nearest",
          behavior: prefersReducedMotion() ? "auto" : "smooth",
        });
        timer = window.setTimeout(() => {
          if (!cancelled) measure();
        }, prefersReducedMotion() ? 0 : 280);
        return;
      }
      frames += 1;
      if (frames > 60) {
        if (stepIndex >= STEPS.length - 1) stop();
        else go(stepIndex + 1);
        return;
      }
      timer = window.setTimeout(look, 100);
    };

    look();
    const onMove = () => measure();
    window.addEventListener("resize", onMove);
    window.addEventListener("scroll", onMove, true);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener("resize", onMove);
      window.removeEventListener("scroll", onMove, true);
    };
  }, [active, go, pathname, step, stepIndex, stop]);

  useEffect(() => {
    if (!active) {
      focusedStep.current = null;
      return;
    }
    if (!box) return;
    if (focusedStep.current !== stepIndex) {
      focusedStep.current = stepIndex;
      dialogRef.current?.focus({ preventScroll: true });
    }
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        stop();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        if (stepIndex >= STEPS.length - 1) stop();
        else go(stepIndex + 1);
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        if (stepIndex > 0) go(stepIndex - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, box, go, stepIndex, stop]);

  if (!active || !step || !box) return null;

  const last = stepIndex === STEPS.length - 1;
  const bubbleTop = Math.min(window.innerHeight - 16, box.top + box.height + 12);
  const bubbleLeft = Math.max(12, Math.min(box.left, window.innerWidth - 332));

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && event.target === dialogRef.current) {
      event.preventDefault();
      if (last) stop();
      else go(stepIndex + 1);
      return;
    }
    if (event.key !== "Tab" || !dialogRef.current) return;
    const items = [...dialogRef.current.querySelectorAll<HTMLElement>("button, a[href]")].filter(
      (item) => !item.hasAttribute("disabled"),
    );
    if (items.length === 0) return;
    const first = items[0];
    const end = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      end.focus({ preventScroll: true });
    } else if (!event.shiftKey && document.activeElement === end) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    }
  };

  return (
    <div className="no-print">
      <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
        <div className="pointer-events-auto absolute inset-0" aria-hidden="true" />
        <div
          className="pointer-events-none absolute rounded-[12px] border-2 border-emerald"
          style={{
            top: box.top,
            left: box.left,
            width: box.width,
            height: box.height,
            boxShadow: "0 0 0 9999px rgba(15, 36, 31, 0.55)",
          }}
        />
      </div>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-title"
        aria-describedby="guide-body"
        tabIndex={-1}
        onKeyDown={onKeyDown}
        className={`no-print fixed z-50 box-border outline-none ${
          narrow ? "inset-x-0 bottom-0 w-full max-w-full p-3" : "w-80"
        }`}
        style={narrow ? undefined : { top: bubbleTop, left: bubbleLeft }}
      >
        <div className="rounded-[14px] border border-heading bg-sheet p-4 text-heading shadow-[0_12px_32px_rgba(15,36,31,0.18)]">
          <p id="guide-title" className="font-display text-base font-semibold">
            Step {stepIndex + 1} of {STEPS.length}. {step.title}
          </p>
          <p id="guide-body" className="mt-2 text-sm leading-6 text-ink">
            {step.body}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {stepIndex > 0 ? (
              <button
                type="button"
                onClick={() => go(stepIndex - 1)}
                className="rounded-[10px] border border-[#6d6d6d] bg-white px-3 py-1.5 text-sm font-semibold text-ink"
              >
                Back
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => (last ? stop() : go(stepIndex + 1))}
              className="rounded-[10px] bg-emerald px-3 py-1.5 text-sm font-semibold text-heading"
            >
              {last ? "Finish" : "Next"}
            </button>
            <button
              type="button"
              onClick={stop}
              className="rounded-[10px] border border-[#6d6d6d] bg-white px-3 py-1.5 text-sm font-semibold text-ink"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
