"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Printer, RotateCcw } from "lucide-react";
import { LevelPill } from "@/components/level-pill";
import { buildBrief, safeHttpUrl } from "@/lib/brief";
import { LEVEL_LABEL, LEVELS, type EvidenceLevel } from "@/lib/types";
import { useBriefState } from "@/lib/use-brief-state";

export function BriefView({ embedded = false }: { embedded?: boolean }) {
  const { state, update, loadDemo } = useBriefState();
  const brief = useMemo(
    () => (state ? buildBrief(state.role, state.projects) : null),
    [state],
  );

  const rows = useMemo(() => {
    if (!state || !brief) return [];
    return brief.results.map((result) => {
      const competency = state.role.competencies.find((item) => item.id === result.competencyId);
      const override = state.overrides[result.competencyId];
      const applied =
        override && override.reason.trim().length > 0 && override.level !== result.level
          ? override
          : null;
      return {
        result,
        competency,
        level: applied ? applied.level : result.level,
        overrideReason: applied?.reason.trim() ?? null,
      };
    });
  }, [state, brief]);

  const signature = rows
    .map((row) => `${row.result.competencyId}:${row.level}:${row.result.quotes.length}`)
    .join("|");
  const seen = useRef<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!signature || seen.current === null || seen.current === "") {
      seen.current = signature;
      return;
    }
    if (seen.current === signature) return;
    seen.current = signature;
    setUpdating(true);
    const timer = window.setTimeout(() => setUpdating(false), 280);
    return () => window.clearTimeout(timer);
  }, [signature]);

  if (!state || !brief) return <p className="text-muted">Preparing the brief…</p>;

  const shownGaps = rows.filter((row) => row.level === "gap");

  return (
    <article
      className="brief-sheet brief-live surface mx-auto w-full px-4 py-6 sm:px-6 sm:py-7"
      data-updating={updating ? "true" : "false"}
    >
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={loadDemo}
          className="inline-flex items-center gap-1.5 rounded-[10px] border border-[#6d6d6d] bg-white px-3 py-2 text-sm font-semibold text-ink"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Reload demo
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded-[10px] bg-heading px-3 py-2 text-sm font-semibold text-white"
        >
          <Printer className="size-3.5" aria-hidden="true" />
          Print this brief
        </button>
      </div>

      <header>
        <p className="text-xs font-semibold tracking-normal text-muted">
          Capability Brief
        </p>
        {embedded ? (
          <h2 className="mt-2 font-display text-3xl leading-tight text-heading">
            {state.role.title.trim() || "Untitled role"}
          </h2>
        ) : (
          <h1 className="mt-2 font-display text-3xl leading-tight text-heading">
            {state.role.title.trim() || "Untitled role"}
          </h1>
        )}
        <p className="mt-3 text-lg text-ink">
          {state.role.applicantLabel.trim() || "Applicant"}
        </p>
        <p className="notice mt-4 text-sm leading-6">
          Evidence summary, not a decision. There is no overall score. Years of experience
          are not on this page. A person decides whether to continue.
        </p>
      </header>

      <section className="mt-8" aria-labelledby="scorecard-heading">
        <h2 id="scorecard-heading" className="font-display text-2xl text-heading">
          Evidence by competency
        </h2>
        <div className="mt-4 grid gap-3">
          {rows.map((row) => {
            const name = row.competency?.name.trim() || "Untitled competency";
            const rubricLine = row.competency?.rubric[row.level]?.trim();
            return (
              <section
                key={row.result.competencyId}
                data-tour={row.result.competencyId === rows[0]?.result.competencyId ? "evidence" : undefined}
                className="rounded-[12px] border border-line bg-white p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <h3 className="text-lg font-semibold leading-6 text-heading">
                    {name}
                    {row.competency?.important ? (
                      <span className="ml-2 align-middle text-xs font-semibold text-muted">
                        Most important
                      </span>
                    ) : null}
                  </h3>
                  <LevelPill level={row.level} />
                </div>
                {rubricLine ? (
                  <p className="mt-2 text-sm leading-6 text-muted">
                    This role describes {LEVEL_LABEL[row.level]} as: {rubricLine}
                  </p>
                ) : null}
                <p className="mt-3 text-sm leading-6 text-ink">
                  {row.overrideReason
                    ? `Tool suggestion was ${LEVEL_LABEL[row.result.level]}. ${row.result.reason}`
                    : row.result.reason}
                </p>
                {row.result.quotes.length > 0 ? (
                  <ul className="mt-3 grid gap-3">
                    {row.result.quotes.map((quote) => {
                      const href = safeHttpUrl(quote.url);
                      return (
                        <li
                          key={`${quote.source}-${quote.phrase}`}
                          className="rounded-[12px] border border-line bg-canvas px-3 py-3 text-sm leading-6 break-words text-ink"
                        >
                          <blockquote>
                            “<Highlighted text={quote.text} phrase={quote.phrase} />”
                          </blockquote>
                          <p className="mt-2 text-muted">
                            {quote.source}
                            {href ? (
                              <>
                                {" "}
                                ·{" "}
                                <a
                                  href={href}
                                  className="font-semibold text-heading underline"
                                  rel="noreferrer"
                                  target="_blank"
                                >
                                  Open link
                                </a>
                              </>
                            ) : null}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-muted">No quote. Nothing matched.</p>
                )}
                {row.overrideReason ? (
                  <p className="mt-3 text-sm leading-6 text-ink">
                    Reviewer override: {LEVEL_LABEL[row.level]}. {row.overrideReason} The
                    tool had suggested {LEVEL_LABEL[row.result.level]}.
                  </p>
                ) : null}
                <OverrideControls
                  toolLevel={row.result.level}
                  competencyId={row.result.competencyId}
                  override={state.overrides[row.result.competencyId]}
                  update={update}
                  tourAnchor={row.result.competencyId === rows[0]?.result.competencyId}
                />
              </section>
            );
          })}
        </div>
      </section>

      <section className="mt-8" aria-labelledby="gaps-heading">
        <h2 id="gaps-heading" className="font-display text-2xl text-heading">
          Gaps
        </h2>
        {shownGaps.length === 0 ? (
          <p className="mt-2 leading-7 text-ink">
            No competency is at Gap. A gap would mean the linked work did not show it, not
            that the person cannot do it.
          </p>
        ) : (
          <ul className="mt-3 list-disc space-y-2 pl-5 text-ink">
            {shownGaps.map((row) => (
              <li key={row.result.competencyId}>
                <span className="font-semibold">
                  {row.competency?.name.trim() || "Untitled competency"}
                </span>
                {" — "}
                no evidence found in the linked projects or reflections.
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8" aria-labelledby="sample-heading" data-tour="work-sample">
        <h2 id="sample-heading" className="font-display text-2xl text-heading">
          Suggested 45-minute work sample
        </h2>
        {brief.workSample ? (
          <>
            <p className="mt-2 text-sm font-semibold text-muted">
              Aimed at: {brief.workSample.competencyName}
            </p>
            <p className="mt-2 leading-7 text-ink">{brief.workSample.task}</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Optional. Chosen from the weakest evidence, with a competency marked most
              important preferred inside the same level. This follows the evidence rules
              before any reviewer override. It is a short task, not a scored test.
            </p>
          </>
        ) : (
          <p className="mt-2 text-ink">Add a competency to suggest a work sample.</p>
        )}
      </section>

      <section className="mt-8" aria-labelledby="probes-heading">
        <h2 id="probes-heading" className="font-display text-2xl text-heading">
          Suggested interview probes
        </h2>
        {brief.probes.length === 0 ? (
          <p className="mt-2 leading-7 text-ink">
            No Gap or Some ratings, so there is no probe list. A conversation can still ask
            what the quotes leave out.
          </p>
        ) : (
          <ul className="mt-3 list-disc space-y-2 pl-5 text-ink">
            {brief.probes.map((probe) => (
              <li key={probe.competencyName}>
                <span className="font-semibold">{probe.competencyName}.</span> {probe.prompt}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8 border-t border-line pt-5 text-sm leading-6 text-muted">
        <h2 className="font-display text-xl text-heading">How these levels were chosen</h2>
        <p className="mt-2">
          This prototype does not use a model, does not call the GitHub API, and does not
          produce an overall score. For each competency it looks for phrases the employer
          listed under Some, Clear, and Strong. The highest level with a phrase that actually
          appears is the level shown, and that phrase is highlighted. If none appear, the
          level is Gap. Demo links point at example.com and are not live repositories.
        </p>
      </section>
    </article>
  );
}

function Highlighted({ text, phrase }: { text: string; phrase: string }) {
  const index = text.toLowerCase().indexOf(phrase.toLowerCase());
  if (index < 0) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, index)}
      <mark>{text.slice(index, index + phrase.length)}</mark>
      {text.slice(index + phrase.length)}
    </span>
  );
}

function OverrideControls({
  toolLevel,
  competencyId,
  override,
  update,
  tourAnchor = false,
}: {
  toolLevel: EvidenceLevel;
  competencyId: string;
  override: { level: EvidenceLevel; reason: string } | undefined;
  update: ReturnType<typeof useBriefState>["update"];
  tourAnchor?: boolean;
}) {
  const selected = override?.level ?? toolLevel;
  const reason = override?.reason ?? "";
  const pending = selected !== toolLevel && reason.trim().length === 0;

  return (
    <div
      data-tour={tourAnchor ? "override" : undefined}
      className="no-print mt-4 grid gap-3 rounded-[12px] border border-dashed border-[#6d6d6d] p-3 sm:grid-cols-[12rem_1fr]"
    >
      <label className="block text-sm">
        <span className="font-medium text-ink">Reviewer override</span>
        <select
          className="mt-1.5 w-full rounded-sm border border-line bg-white px-2 py-2 text-base"
          value={selected}
          onChange={(event) => {
            const level = event.target.value as EvidenceLevel;
            update((current) => {
              const overrides = { ...current.overrides };
              if (level === toolLevel) {
                delete overrides[competencyId];
              } else {
                overrides[competencyId] = { level, reason };
              }
              return { ...current, overrides };
            });
          }}
        >
          {LEVELS.map((level) => (
            <option key={level} value={level}>
              {LEVEL_LABEL[level]}
              {level === toolLevel ? " (tool)" : ""}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="font-medium text-ink">Reason</span>
        <input
          className="mt-1.5 w-full rounded-sm border border-line bg-white px-3 py-2 text-base"
          value={reason}
          placeholder="Required before an override is shown on the brief"
          onChange={(event) => {
            const nextReason = event.target.value;
            update((current) => {
              const overrides = { ...current.overrides };
              if (selected === toolLevel && nextReason.trim().length === 0) {
                delete overrides[competencyId];
              } else {
                overrides[competencyId] = { level: selected, reason: nextReason };
              }
              return { ...current, overrides };
            });
          }}
        />
        {pending ? (
          <span className="mt-1 block text-muted">Write a reason to apply this override.</span>
        ) : null}
      </label>
    </div>
  );
}
