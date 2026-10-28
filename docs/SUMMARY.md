# Capability Brief: One-Page Summary

**Credify System Thinking Challenge 2026, Challenge area 04: Graduate employability**
**Aidan Lottering**, software developer, AvoChoc (South Africa)

**Question:** How can employers identify capable graduates who lack traditional work experience?

## The problem

South Africa's youth unemployment rate (ages 15 to 34) was 47.4% in Q2 2026 (Stats SA). Graduates do better (12.4% unemployment), but that rate is rising, and many capable graduates get stuck in the experience trap: they cannot get a job without experience, and cannot get experience without a job. Research on unemployed SA graduates names lack of relevant experience, weak networks, poor job-search information and high search costs as the main barriers. Meanwhile, years of experience is one of the weakest predictors of job performance available (about 0.07, compared with 0.33 for work samples and 0.42 for structured interviews, Sackett et al. 2022).

## The system view

Nobody here is acting irrationally. High application volumes push busy reviewers toward cheap filters like years of experience. Hiring managers face more blame for an unproven hire than for a "safe" one. Graduates respond to silence by applying more widely, which raises volumes further. Graduates with networks get referred past the filter, and those without fall further behind. Employers rarely check whether their filters predict performance, so weak filters persist. I chose to intervene at the **information flow at the screening step**: what evidence the reviewer sees and what they judge it against.

## The intervention

**Capability Brief** is a lean web tool.

1. The employer defines a role with **4 to 6 competencies** and a short, written rubric.
2. The graduate links **1 to 3 projects** (for example public GitHub repos) and answers three short reflection prompts.
3. The tool produces a **one-page brief**: an evidence level per competency, **with a quote or link for every rating**, a list of gaps, and a suggested **45-minute work-sample task**.
4. **A human decides.** No single overall score. Years of experience, institution and identity details are left out.

## Fairness, privacy and risks

Main risk: swapping one unequal filter (experience) for another (polished portfolios). Mitigations: accept coursework and group projects, low-bandwidth design, a direct work-sample route for graduates with no projects, and checking outcomes across groups. Copied or AI-generated work is handled through specific reflections, commit history and the live work sample. Designed around POPIA (minimal data, consent, retention limits, and human review in line with section 71). Positioned as an evidence summary rather than a test, with validation and legal advice needed before real use, given Employment Equity Act section 8.

## Measuring success

Pilot with 1 to 2 employers and 20 to 40 graduates, comparing CV screening with brief screening. Measures: share of no-experience graduates reaching interview, agreement between reviewers, link between brief ratings and work-sample results, reviewer time per candidate, outcome gaps between groups, and candidate feedback.

## Limitations and next steps

It does not create jobs, it suits roles with inspectable output (tech first), and it is not yet validated. Next: finish the prototype, check how many SA entry-level adverts demand experience, interview hiring managers and graduates, build rubric templates, run the pilot, and get legal input.

## Transparency

I am building a working prototype for this challenge (in progress). AI tools helped with research and drafting. I reviewed the content, and I am responsible for the solution. Full sources are in `PROJECT_DOCUMENTATION.md`.
