"use client";

import { useMemo } from "react";
import { LevelPill } from "@/components/level-pill";
import { buildBrief, safeHttpUrl } from "@/lib/brief";
import { LEVEL_LABEL, LEVELS, type EvidenceLevel } from "@/lib/types";
import { useBriefState } from "@/lib/use-brief-state";

export function BriefView() {
  const { state, update, loadDemo } = useBriefState();
  const brief = useMemo(
    () => (state ? buildBrief(state.role, state.projects) : null),
    [state],
  );

  if (!state || !brief) return <p className="text-stone-600">Preparing the brief…</p>;

  const rows = brief.results.map((result) => {
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

  const shownGaps = rows.filter((row) => row.level === "gap");

  return (
    <article className="brief-sheet mx-auto max-w-3xl rounded-xl border border-stone-300 bg-sheet px-4 py-6 shadow-sm sm:px-8 sm:py-8">
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={loadDemo}
          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-stone-900 ring-1 ring-stone-300"
        >
          Reload demo
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-md bg-stone-900 px-3 py-2 text-sm font-semibold text-white"
        >
          Print this brief
        </button>
      </div>

      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
          Capability Brief
        </p>
        <h1 className="mt-2 font-serif text-4xl leading-tight text-stone-950">
          {state.role.title.trim() || "Untitled role"}
        </h1>
        <p className="mt-3 text-lg text-stone-800">
          {state.role.applicantLabel.trim() || "Applicant"}
        </p>
        <p className="mt-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-950">
          Evidence summary, not a decision. There is no overall score. Years of experience
          are not on this page. A person decides whether to continue.
        </p>
      </header>

      <section className="mt-8" aria-labelledby="scorecard-heading">
        <h2 id="scorecard-heading" className="font-serif text-2xl text-stone-950">
          Evidence by competency
        </h2>
        <div className="mt-4 divide-y divide-stone-200 border-y border-stone-200">
          {rows.map((row) => {
            const name = row.competency?.name.trim() || "Untitled competency";
            const rubricLine = row.competency?.rubric[row.level]?.trim();
            return (
              <section key={row.result.competencyId} className="py-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <h3 className="text-lg font-semibold leading-6 text-stone-950">
                    {name}
                    {row.competency?.important ? (
                      <span className="ml-2 align-middle text-xs font-semibold uppercase tracking-wide text-clay">
                        Most important
                      </span>
                    ) : null}
                  </h3>
                  <LevelPill level={row.level} />
                </div>
                {rubricLine ? (
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    This role describes {LEVEL_LABEL[row.level]} as: {rubricLine}
                  </p>
                ) : null}
                <p className="mt-3 text-sm leading-6 text-stone-800">
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
                          className="rounded-lg bg-stone-50 px-3 py-3 text-sm leading-6 break-words text-stone-900"
                        >
                          <blockquote>
                            “<Highlighted text={quote.text} phrase={quote.phrase} />”
                          </blockquote>
                          <p className="mt-2 text-stone-600">
                            {quote.source}
                            {href ? (
                              <>
                                {" "}
                                ·{" "}
                                <a
                                  href={href}
                                  className="font-semibold text-clay underline"
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
                  <p className="mt-3 text-sm text-stone-600">No quote. Nothing matched.</p>
                )}
                {row.overrideReason ? (
                  <p className="mt-3 text-sm leading-6 text-stone-800">
                    Reviewer override: {LEVEL_LABEL[row.level]}. {row.overrideReason} The
                    tool had suggested {LEVEL_LABEL[row.result.level]}.
                  </p>
                ) : null}
                <OverrideControls
                  toolLevel={row.result.level}
                  competencyId={row.result.competencyId}
                  override={state.overrides[row.result.competencyId]}
                  update={update}
                />
              </section>
            );
          })}
        </div>
      </section>

      <section className="mt-8" aria-labelledby="gaps-heading">
        <h2 id="gaps-heading" className="font-serif text-2xl text-stone-950">
          Gaps
        </h2>
        {shownGaps.length === 0 ? (
          <p className="mt-2 leading-7 text-stone-700">
            No competency is at Gap. A gap would mean the linked work did not show it, not
            that the person cannot do it.
          </p>
        ) : (
          <ul className="mt-3 list-disc space-y-2 pl-5 text-stone-800">
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

      <section className="mt-8" aria-labelledby="sample-heading">
        <h2 id="sample-heading" className="font-serif text-2xl text-stone-950">
          Suggested 45-minute work sample
        </h2>
        {brief.workSample ? (
          <>
            <p className="mt-2 text-sm font-semibold text-stone-600">
              Aimed at: {brief.workSample.competencyName}
            </p>
            <p className="mt-2 leading-7 text-stone-800">{brief.workSample.task}</p>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Optional. Chosen from the weakest evidence, with a competency marked most
              important preferred inside the same level. This follows the evidence rules
              before any reviewer override. It is a short task, not a scored test.
            </p>
          </>
        ) : (
          <p className="mt-2 text-stone-700">Add a competency to suggest a work sample.</p>
        )}
      </section>

      <section className="mt-8" aria-labelledby="probes-heading">
        <h2 id="probes-heading" className="font-serif text-2xl text-stone-950">
          Suggested interview probes
        </h2>
        {brief.probes.length === 0 ? (
          <p className="mt-2 leading-7 text-stone-700">
            No Gap or Some ratings, so there is no probe list. A conversation can still ask
            what the quotes leave out.
          </p>
        ) : (
          <ul className="mt-3 list-disc space-y-2 pl-5 text-stone-800">
            {brief.probes.map((probe) => (
              <li key={probe.competencyName}>
                <span className="font-semibold">{probe.competencyName}.</span> {probe.prompt}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8 border-t border-stone-200 pt-5 text-sm leading-6 text-stone-600">
        <h2 className="font-serif text-xl text-stone-900">How these levels were chosen</h2>
        <p className="mt-2">
          This prototype does not use a model, does not call the GitHub API, and does not
          produce an overall score. For each competency it looks for phrases the employer
          listed under Some, Clear, and Strong. The highest level with a phrase that actually
          appears is the level shown, and that phrase is highlighted. If none appear, the
          level is Gap. Demo links point at example.com and are not live repositories.
        </p>
        <p className="mt-2">
          Aidan Lottering owns the concept and the decisions. AI assistants helped with
          implementation. This page is not an applicant tracking system and it is not a
          hiring decision.
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
}: {
  toolLevel: EvidenceLevel;
  competencyId: string;
  override: { level: EvidenceLevel; reason: string } | undefined;
  update: ReturnType<typeof useBriefState>["update"];
}) {
  const selected = override?.level ?? toolLevel;
  const reason = override?.reason ?? "";
  const pending = selected !== toolLevel && reason.trim().length === 0;

  return (
    <div className="no-print mt-4 grid gap-3 rounded-lg border border-dashed border-stone-300 p-3 sm:grid-cols-[12rem_1fr]">
      <label className="block text-sm">
        <span className="font-medium text-stone-800">Reviewer override</span>
        <select
          className="mt-1.5 w-full rounded-md border border-stone-300 bg-white px-2 py-2 text-base"
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
        <span className="font-medium text-stone-800">Reason</span>
        <input
          className="mt-1.5 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-base"
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
          <span className="mt-1 block text-stone-500">Write a reason to apply this override.</span>
        ) : null}
      </label>
    </div>
  );
}
