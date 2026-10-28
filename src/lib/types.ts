export const LEVELS = ["gap", "some", "clear", "strong"] as const;

export type EvidenceLevel = (typeof LEVELS)[number];

export const LEVEL_LABEL: Record<EvidenceLevel, string> = {
  gap: "Gap",
  some: "Some",
  clear: "Clear",
  strong: "Strong",
};

export type Rubric = Record<EvidenceLevel, string>;

export type SignalBand = Exclude<EvidenceLevel, "gap">;

export type Competency = {
  id: string;
  name: string;
  important: boolean;
  rubric: Rubric;
  /** Newline or comma separated phrases. A level is reached only when one of these appears in the graduate's text. */
  signals: Record<SignalBand, string>;
  workSample: string;
  probe: string;
};

export type EvidenceNote = {
  id: string;
  label: string;
  quote: string;
  url: string;
};

export type Project = {
  id: string;
  title: string;
  url: string;
  problem: string;
  hardest: string;
  change: string;
  notes: EvidenceNote[];
};

export type Role = {
  title: string;
  applicantLabel: string;
  competencies: Competency[];
};

export type Override = {
  level: EvidenceLevel;
  reason: string;
};

export type AppState = {
  role: Role;
  projects: Project[];
  overrides: Record<string, Override>;
};

export type Quote = {
  text: string;
  source: string;
  url: string;
  phrase: string;
};

export type CompetencyResult = {
  competencyId: string;
  level: EvidenceLevel;
  quotes: Quote[];
  reason: string;
};

export type Brief = {
  results: CompetencyResult[];
  gaps: CompetencyResult[];
  workSample: {
    competencyId: string;
    competencyName: string;
    task: string;
  } | null;
  probes: { competencyName: string; prompt: string }[];
};

export const REFLECTION_FIELDS = [
  {
    key: "problem",
    label: "What problem were you solving, and what did you personally do?",
  },
  {
    key: "hardest",
    label: "What was the hardest part, and how did you get past it?",
  },
  {
    key: "change",
    label: "What would you change if you did it again?",
  },
] as const;

export type ReflectionKey = (typeof REFLECTION_FIELDS)[number]["key"];
