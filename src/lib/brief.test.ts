import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildBrief, phraseInText } from "./brief";
import { demoState } from "./seed";
import type { Project } from "./types";

function corpusText(projects: Project[]): string {
  return projects
    .flatMap((project) => [
      project.problem,
      project.hardest,
      project.change,
      ...project.notes.map((note) => note.quote),
    ])
    .join("\n");
}

describe("phrase matching", () => {
  it("does not treat a short word as a match inside a longer word", () => {
    assert.equal(phraseInText("the latest update", "test"), -1);
    assert.ok(phraseInText("I added a unit test for the form", "unit test") >= 0);
  });

  it("ignores phrases shorter than 3 characters", () => {
    assert.equal(phraseInText("an API route", "AP"), -1);
  });
});

describe("demo brief", () => {
  const demo = demoState();
  const brief = buildBrief(demo.role, demo.projects);

  it("rates the sample junior role the way the write-up illustrates", () => {
    const levels = Object.fromEntries(
      brief.results.map((result) => {
        const name = demo.role.competencies.find(
          (competency) => competency.id === result.competencyId,
        )?.name;
        return [name, result.level];
      }),
    );
    assert.deepEqual(levels, {
      "Builds a working feature end to end": "clear",
      "Writes readable, maintainable code": "some",
      "Tests and debugs their own work": "gap",
      "Uses version control sensibly": "clear",
      "Explains technical decisions clearly": "strong",
      "Learns a new tool or concept independently": "clear",
    });
  });

  it("quotes only text the graduate actually supplied", () => {
    const text = corpusText(demo.projects);
    for (const result of brief.results) {
      for (const quote of result.quotes) {
        assert.ok(text.includes(quote.text), quote.text);
        assert.ok(quote.text.toLowerCase().includes(quote.phrase.toLowerCase()));
      }
    }
  });

  it("lists the missing tests competency as the only gap and suggests that work sample", () => {
    assert.equal(brief.gaps.length, 1);
    assert.equal(brief.gaps[0]?.competencyId, "c-tests");
    assert.equal(
      brief.workSample?.task,
      "Add validation and two unit tests to a provided sign-up form component.",
    );
    assert.deepEqual(
      brief.probes.map((probe) => probe.prompt),
      ["How do you decide what to test?", "Walk me through splitting App.tsx."],
    );
  });

  it("has no overall score", () => {
    assert.equal("score" in brief, false);
    assert.equal(brief.results.some((result) => "score" in result), false);
  });
});

describe("editing evidence", () => {
  it("moves tests off Gap when a reflection contains the Clear phrase", () => {
    const demo = demoState();
    const projects = demo.projects.map((project) =>
      project.id === "p-budget"
        ? {
            ...project,
            problem: `${project.problem} I added a unit test for the summary endpoint.`,
          }
        : project,
    );
    const brief = buildBrief(demo.role, projects);
    const tests = brief.results.find((result) => result.competencyId === "c-tests");
    assert.equal(tests?.level, "clear");
    assert.match(tests?.quotes[0]?.text ?? "", /unit test/);
  });

  it("drops readable code to Gap when the supporting note is removed", () => {
    const demo = demoState();
    const projects = demo.projects.map((project) =>
      project.id === "p-budget"
        ? { ...project, notes: project.notes.filter((note) => note.id !== "n-app") }
        : project,
    );
    const brief = buildBrief(demo.role, projects);
    const readable = brief.results.find((result) => result.competencyId === "c-readable");
    assert.equal(readable?.level, "gap");
    assert.equal(readable?.quotes.length, 0);
  });

  it("marks every competency as a gap when there are no projects", () => {
    const demo = demoState();
    const brief = buildBrief(demo.role, []);
    assert.equal(brief.results.every((result) => result.level === "gap"), true);
    assert.equal(brief.workSample?.competencyId, "c-feature");
  });
});
