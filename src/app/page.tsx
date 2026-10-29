import Link from "next/link";
import { DemoActions } from "@/components/demo-actions";
import { SplitWorkspace } from "@/components/split-workspace";

const steps = [
  {
    n: "1",
    title: "The employer defines the role",
    body: "Four to six competencies, each with a short rubric: what Gap, Some, Clear, and Strong evidence looks like.",
  },
  {
    n: "2",
    title: "The graduate shows work",
    body: "One to three public projects, such as a repository link, and three short reflections on what they personally did.",
  },
  {
    n: "3",
    title: "The brief stays one page",
    body: "Each competency gets an evidence level, a quote, and a link. Gaps are listed. One optional 45-minute work sample is suggested. A human decides.",
  },
];

export default function HomePage() {
  return (
    <SplitWorkspace>
    <div>
      <h1 className="sr-only">What can you show, instead of how many years have you worked?</h1>
      <p className="text-sm font-semibold tracking-normal text-heading">
        Credify System Thinking Challenge 2026 · Area 04 Graduate employability
      </p>
      <p className="mt-3 text-lg leading-8 text-ink">
        Capability Brief is a lean tool for the screening step. Employers in South Africa
        often ask for years of experience even for a first role. That filter is cheap to
        apply and says very little about whether a graduate can do the work. This prototype
        swaps that question for evidence against a written rubric.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/brief"
          className="inline-flex items-center justify-center rounded-[10px] bg-emerald px-3 py-2 text-sm font-semibold text-heading"
        >
          Open the demo brief
        </Link>
        <Link
          href="/role"
          className="inline-flex items-center justify-center rounded-[10px] border border-[#6d6d6d] bg-white px-3 py-2 text-sm font-semibold text-ink"
        >
          Edit the role
        </Link>
        <Link
          href="/projects"
          className="inline-flex items-center justify-center rounded-[10px] border border-[#6d6d6d] bg-white px-3 py-2 text-sm font-semibold text-ink"
        >
          Edit the projects
        </Link>
      </div>

      <ol className="mt-10 grid gap-4">
        {steps.map((step) => (
          <li key={step.n} className="surface p-5">
            <p className="font-display text-2xl text-heading">{step.n}</p>
            <h2 className="mt-2 text-lg leading-6 text-heading">{step.title}</h2>
            <p className="mt-2 text-sm leading-6 text-ink">{step.body}</p>
          </li>
        ))}
      </ol>

      <section className="surface mt-8 p-5 sm:p-6">
        <h2 className="font-display text-2xl text-heading">What the brief leaves out</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-ink">
          <li>Years of experience. Not collected and not shown.</li>
          <li>Institution name, grades, photo, age, gender, and home address.</li>
          <li>A single overall score. There is no “73/100”. A number invites ranking and hides why.</li>
        </ul>
        <p className="mt-4 text-sm leading-6 text-muted">
          “Gap” means no evidence was found in what the graduate linked. It does not mean
          the person cannot do the thing. The rating is of evidence strength, not of the person.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl text-heading">Try the demo</h2>
        <p className="mt-2 leading-7 text-ink">
          The first visit loads a sample junior web developer role and two projects
          (budget-tracker and campus-events). Edit a competency phrase or a reflection,
          then open the brief again. Levels move only when a phrase you listed actually
          appears in the text. Nothing is stored on a server. It stays in this browser.
        </p>
        <div className="mt-4">
          <DemoActions />
        </div>
      </section>
    </div>
    </SplitWorkspace>
  );
}
