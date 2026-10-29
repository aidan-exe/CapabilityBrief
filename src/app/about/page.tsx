import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Capability Brief for Credify challenge area 04, graduate employability. What the prototype is, what it refuses to claim, and how it was made.",
};

export default function AboutPage() {
  return (
    <article className="max-w-3xl">
      <p className="text-sm font-semibold tracking-normal text-heading">
        Credify System Thinking Challenge 2026 · Area 04
      </p>
      <h1 className="mt-3 font-display text-4xl text-heading">About this prototype</h1>
      <p className="mt-4 text-lg leading-8 text-ink">
        Question: how can employers identify capable graduates who lack traditional work
        experience?
      </p>
      <p className="mt-4 leading-7 text-ink">
        South Africa’s youth unemployment rate (ages 15 to 34) was 47.4% in Q2 2026, and
        graduate unemployment was 12.4% and rising (Stats SA). Many capable graduates get
        stuck because a first job asks for experience they cannot get without a job. Research
        on unemployed South African graduates names lack of relevant experience, weak
        networks, thin job-search information, and the cost of searching as the main barriers.
        Years of experience is also a weak predictor of job performance in the selection
        literature Sackett and colleagues re-analysed in 2022. Those figures are background
        for the problem. This prototype does not measure them, and it does not claim
        predictive validity of its own.
      </p>

      <h2 className="mt-10 font-display text-2xl text-heading">The intervention</h2>
      <p className="mt-3 leading-7 text-ink">
        The leverage point is the information a reviewer sees at screening, and the criteria
        they judge it against. An employer writes 4 to 6 competencies and a plain-language
        rubric. A graduate links 1 to 3 projects and answers three prompts: what they
        personally did, what was hardest, and what they would change. The brief quotes the
        evidence behind every level, lists gaps, and can suggest one 45-minute work sample.
        There is no overall score. A human decides.
      </p>
      <p className="mt-3 leading-7 text-ink">
        In this build, levels come from phrases the employer lists. If a phrase is not in the
        reflection or an excerpt the graduate pasted, it cannot support a level. That is a
        deliberate limit. The page says how the level was chosen. It is not a hidden model.
      </p>

      <h2 className="mt-10 font-display text-2xl text-heading">Fairness, privacy, and the law</h2>
      <p className="mt-3 leading-7 text-ink">
        The main risk is swapping one unequal filter (experience) for another (a polished
        portfolio). The design accepts coursework and group projects, keeps the submission
        short enough for a phone, and still offers a work sample when someone has no project.
        Copied or generated work is a real risk. Reflections, a visible history, and a live
        work sample are how a reviewer checks ownership. This demo does not verify that.
      </p>
      <p className="mt-3 leading-7 text-ink">
        The written design follows a minimum-data reading of POPIA: project links and
        reflections, a human decision rather than a solely automated one (section 71), and
        no identity fields on the brief. It is positioned as an evidence summary, not as a
        psychological test. Employment Equity Act section 8 is a reason to get legal advice
        before any real hiring use. Nothing here has been validated for that.
      </p>

      <h2 className="mt-10 font-display text-2xl text-heading">Limitations</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 leading-7 text-ink">
        <li>It does not create jobs. It only changes what a reviewer can see.</li>
        <li>It fits roles with something a person can inspect. Software is the easy case.</li>
        <li>It does not fetch repositories, score people, or predict who will do well.</li>
        <li>Graduates with more time, equipment, and data will usually have more to show.</li>
        <li>Phrase matching can miss real evidence that uses different words, and it can over-trust a pasted line.</li>
      </ul>

      <h2 className="mt-10 font-display text-2xl text-heading">How this was made</h2>
      <p className="mt-3 leading-7 text-ink">
        Aidan Lottering, a software developer at AvoChoc in South Africa, owns the concept,
        the rubric choices, and the decision to leave out years of experience and an overall
        score. AI assistants helped research and draft the written submission, and helped
        implement this prototype. He reviewed the work and is responsible for it, including
        its weaknesses.
      </p>
      <p className="mt-3 leading-7 text-ink">
        The full system write-up, sources, and one-page summary are in the repository at{" "}
        <span className="font-medium">docs/PROJECT_DOCUMENTATION.md</span> and{" "}
        <span className="font-medium">docs/SUMMARY.md</span>.
      </p>
      <p className="mt-6">
        <Link href="/brief" className="font-semibold text-heading underline">
          Open the demo brief
        </Link>
      </p>
    </article>
  );
}
