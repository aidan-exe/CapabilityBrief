"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
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
      id="guide-me-toggle"
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

function focusVisible(element: HTMLElement | null | undefined) {
  element?.focus({ preventScroll: true, focusVisible: true } as FocusOptions);
}

const MARGIN = 12;
const GAP = 12;
const TARGET_WAIT_MS = 1500;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function clampOrigin(top: number, left: number, width: number, height: number) {
  const maxLeft = Math.max(MARGIN, window.innerWidth - MARGIN - width);
  const maxTop = Math.max(MARGIN, window.innerHeight - MARGIN - height);
  return { top: clamp(top, MARGIN, maxTop), left: clamp(left, MARGIN, maxLeft) };
}

function placeDesktop(target: Box, bubbleWidth: number, bubbleHeight: number) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const maxLeft = Math.max(MARGIN, viewportWidth - MARGIN - bubbleWidth);
  const maxTop = Math.max(MARGIN, viewportHeight - MARGIN - bubbleHeight);
  const alignedLeft = clamp(target.left, MARGIN, maxLeft);
  const below = target.top + target.height + GAP;
  if (below + bubbleHeight <= viewportHeight - MARGIN) {
    return { top: below, left: alignedLeft };
  }
  const above = target.top - GAP - bubbleHeight;
  if (above >= MARGIN) {
    return { top: above, left: alignedLeft };
  }
  const right = target.left + target.width + GAP;
  if (right + bubbleWidth <= viewportWidth - MARGIN) {
    return { top: clamp(target.top, MARGIN, maxTop), left: clamp(right, MARGIN, maxLeft) };
  }
  const left = target.left - GAP - bubbleWidth;
  if (left >= MARGIN) {
    return { top: clamp(target.top, MARGIN, maxTop), left: clamp(left, MARGIN, maxLeft) };
  }
  return clampOrigin(below, alignedLeft, bubbleWidth, bubbleHeight);
}

function targetBox(target: HTMLElement): Box {
  const rect = target.getBoundingClientRect();
  const pad = 6;
  const left = Math.max(8, rect.left - pad);
  const right = Math.min(window.innerWidth - 8, rect.right + pad);
  const top = Math.max(8, rect.top - pad);
  const bottom = Math.min(window.innerHeight - 8, rect.bottom + pad);
  return {
    top,
    left,
    width: Math.max(24, right - left),
    height: Math.max(24, bottom - top),
  };
}

function boxesEqual(a: Box | null, b: Box) {
  if (!a) return false;
  return (
    Math.round(a.top) === Math.round(b.top) &&
    Math.round(a.left) === Math.round(b.left) &&
    Math.round(a.width) === Math.round(b.width) &&
    Math.round(a.height) === Math.round(b.height)
  );
}

function pointsEqual(a: { top: number; left: number } | null, b: { top: number; left: number }) {
  return !!a && Math.round(a.top) === Math.round(b.top) && Math.round(a.left) === Math.round(b.left);
}

function isVisibleTarget(target: HTMLElement) {
  const rect = target.getBoundingClientRect();
  if (rect.width < 2 || rect.height < 2) return false;
  const style = window.getComputedStyle(target);
  return style.display !== "none" && style.visibility !== "hidden";
}

type Spot = { key: string; box: Box | null; centred: boolean };

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
  const pendingRoute = useRef<string | null>(null);
  const focusedKey = useRef<string | null>(null);
  const seenActive = useRef(false);
  const dockChoice = useRef<{ key: string; dock: "top" | "bottom" } | null>(null);
  const selfScroll = useRef(false);
  const [spot, setSpot] = useState<Spot | null>(null);
  const [narrow, setNarrow] = useState(false);
  const [dock, setDock] = useState<"top" | "bottom">("bottom");
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  const active = guide?.on === true;
  const stepIndex = guide?.step ?? 0;
  const step = STEPS[stepIndex];
  const generation = active && step ? `${pathname}:${step.id}` : "off";
  const [generationSeen, setGenerationSeen] = useState(generation);
  if (generation !== generationSeen) {
    setGenerationSeen(generation);
    setSpot(null);
    setPos(null);
    focusedKey.current = null;
    dockChoice.current = null;
  }

  const live = spot && spot.key === generation ? spot : null;

  useEffect(() => {
    if (!active) return;
    const onPop = () => {
      pendingRoute.current = null;
      stop();
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [active, stop]);

  useEffect(() => {
    if (!active || !step) {
      seenActive.current = false;
      return;
    }
    const opened = !seenActive.current;
    seenActive.current = true;
    if (pathname === step.route) {
      if (pendingRoute.current === pathname) pendingRoute.current = null;
      return;
    }
    if (pendingRoute.current === step.route) return;
    if (opened) {
      const here = STEPS.findIndex((item) => item.route === pathname);
      if (here > 0) {
        go(here);
        return;
      }
    }
    stop();
  }, [active, go, pathname, step, stop]);

  useEffect(() => {
    if (!active || !step || pathname !== step.route) return;
    const key = `${pathname}:${step.id}`;
    let cancelled = false;
    let resolved = false;
    let timer = 0;
    const started = performance.now();

    const publish = (next: Spot) => {
      setNarrow(window.innerWidth < 640 && next.box !== null);
      setSpot((current) => {
        if (!current || current.key !== next.key || current.centred !== next.centred) return next;
        if (!next.box || !current.box) return next.box === current.box ? current : next;
        return boxesEqual(current.box, next.box) ? current : next;
      });
    };

    const track = () => {
      if (cancelled || selfScroll.current || !resolved) return;
      const target = document.querySelector<HTMLElement>(`[data-tour="${step.id}"]`);
      if (!target || !isVisibleTarget(target)) return;
      const next = targetBox(target);
      setSpot((current) => {
        if (!current || current.key !== key || (current.box && boxesEqual(current.box, next))) return current;
        return { key, box: next, centred: false };
      });
    };

    const resolveFound = (target: HTMLElement) => {
      if (cancelled || resolved) return;
      resolved = true;
      observer.disconnect();
      window.clearTimeout(timer);
      const narrowNow = window.innerWidth < 640;
      if (!narrowNow) {
        target.scrollIntoView({
          block: "center",
          inline: "nearest",
          behavior: prefersReducedMotion() ? "auto" : "smooth",
        });
      }
      const apply = () => {
        if (!cancelled) publish({ key, box: targetBox(target), centred: false });
      };
      if (!narrowNow && !prefersReducedMotion()) timer = window.setTimeout(apply, 280);
      else apply();
    };

    const resolveMissing = () => {
      if (cancelled || resolved) return;
      resolved = true;
      observer.disconnect();
      window.clearTimeout(timer);
      publish({ key, box: null, centred: true });
    };

    const look = () => {
      if (cancelled || resolved) return;
      const target = document.querySelector<HTMLElement>(`[data-tour="${step.id}"]`);
      if (target && isVisibleTarget(target)) {
        resolveFound(target);
        return;
      }
      if (performance.now() - started >= TARGET_WAIT_MS) {
        resolveMissing();
        return;
      }
      timer = window.setTimeout(look, 50);
    };

    const observer = new MutationObserver(look);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    look();
    window.addEventListener("resize", track);
    window.addEventListener("scroll", track, true);
    return () => {
      cancelled = true;
      observer.disconnect();
      window.clearTimeout(timer);
      window.removeEventListener("resize", track);
      window.removeEventListener("scroll", track, true);
    };
  }, [active, pathname, step]);

  const endTour = useCallback(() => {
    stop();
    requestAnimationFrame(() => {
      focusVisible(document.getElementById("guide-me-toggle"));
    });
  }, [stop]);

  const move = useCallback(
    (nextStep: number) => {
      const destination = STEPS[nextStep];
      if (!destination) return;
      if (destination.route !== pathname) {
        pendingRoute.current = destination.route;
        router.push(destination.route);
      }
      go(nextStep);
    },
    [go, pathname, router],
  );

  useLayoutEffect(() => {
    if (!active || !live || !step || pathname !== step.route) return;
    const focusTarget = document.getElementById("guide-next") ?? document.getElementById("guide-title");
    if (!focusTarget) return;
    if (focusedKey.current === live.key) return;
    focusVisible(focusTarget);
    focusedKey.current = live.key;
  }, [active, live, pathname, step]);

  useEffect(() => {
    if (!active) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        endTour();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        if (stepIndex >= STEPS.length - 1) endTour();
        else move(stepIndex + 1);
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        if (stepIndex > 0) move(stepIndex - 1);
        return;
      }
      if (event.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const items = [...dialog.querySelectorAll<HTMLElement>("button, a[href]")].filter(
        (item) => !item.hasAttribute("disabled"),
      );
      if (items.length === 0) return;
      const first = items[0];
      const lastItem = items[items.length - 1];
      const current = document.activeElement;
      const inside = current instanceof HTMLElement && items.includes(current);
      if (!inside) {
        event.preventDefault();
        (event.shiftKey ? lastItem : first).focus({ preventScroll: true });
        return;
      }
      if (event.shiftKey && current === first) {
        event.preventDefault();
        lastItem.focus({ preventScroll: true });
      } else if (!event.shiftKey && current === lastItem) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [active, endTour, move, stepIndex]);

  useLayoutEffect(() => {
    const bubble = dialogRef.current;
    if (!active || !bubble || !live || !step) return;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const sheet = viewportWidth < 640 && !live.centred;
    if (sheet !== narrow) setNarrow(sheet);
    if (!sheet) {
      const width = bubble.offsetWidth;
      const height = bubble.offsetHeight;
      if (width < 10 || height < 10) return;
      let anchor = live.box;
      if (anchor) {
        const target = document.querySelector<HTMLElement>(`[data-tour="${step.id}"]`);
        if (target && isVisibleTarget(target)) {
          const rect = target.getBoundingClientRect();
          const pair = rect.height + GAP + height;
          if (pair + MARGIN * 2 <= viewportHeight) {
            const desiredTop = Math.max(MARGIN, (viewportHeight - pair) / 2);
            const delta = rect.top - desiredTop;
            if (Math.abs(delta) > 2) {
              const before = window.scrollY;
              selfScroll.current = true;
              window.scrollBy(0, delta);
              selfScroll.current = false;
              if (Math.abs(window.scrollY - before) >= 1) {
                const nextBox = targetBox(target);
                anchor = nextBox;
                setSpot((current) => {
                  if (!current || current.key !== live.key || (current.box && boxesEqual(current.box, nextBox))) return current;
                  return { key: live.key, box: nextBox, centred: false };
                });
              }
            }
          }
          anchor = targetBox(target);
        }
      }
      const next = anchor
        ? placeDesktop(anchor, width, height)
        : clampOrigin((viewportHeight - height) / 2, (viewportWidth - width) / 2, width, height);
      setPos((current) => (pointsEqual(current, next) ? current : next));
      return;
    }

    const target = document.querySelector<HTMLElement>(`[data-tour="${step.id}"]`);
    if (!target || !isVisibleTarget(target)) return;
    const panelHeight = bubble.offsetHeight;
    const key = live.key;
    let choice = dockChoice.current?.key === key ? dockChoice.current.dock : null;
    if (!choice) {
      const rect = target.getBoundingClientRect();
      const bottomLimit = viewportHeight - panelHeight - MARGIN;
      const overflow = rect.bottom - bottomLimit;
      const scrollRoom = document.documentElement.scrollHeight - window.scrollY - viewportHeight;
      const inLower = rect.top > viewportHeight * 0.45 && rect.top < viewportHeight;
      const cannotClear = overflow > 1 && scrollRoom < overflow - 1;
      choice = inLower || cannotClear ? "top" : "bottom";
      dockChoice.current = { key, dock: choice };
    }
    if (dock !== choice) setDock(choice);

    const rect = target.getBoundingClientRect();
    let delta = 0;
    if (choice === "top") delta = rect.top - (panelHeight + MARGIN);
    else delta = rect.bottom - (viewportHeight - panelHeight - MARGIN);
    if (Math.abs(delta) > 1 && !(choice === "bottom" && delta < 0)) {
      selfScroll.current = true;
      window.scrollBy(0, delta);
      selfScroll.current = false;
    }
    const after = target.getBoundingClientRect();
    if (choice === "bottom" && after.bottom > viewportHeight - panelHeight - MARGIN + 1) {
      dockChoice.current = { key, dock: "top" };
      setDock("top");
    }
    const nextBox = targetBox(target);
    setSpot((current) => {
      if (!current || current.key !== key || (current.box && boxesEqual(current.box, nextBox))) return current;
      return { key, box: nextBox, centred: false };
    });
  }, [active, dock, live, narrow, step]);

  if (!active || !step || !live) return null;

  const last = stepIndex === STEPS.length - 1;

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && event.target === dialogRef.current) {
      event.preventDefault();
      if (last) endTour();
      else move(stepIndex + 1);
    }
  };

  const floating = !narrow;
  const box = live.box;

  return (
    <div className="no-print">
      {box ? (
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
      ) : null}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-title"
        aria-describedby="guide-body"
        tabIndex={-1}
        onKeyDown={onKeyDown}
        className={`no-print fixed z-50 box-border outline-none ${
          floating
            ? "w-80 max-h-[calc(100vh-24px)] max-w-[calc(100vw-24px)] overflow-auto"
            : dock === "top"
              ? "inset-x-0 top-0 w-full p-3"
              : "inset-x-0 bottom-0 w-full p-3"
        }`}
        style={floating && pos ? { top: pos.top, left: pos.left } : undefined}
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
                onClick={() => move(stepIndex - 1)}
                className="rounded-[10px] border border-[#6d6d6d] bg-white px-3 py-1.5 text-sm font-semibold text-ink"
              >
                Back
              </button>
            ) : null}
            <button
              id="guide-next"
              type="button"
              onClick={() => (last ? endTour() : move(stepIndex + 1))}
              className="rounded-[10px] bg-emerald px-3 py-1.5 text-sm font-semibold text-heading"
            >
              {last ? "Finish" : "Next"}
            </button>
            <button
              type="button"
              onClick={endTour}
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
