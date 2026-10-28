import type { AppState, Competency, EvidenceNote, Project } from "./types";

function note(id: string, label: string, quote: string, url: string): EvidenceNote {
  return { id, label, quote, url };
}

const competencies: Competency[] = [
  {
    id: "c-feature",
    name: "Builds a working feature end to end",
    important: true,
    rubric: {
      gap: "No linked work shows a feature taken from a starting point to something a person can try.",
      some: "A partial feature, or only one layer (a screen, or an API), is described.",
      clear:
        "A working feature spans the interface and the data or API, and the graduate says what they personally built.",
      strong:
        "More than one feature is traced end to end, including a trade-off about how the pieces fit.",
    },
    signals: {
      some: "only the interface",
      clear:
        "I built the login flow and the monthly summary endpoint myself\nReact front end plus Node API",
      strong: "",
    },
    workSample: "",
    probe: "Walk me through one feature from the screen a person sees to the data it saves.",
  },
  {
    id: "c-readable",
    name: "Writes readable, maintainable code",
    important: false,
    rubric: {
      gap: "Nothing in the links speaks to how the code is organised.",
      some: "The work is split into parts, but some files are still very large or hard to follow.",
      clear: "Files are split by feature, and the graduate explains a structure choice.",
      strong: "The graduate shows a refactor and why the new structure is easier to change.",
    },
    signals: {
      some: "Components split by feature\nApp.tsx, 600+ lines",
      clear: "",
      strong: "",
    },
    workSample:
      "In 45 minutes, split one oversized component into two named pieces and say what each one is for.",
    probe: "Walk me through splitting App.tsx.",
  },
  {
    id: "c-tests",
    name: "Tests and debugs their own work",
    important: false,
    rubric: {
      gap: "No tests or debugging notes appear in the linked projects.",
      some: "The graduate describes a bug they tracked down, without an automated test.",
      clear: "At least one automated test is present, and they say what it covers.",
      strong: "Tests cover a failure they actually hit, and they say what the test protects.",
    },
    signals: {
      some: "tracked down a bug",
      clear: "unit test",
      strong: "what the test protects",
    },
    workSample:
      "Add validation and two unit tests to a provided sign-up form component.",
    probe: "How do you decide what to test?",
  },
  {
    id: "c-git",
    name: "Uses version control sensibly",
    important: false,
    rubric: {
      gap: "No commit history or branching is described.",
      some: "There are commits, but the messages are vague or everything landed in one step.",
      clear:
        "There is a run of commits with descriptive messages, or feature branches are used.",
      strong:
        "The history shows reviewable steps over time, and the graduate explains why they branched.",
    },
    signals: {
      some: "a few commits",
      clear:
        "140 commits over 3 months with descriptive messages\nfeature branches",
      strong: "",
    },
    workSample: "",
    probe: "Show me a commit message you would be happy for someone else to read.",
  },
  {
    id: "c-explain",
    name: "Explains technical decisions clearly",
    important: false,
    rubric: {
      gap: "Reflections describe what was built, but not why.",
      some: "A decision is named without the alternative they considered.",
      clear: "The graduate explains a decision in plain language.",
      strong: "The graduate explains a decision, the alternative, and the trade-off.",
    },
    signals: {
      some: "I decided to",
      clear: "I chose this because",
      strong: "switched from local storage to a database\ntrade-off",
    },
    workSample: "",
    probe: "Tell me about a decision you would make differently, and why.",
  },
  {
    id: "c-learn",
    name: "Learns a new tool or concept independently",
    important: false,
    rubric: {
      gap: "Nothing shows learning a tool or concept for this work.",
      some: "The graduate names something they had to look up.",
      clear:
        "They describe learning a tool in order to ship the project, and the project contains a trace of it.",
      strong: "They teach the idea back: what it is for, and what they would skip next time.",
    },
    signals: {
      some: "looked up",
      clear: "learning Docker to deploy\nDockerfile",
      strong: "",
    },
    workSample: "",
    probe: "What did you have to learn that was not taught in class, and how did you check you understood it?",
  },
];

const projects: Project[] = [
  {
    id: "p-budget",
    title: "budget-tracker",
    url: "https://example.com/demo/budget-tracker",
    problem:
      "I was solving a monthly budget for students who share a flat. I built the login flow and the monthly summary endpoint myself.",
    hardest:
      "The hardest part was learning Docker to deploy so a friend could try it on their laptop. I had not used containers before.",
    change:
      "I would split the main screen earlier. The pieces are organised, but one file is still far too long.",
    notes: [
      note(
        "n-readme",
        "README.md",
        "React front end plus Node API. The README explains local setup and the monthly summary.",
        "https://example.com/demo/budget-tracker#readme",
      ),
      note(
        "n-app",
        "src/App.tsx",
        "Components split by feature; some very long files (App.tsx, 600+ lines).",
        "https://example.com/demo/budget-tracker/src/App.tsx",
      ),
      note(
        "n-git",
        "Commit history",
        "140 commits over 3 months with descriptive messages; feature branches used.",
        "https://example.com/demo/budget-tracker/commits",
      ),
      note(
        "n-docker",
        "Dockerfile",
        "Dockerfile present, added while learning Docker to deploy the API.",
        "https://example.com/demo/budget-tracker/Dockerfile",
      ),
    ],
  },
  {
    id: "p-events",
    title: "campus-events",
    url: "https://example.com/demo/campus-events",
    problem:
      "A noticeboard for campus societies. I personally built the event list page.",
    hardest:
      "I switched from local storage to a database because the list disappeared when people changed phones, and the trade-off was a simpler host versus having to keep a database running.",
    change:
      "I would add a shorter empty state so a new society is not staring at a blank page.",
    notes: [],
  },
];

export function demoState(): AppState {
  return {
    role: {
      title: "Junior Web Developer",
      applicantLabel: "Applicant #A-014",
      competencies,
    },
    projects,
    overrides: {},
  };
}

export function blankState(): AppState {
  const demo = demoState();
  return {
    role: {
      ...demo.role,
      applicantLabel: "Applicant",
      competencies: demo.role.competencies.map((competency) => ({
        ...competency,
        signals: { some: "", clear: "", strong: "" },
        workSample: "",
        probe: "",
      })),
    },
    projects: [emptyProject("p-1")],
    overrides: {},
  };
}

export function emptyProject(id: string): Project {
  return {
    id,
    title: "",
    url: "",
    problem: "",
    hardest: "",
    change: "",
    notes: [],
  };
}

export function emptyNote(id: string): EvidenceNote {
  return { id, label: "", quote: "", url: "" };
}

export function emptyCompetency(id: string): Competency {
  return {
    id,
    name: "",
    important: false,
    rubric: {
      gap: "No evidence of this in the linked projects or reflections.",
      some: "A partial or indirect trace appears.",
      clear: "A direct example appears, and the graduate says what they did.",
      strong: "The example includes a trade-off or a result a reviewer can check.",
    },
    signals: { some: "", clear: "", strong: "" },
    workSample: "",
    probe: "",
  };
}
