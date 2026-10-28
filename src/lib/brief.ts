import {
  LEVEL_LABEL,
  type Brief,
  type Competency,
  type CompetencyResult,
  type EvidenceLevel,
  type Project,
  type Quote,
  type SignalBand,
} from "./types";

const LEVEL_ORDER: EvidenceLevel[] = ["gap", "some", "clear", "strong"];
const BANDS: SignalBand[] = ["strong", "clear", "some"];

export function phrasesFrom(text: string): string[] {
  return text
    .split(/[\n,]/)
    .map((part) => part.trim())
    .filter((part) => part.length >= 3);
}

function isBoundary(char: string): boolean {
  return char === "" || !/[a-z0-9]/i.test(char);
}

/** Returns the index of phrase in text, or -1. Short phrases must match a whole word. */
export function phraseInText(text: string, phrase: string): number {
  const needle = phrase.trim().toLowerCase();
  if (needle.length < 3) return -1;
  const hay = text.toLowerCase();
  let from = 0;
  while (from < hay.length) {
    const index = hay.indexOf(needle, from);
    if (index === -1) return -1;
    const before = index > 0 ? hay[index - 1] : "";
    const after = hay[index + needle.length] ?? "";
    if (needle.includes(" ") || (isBoundary(before) && isBoundary(after))) {
      return index;
    }
    from = index + 1;
  }
  return -1;
}

type CorpusItem = { text: string; source: string; url: string };

function corpus(projects: Project[]): CorpusItem[] {
  const items: CorpusItem[] = [];
  for (const project of projects) {
    const projectUrl = project.url.trim();
    const title = project.title.trim() || "Untitled project";
    const add = (text: string, source: string, url: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      items.push({ text: trimmed, source, url });
    };
    add(project.problem, `${title} · reflection · what you did`, projectUrl);
    add(project.hardest, `${title} · reflection · hardest part`, projectUrl);
    add(project.change, `${title} · reflection · what you would change`, projectUrl);
    for (const note of project.notes) {
      const label = note.label.trim() || "Evidence note";
      add(note.quote, `${title} · ${label}`, note.url.trim() || projectUrl);
    }
  }
  return items;
}

function excerptAround(text: string, index: number, length: number): string {
  if (text.length <= 320) return text;
  const regionStart = Math.max(0, index - 140);
  const regionEnd = Math.min(text.length, index + length + 140);
  let start = regionStart;
  let end = regionEnd;
  const sentenceStart = Math.max(
    text.lastIndexOf(". ", index),
    text.lastIndexOf("? ", index),
    text.lastIndexOf("! ", index),
    text.lastIndexOf("\n", index),
  );
  if (sentenceStart !== -1 && sentenceStart < index && sentenceStart >= regionStart - 20) {
    start = sentenceStart + (text[sentenceStart] === "\n" ? 1 : 2);
  }
  const after = index + length;
  const ends = [". ", "? ", "! ", "\n"]
    .map((mark) => text.indexOf(mark, after))
    .filter((pos) => pos !== -1);
  if (ends.length > 0) {
    const nearest = Math.min(...ends);
    if (nearest <= regionEnd + 40) {
      end = text[nearest] === "\n" ? nearest : nearest + 1;
    }
  }
  return text.slice(start, end).trim();
}

function quotesFor(items: CorpusItem[], phrases: string[]): Quote[] {
  const found: Quote[] = [];
  for (const item of items) {
    for (const phrase of phrases) {
      const index = phraseInText(item.text, phrase);
      if (index === -1) continue;
      found.push({
        text: excerptAround(item.text, index, phrase.length),
        source: item.source,
        url: item.url,
        phrase: item.text.slice(index, index + phrase.length),
      });
      break;
    }
  }
  return found.slice(0, 3);
}

export function rateCompetency(
  competency: Competency,
  projects: Project[],
): CompetencyResult {
  const items = corpus(projects);
  for (const level of BANDS) {
    const quotes = quotesFor(items, phrasesFrom(competency.signals[level]));
    if (quotes.length > 0) {
      const name = LEVEL_LABEL[level];
      return {
        competencyId: competency.id,
        level,
        quotes,
        reason: `${name} evidence. A phrase the employer listed for ${name} appears in the linked projects or reflections, and that phrase is quoted below.`,
      };
    }
  }
  return {
    competencyId: competency.id,
    level: "gap",
    quotes: [],
    reason:
      "Gap. No evidence found. None of the phrases for Some, Clear, or Strong appear in the linked projects or reflections. That means this was not shown, not that the person cannot do it.",
  };
}

function defaultTask(competency: Competency): string {
  const name = competency.name.trim() || "this competency";
  const clear = competency.rubric.clear.trim();
  const bar = clear
    ? ` A clear result on this role’s rubric looks like: ${clear}`
    : "";
  return `In 45 minutes, show ${name}.${bar} Keep it small enough to finish in a browser. A person reviews the work. This brief does not score it.`;
}

function pickTarget(
  results: CompetencyResult[],
  competencies: Competency[],
): Competency | null {
  if (competencies.length === 0 || results.length === 0) return null;
  const ranked = [...results].sort((a, b) => {
    const byLevel = LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level);
    if (byLevel !== 0) return byLevel;
    const aImportant = competencies.find((item) => item.id === a.competencyId)?.important;
    const bImportant = competencies.find((item) => item.id === b.competencyId)?.important;
    if (Boolean(aImportant) !== Boolean(bImportant)) return aImportant ? -1 : 1;
    return 0;
  });
  const id = ranked[0]?.competencyId;
  return competencies.find((item) => item.id === id) ?? null;
}

export function buildBrief(
  role: { competencies: Competency[] },
  projects: Project[],
): Brief {
  const results = role.competencies.map((competency) =>
    rateCompetency(competency, projects),
  );
  const target = pickTarget(results, role.competencies);
  const workSample = target
    ? {
        competencyId: target.id,
        competencyName: target.name.trim() || "Untitled competency",
        task: target.workSample.trim() || defaultTask(target),
      }
    : null;
  const probes = results
    .map((result, index) => ({ result, index }))
    .filter(({ result }) => result.level === "gap" || result.level === "some")
    .sort((a, b) => {
      const byLevel = LEVEL_ORDER.indexOf(a.result.level) - LEVEL_ORDER.indexOf(b.result.level);
      if (byLevel !== 0) return byLevel;
      return a.index - b.index;
    })
    .slice(0, 4)
    .map(({ result }) => {
      const competency = role.competencies.find((item) => item.id === result.competencyId);
      const name = competency?.name.trim() || "Untitled competency";
      const prompt =
        competency?.probe.trim() ||
        `What would you want a reviewer to see about “${name}”?`;
      return { competencyName: name, prompt };
    });

  return {
    results,
    gaps: results.filter((result) => result.level === "gap"),
    workSample,
    probes,
  };
}

export function safeHttpUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    if (url.protocol === "https:" || url.protocol === "http:") return url.toString();
    return null;
  } catch {
    return null;
  }
}
