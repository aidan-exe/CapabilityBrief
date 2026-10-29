"use client";

import { DemoActions } from "@/components/demo-actions";
import { Field, TextArea, TextInput } from "@/components/ui";
import { emptyNote, emptyProject } from "@/lib/seed";
import { REFLECTION_FIELDS, type AppState, type ReflectionKey } from "@/lib/types";
import { useBriefState } from "@/lib/use-brief-state";

function createId(): string {
  return crypto.randomUUID();
}

export function ProjectEditor() {
  const { state, update } = useBriefState();
  if (!state) return <p className="text-muted">Loading projects…</p>;

  const count = state.projects.length;

  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold tracking-normal text-heading">Step 2 · Graduate</p>
      <h1 className="mt-2 font-display text-4xl text-heading">Link projects and reflect</h1>
      <p className="mt-3 leading-7 text-ink">
        Link 1 to 3 public projects. A repository, a deployed page, or a short write-up all
        count, including coursework and group work, as long as the reflection says what you
        personally did. This prototype does not call GitHub. Paste a short excerpt if you want
        a file, a commit message, or a README line to be quotable.
      </p>
      <p className="mt-3 text-sm leading-6 text-muted">
        A graduate with no project can leave this empty. The brief will mark the competencies
        as gaps and still suggest a 45-minute work sample, so a missing portfolio is not an
        automatic exclusion. What you type stays in this browser.
      </p>
      <div className="mt-4">
        <DemoActions />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl text-heading">
          Projects <span className="text-lg text-muted">{count} of 0–3</span>
        </h2>
        <button
          type="button"
          disabled={count >= 3}
          onClick={() =>
            update((current) => ({
              ...current,
              projects: [...current.projects, emptyProject(createId())],
            }))
          }
          className="rounded-sm bg-heading px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-line disabled:text-ink"
        >
          Add project
        </button>
      </div>

      <div className="mt-4 grid gap-5">
        {state.projects.length === 0 ? (
          <p className="rounded-sm border border-dashed border-line bg-sheet p-5 text-ink">
            No projects linked. The brief will show Gap for every competency.
          </p>
        ) : null}
        {state.projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            index={index}
            projectId={project.id}
            state={state}
            update={update}
          />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({
  index,
  projectId,
  state,
  update,
}: {
  index: number;
  projectId: string;
  state: AppState;
  update: (patch: (current: AppState) => AppState) => void;
}) {
  const project = state.projects.find((item) => item.id === projectId);
  if (!project) return null;

  const patchProject = (next: Partial<typeof project>) => {
    update((current) => ({
      ...current,
      projects: current.projects.map((item) =>
        item.id === projectId ? { ...item, ...next } : item,
      ),
    }));
  };

  return (
    <fieldset className="rounded-sm border border-line bg-sheet p-4 sm:p-5">
      <legend className="px-1 text-sm font-semibold text-muted">Project {index + 1}</legend>
      <div className="grid gap-4">
        <Field label="Project title">
          <TextInput value={project.title} onChange={(title) => patchProject({ title })} />
        </Field>
        <Field
          label="Public link"
          hint="Only what the graduate chooses to share. The demo links are samples on example.com, not live repositories."
        >
          <TextInput
            type="url"
            placeholder="https://"
            value={project.url}
            onChange={(url) => patchProject({ url })}
          />
        </Field>
        {REFLECTION_FIELDS.map((field) => (
          <Field key={field.key} label={field.label} hint="A short paragraph is enough.">
            <TextArea
              rows={4}
              value={project[field.key as ReflectionKey]}
              onChange={(value) => patchProject({ [field.key]: value })}
            />
          </Field>
        ))}

        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-ink">Evidence notes</h3>
            <button
              type="button"
              disabled={project.notes.length >= 6}
              onClick={() =>
                patchProject({ notes: [...project.notes, emptyNote(createId())] })
              }
              className="text-sm font-semibold text-heading disabled:text-muted"
            >
              Add a note
            </button>
          </div>
          <p className="mt-1 text-sm leading-5 text-muted">
            Paste a line from a README, a file, or a commit message. If a rubric phrase is in
            that line, the brief can quote it.
          </p>
          <div className="mt-3 grid gap-3">
            {project.notes.map((note) => (
              <div key={note.id} className="rounded-sm border border-line bg-white p-3">
                <div className="grid gap-3">
                  <Field label="Label" hint="For example README.md, src/App.tsx, or Commit history.">
                    <TextInput
                      value={note.label}
                      onChange={(label) =>
                        patchProject({
                          notes: project.notes.map((item) =>
                            item.id === note.id ? { ...item, label } : item,
                          ),
                        })
                      }
                    />
                  </Field>
                  <Field label="Excerpt">
                    <TextArea
                      rows={3}
                      value={note.quote}
                      onChange={(quote) =>
                        patchProject({
                          notes: project.notes.map((item) =>
                            item.id === note.id ? { ...item, quote } : item,
                          ),
                        })
                      }
                    />
                  </Field>
                  <Field label="Link for this excerpt" hint="Optional. Falls back to the project link.">
                    <TextInput
                      type="url"
                      value={note.url}
                      onChange={(url) =>
                        patchProject({
                          notes: project.notes.map((item) =>
                            item.id === note.id ? { ...item, url } : item,
                          ),
                        })
                      }
                    />
                  </Field>
                  <button
                    type="button"
                    onClick={() =>
                      patchProject({ notes: project.notes.filter((item) => item.id !== note.id) })
                    }
                    className="justify-self-start text-sm font-semibold text-heading"
                  >
                    Remove note
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            update((current) => ({
              ...current,
              projects: current.projects.filter((item) => item.id !== projectId),
            }))
          }
          className="justify-self-start text-sm font-semibold text-heading"
        >
          Remove project
        </button>
      </div>
    </fieldset>
  );
}
