"use client";

import { DemoActions } from "@/components/demo-actions";
import { Field, TextArea, TextInput, inputClass } from "@/components/ui";
import { emptyCompetency } from "@/lib/seed";
import { LEVEL_LABEL, type AppState, type EvidenceLevel, type SignalBand } from "@/lib/types";
import { useBriefState } from "@/lib/use-brief-state";

const signalBands: SignalBand[] = ["some", "clear", "strong"];

function createId(): string {
  return crypto.randomUUID();
}

export function RoleEditor() {
  const { state, update } = useBriefState();
  if (!state) return <p className="text-muted">Loading the role…</p>;

  const count = state.role.competencies.length;

  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold tracking-normal text-heading">Step 1 · Employer</p>
      <h1 className="mt-2 font-display text-4xl text-heading">Define the role</h1>
      <p className="mt-3 leading-7 text-ink">
        Pick 4 to 6 competencies. For each one, write what Gap, Some, Clear, and Strong
        evidence looks like, and list the phrases that count. A level is suggested only when
        one of those phrases appears in a project or reflection. The tool does not guess, and
        it does not read a repository on its own.
      </p>
      <div className="mt-4">
        <DemoActions />
      </div>

      <div className="mt-8 grid gap-4">
        <Field label="Role title" hint="The job this rubric is for. Entry-level technical roles are the first fit.">
          <TextInput
            value={state.role.title}
            onChange={(title) => update((current) => ({ ...current, role: { ...current.role, title } }))}
          />
        </Field>
        <Field
          label="Applicant code"
          hint="Use a code, not a name. The brief does not ask for an institution, a photo, or years of experience."
        >
          <TextInput
            value={state.role.applicantLabel}
            onChange={(applicantLabel) =>
              update((current) => ({ ...current, role: { ...current.role, applicantLabel } }))
            }
          />
        </Field>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl text-heading">
          Competencies <span className="text-lg text-muted">{count} of 4–6</span>
        </h2>
        <button
          type="button"
          disabled={count >= 6}
          onClick={() =>
            update((current) => ({
              ...current,
              role: {
                ...current.role,
                competencies: [...current.role.competencies, emptyCompetency(createId())],
              },
            }))
          }
          className="rounded-sm bg-heading px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-line disabled:text-ink"
        >
          Add competency
        </button>
      </div>

      <div className="mt-4 grid gap-5">
        {state.role.competencies.map((competency, index) => (
          <CompetencyCard
            key={competency.id}
            index={index}
            state={state}
            competencyId={competency.id}
            canRemove={count > 4}
            update={update}
          />
        ))}
      </div>
    </div>
  );
}

function CompetencyCard({
  index,
  state,
  competencyId,
  canRemove,
  update,
}: {
  index: number;
  state: AppState;
  competencyId: string;
  canRemove: boolean;
  update: (patch: (current: AppState) => AppState) => void;
}) {
  const competency = state.role.competencies.find((item) => item.id === competencyId);
  if (!competency) return null;

  const patch = (next: Partial<typeof competency>) => {
    update((current) => ({
      ...current,
      role: {
        ...current.role,
        competencies: current.role.competencies.map((item) =>
          item.id === competencyId ? { ...item, ...next } : item,
        ),
      },
    }));
  };

  return (
    <fieldset className="rounded-sm border border-line bg-sheet p-4 sm:p-5">
      <legend className="px-1 text-sm font-semibold text-muted">Competency {index + 1}</legend>
      <div className="grid gap-4">
        <Field label="Name">
          <TextInput value={competency.name} onChange={(name) => patch({ name })} />
        </Field>
        <label className="flex items-start gap-2 text-sm text-ink">
          <input
            type="checkbox"
            className="mt-1"
            checked={competency.important}
            onChange={(event) => patch({ important: event.target.checked })}
          />
          <span>Most important for this role. Used when choosing the work-sample suggestion.</span>
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          {(["gap", "some", "clear", "strong"] as EvidenceLevel[]).map((level) => (
            <Field key={level} label={`${LEVEL_LABEL[level]} looks like`}>
              <TextArea
                rows={3}
                value={competency.rubric[level]}
                onChange={(value) => patch({ rubric: { ...competency.rubric, [level]: value } })}
              />
            </Field>
          ))}
        </div>
        <div className="grid gap-3">
          {signalBands.map((band) => (
            <Field
              key={band}
              label={`Phrases that count as ${LEVEL_LABEL[band]}`}
              hint="One phrase per line. The brief quotes the line only if the phrase appears in a project or reflection."
            >
              <textarea
                className={inputClass}
                rows={2}
                value={competency.signals[band]}
                onChange={(event) =>
                  patch({ signals: { ...competency.signals, [band]: event.target.value } })
                }
              />
            </Field>
          ))}
        </div>
        <Field
          label="Optional 45-minute work sample"
          hint="Used if this competency is the weakest, or the most important gap. Leave blank to generate one from the Clear line."
        >
          <TextArea
            rows={2}
            value={competency.workSample}
            onChange={(workSample) => patch({ workSample })}
          />
        </Field>
        <Field
          label="Optional interview probe"
          hint="Shown when the evidence level is Gap or Some."
        >
          <TextInput value={competency.probe} onChange={(probe) => patch({ probe })} />
        </Field>
        <div>
          <button
            type="button"
            disabled={!canRemove}
            onClick={() =>
              update((current) => ({
                ...current,
                role: {
                  ...current.role,
                  competencies: current.role.competencies.filter((item) => item.id !== competencyId),
                },
                overrides: Object.fromEntries(
                  Object.entries(current.overrides).filter(([id]) => id !== competencyId),
                ),
              }))
            }
            className="text-sm font-semibold text-heading disabled:cursor-not-allowed disabled:text-muted"
          >
            Remove competency
          </button>
          {!canRemove ? (
            <p className="mt-1 text-sm text-muted">Keep at least 4 competencies.</p>
          ) : null}
        </div>
      </div>
    </fieldset>
  );
}
