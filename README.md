# Capability Brief

**Credify System Thinking Challenge 2026 · Challenge area 04: Graduate employability**

Aidan Lottering, software developer, AvoChoc (South Africa)

**Question:** How can employers identify capable graduates who lack traditional work experience?

## What it is

Capability Brief is a lean web prototype for the screening step. An employer defines a role with 4 to 6 competencies and a short written rubric (what Gap, Some, Clear, and Strong evidence looks like). A graduate links 1 to 3 public projects and writes a short reflection on each. The tool produces a one-page brief:

- an evidence level per competency, with the phrase that supported it quoted and linked
- a list of gaps where nothing matched
- an optional 45-minute work-sample suggestion
- suggested interview probes for Gap and Some

A human decides. There is no overall score. Years of experience, institution, and identity details are not collected and not shown.

The fuller system argument, sources, and assumptions are in [docs/PROJECT_DOCUMENTATION.md](docs/PROJECT_DOCUMENTATION.md). A one-page summary is in [docs/SUMMARY.md](docs/SUMMARY.md).

## What it is not

This is not an applicant tracking system, not a hiring decision, and not a validated assessment. It does not claim predictive validity. “Gap” means no matching evidence was found in what was linked. It does not mean the person cannot do the work. Do not use it for a real hiring decision. South African assessment and privacy rules (including Employment Equity Act section 8 and POPIA section 71) need proper legal advice before any real-world use. That advice has not been obtained.

## How to run locally

Requires Node.js 22 or newer.

```bash
npm install
npm test
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`npm run lint` and `npm run build` are available. No environment variables, database, or API keys are required.

## How the demo works

The first visit loads a sample **Junior Web Developer** role and two projects (`budget-tracker` and `campus-events`), labelled Applicant #A-014. You can also press **Load demo** on any step.

1. Open **Brief** to see the one-page scorecard.
2. Open **Role** and edit a competency, its rubric, or the phrases that count as Some, Clear, or Strong.
3. Open **Projects** and edit a reflection or an evidence note. Add a sentence such as “I added a unit test for the summary endpoint” to move **Tests and debugs their own work** off Gap.
4. Return to **Brief**. Levels, quotes, gaps, and the work-sample suggestion update from what is on the page.

Sample links use `example.com`. They are not live repositories. The app does not call GitHub.

Everything is stored in `localStorage` in the browser (`capability-brief-mvp-v1`). **Start from the role template** keeps the competency names and clears phrases, projects, and overrides.

A reviewer can override a level on the brief. The override is shown only after a short reason is written. The quoted evidence stays visible.

### How a level is chosen

There is no model and no numeric score. For each competency the app searches the reflections and pasted excerpts for phrases the employer listed:

- a Strong phrase sets Strong
- otherwise a Clear phrase sets Clear
- otherwise a Some phrase sets Some
- otherwise the level is Gap

The matching phrase is quoted. If it is not in the text, it cannot support a level. The work sample follows the weakest level, and prefers a competency marked most important when the level is tied.

## Disclosure

This is a prototype, not a finished or validated product.

Aidan Lottering owns the concept and the decisions, including what the brief leaves out. AI assistants helped implement the prototype, and AI tools helped research and draft parts of the written submission in `docs/`. He reviewed the content and the behaviour, and he is responsible for the solution, including its weaknesses.

The evidence rules in the running app are deterministic phrase checks. They are not an AI scoring model.

## Limitations

- It does not create jobs.
- It does not read repository contents, commit history, or private profiles. A reviewer only sees text entered in the browser.
- Phrase matching misses evidence that uses different words, and it trusts whatever excerpt was pasted.
- It is aimed at roles with inspectable output. Other fields need different evidence.
- Access to projects is unequal. Time, a device, and data are not universal.
- It is one developer’s prototype. Rubric design would be stronger with HR, industrial psychology, and graduate input.
- There is no pilot, no inter-rater study, and no claim that these levels predict job performance.

## Deploy

The app is a Next.js App Router project and can be imported on Vercel with no extra configuration and no environment variables.

```bash
npx vercel
```

Framework preset: Next.js. Build command: `npm run build`. Output is the default Next.js build.

If this repository’s Vercel project has a public URL, it is recorded in the pull request. Otherwise import `https://github.com/aidan-exe/CapabilityBrief` in the Vercel dashboard and deploy `main` after merge, or deploy the `feat/capability-brief-mvp` branch as a preview.
