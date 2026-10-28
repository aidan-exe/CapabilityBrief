# Capability Brief

**Credify System Thinking Challenge 2026**
**Challenge area 04: Graduate employability**
**Author:** Aidan Lottering, software developer, AvoChoc (South Africa)
**Status:** Concept and working prototype in progress (working title)

> **Challenge question:** How can employers identify capable graduates who lack traditional work experience?

---

## Contents

1. [Summary](#1-summary)
2. [Problem and context](#2-problem-and-context)
3. [Stakeholders and how the current system works](#3-stakeholders-and-how-the-current-system-works)
4. [Root causes, system relationships and key assumptions](#4-root-causes-system-relationships-and-key-assumptions)
5. [Proposed intervention: Capability Brief](#5-proposed-intervention-capability-brief)
6. [Feasibility, risks and trade-offs](#6-feasibility-risks-and-trade-offs)
7. [Fairness, privacy and unintended effects](#7-fairness-privacy-and-unintended-effects)
8. [Expected impact and how I will measure success](#8-expected-impact-and-how-i-will-measure-success)
9. [Limitations and next steps](#9-limitations-and-next-steps)
10. [How this was made: prototype and AI assistance](#10-how-this-was-made-prototype-and-ai-assistance)
11. [Sources](#11-sources)

---

## 1. Summary

Employers in South Africa often ask for years of experience even for entry-level roles. That filter is cheap to apply, but it says very little about whether a graduate can do the job, and it locks out exactly the people who most need a first chance.

Capability Brief is a lean web tool that swaps "how many years have you worked?" for "what can you show?" An employer defines a role with 4 to 6 competencies and a simple rubric. A graduate links 1 to 3 projects (for example, public GitHub repositories) and writes a short reflection on each. The tool produces a one-page brief that:

- rates the strength of evidence for each competency against the employer's rubric,
- quotes the specific evidence behind every rating,
- lists gaps where no evidence was found,
- suggests a 45-minute work-sample task to test the weakest or most important competency, and
- deliberately leaves out years of experience, institution name and other proxy signals.

The brief does not make a hiring decision. It gives a human reviewer a structured, transparent starting point for a shortlist and an interview, which is where the decision stays.

I started my first developer role in August 2026, so the gap between "can do the work" and "can prove it on a CV" is something I have seen up close. This document explains the system behind that gap, why I think this is a sensible place to intervene, and how I would test whether it actually helps.

---

## 2. Problem and context

### 2.1 The numbers

South Africa's labour market is under severe pressure, and young people carry most of it.

- The official unemployment rate was **33.6%** in Q2 2026, up from 32.7% in Q1 2026 (Stats SA, QLFS Q2 2026 [1]).
- Youth unemployment (ages 15 to 34) rose to **47.4%** in Q2 2026, with about 5.0 million young people unemployed [1].
- **36.4%** of young people aged 15 to 24 were not in employment, education or training (NEET) in Q2 2026 [2].
- Graduates do much better than the average: the graduate unemployment rate was **12.4%** in Q2 2026, compared with 39.2% for people without matric. But graduate unemployment rose year on year [2].

So a degree still helps a lot. The problem in this challenge is narrower and, I think, more fixable: a meaningful group of graduates who have the skills cannot get past the first filter because they do not have the *right kind of history* on paper.

### 2.2 The experience trap

Research on unemployed South African graduates by Graham, Williams and Chisoro (University of Johannesburg) found four main barriers: lack of relevant work experience, limited information about how to look for work efficiently, low social capital, and the high cost of job seeking [3]. Interviewees described the same loop again and again: most jobs they wanted asked for a set number of years of experience, which they could not get without a job. The same study found these graduates were actively searching (86% had searched in the previous three months, averaging about 12 applications) and spending on average R1,062 a month on job seeking, which was more than their average per-capita household income of R676 [3].

Harambee Youth Employment Accelerator states the contradiction directly: employers often require prior work experience, but "to get work experience, you need an experience of work," and it argues for focusing on work readiness instead [4]. The YES (Youth Employment Service) programme was built to break the same cycle by creating 12-month paid work experiences [5].

### 2.3 Why "years of experience" is a weak signal anyway

The experience filter is not only unfair to graduates. It is also a poor predictor. A large 2022 re-analysis of personnel selection research by Sackett, Zhang, Berry and Lievens estimated the validity of **years of job experience** for predicting job performance at about **0.07**, compared with about **0.33 for work-sample tests** and **0.42 for structured interviews** [6]. These figures come mostly from studies outside South Africa, so I treat them as directional rather than exact for this context. Even so, the gap is large enough to matter: employers are leaning on one of the weakest signals available.

There is also evidence that simply announcing "skills-based hiring" does not change much. A 2024 Harvard Business School and Burning Glass Institute study of US employers found that removing degree requirements led to fewer than 1 in 700 additional hires of non-degree workers, and many firms changed their policy in name only [7]. My reading of this is that the policy was not the bottleneck. The bottleneck was that hiring managers had no practical, trusted alternative signal to use instead. That is the gap Capability Brief targets.

### 2.4 Scope

To keep this realistic, I am focusing on:

- **Who:** recent graduates (degree or diploma) with little or no formal work experience in the target field.
- **Roles:** entry-level technical and digital roles first (junior developer, data, QA, IT support), because portfolio evidence is easiest to collect and inspect there. Section 9 covers how this could extend to other fields.
- **Where in the process:** the *screening and shortlisting* step, before interviews. This is where experience filters do most of their damage.

**Assumption A1 (labelled):** I am assuming a meaningful share of employers screen out graduates mainly on experience and proxies rather than on assessed skill. The Graham et al. interviews [3] and Harambee's experience [4] support this, but I have not found a South African dataset that measures how many entry-level adverts require experience. Checking that is one of my next steps.

---

## 3. Stakeholders and how the current system works

### 3.1 Stakeholders

| Stakeholder | What they want | What they currently experience |
|---|---|---|
| **Graduates** | A fair chance to show what they can do; low cost of applying | Rejection or silence, often with no reason; high cost of searching [3] |
| **Hiring managers** | Someone who can do the job and will not be a costly mistake | Too many applications, little time, low confidence in CVs from unknown graduates |
| **Recruiters / HR** | A defensible, efficient shortlist; compliance with employment law | Pressure to cut volume fast, which pushes them toward simple filters |
| **Universities and colleges** | Employable graduates; good placement outcomes | Weak feedback from employers about which skills are missing |
| **Bridging programmes** (Harambee, YES, bootcamps, learnerships) | Placement of the young people they support | Limited capacity; still dependent on employers being willing to take a chance |
| **Existing junior staff** | Capable new colleagues; manageable mentoring load | Pulled into reviewing take-home tasks or interviews |
| **Government and regulators** | Lower youth unemployment; fair and lawful hiring | Policy levers (POPIA, Employment Equity Act) that set the rules for assessment and data use [8][9] |

### 3.2 How the current system works

From the employer side, a typical entry-level hire looks something like this (this is my description of the common pattern, not a measured process):

1. A manager writes or reuses a job advert. "2 to 3 years' experience" is often copied from an older advert or a more senior role.
2. The advert attracts a large number of applicants, many of whom are applying widely because each application has a low chance of success.
3. A recruiter or applicant tracking system cuts the pile quickly, using whatever is easy to see: years of experience, past employer names, institution, keywords.
4. A small shortlist goes to interviews, which are often unstructured conversations.
5. Someone is hired. The organisation rarely checks later whether the screening criteria actually predicted who did well.

From the graduate side:

1. They apply to many adverts, often paying for data, transport and printing [3].
2. Most applications get no response, or an automated rejection with no reason.
3. Without feedback they cannot tell whether the problem was their skills, their CV, or just the filter. So they apply even more widely.
4. Those with networks get referrals that skip the filter. Those without networks keep hitting it [3].

The important point is that **nobody in this system is acting irrationally.** Each actor is responding sensibly to the pressure they face. The bad outcome comes from how the parts interact, which is why I think a system view is needed rather than simply telling employers to "be fairer" or telling graduates to "build more skills."

---

## 4. Root causes, system relationships and key assumptions

### 4.1 Root causes

I see five root causes. They are connected, not separate problems.

1. **Information asymmetry.** The employer cannot easily see what a graduate can do. The graduate cannot easily show it in a format the employer trusts. A CV is designed to show history, not capability.
2. **Screening under time pressure.** High application volumes force reviewers to use the cheapest possible filter. "Years of experience" is cheap to check, even if it predicts little [6].
3. **Risk asymmetry for the person hiring.** If a manager hires someone with experience and it goes badly, that is bad luck. If they hire an unproven graduate and it goes badly, it is their judgement that gets questioned. So individual incentives favour the "safe" proxy.
4. **Unequal access to signals.** Referrals, well-known internships and recognisable institution names are distributed unevenly, and in South Africa that inequality tracks historical and economic lines [3].
5. **No learning loop.** Employers rarely check whether their screening criteria predicted performance, so a poor filter can stay in place for years without anyone noticing.

### 4.2 Feedback loops

**Loop R1: the experience trap (reinforcing).**
No job → no recognised experience → filtered out at screening → no job. Each round makes the gap on the CV longer, which makes the next filter even more likely to reject. Programmes like YES break this loop for some people by supplying the missing experience directly [5], but their capacity is limited compared with the size of the problem.

**Loop R2: application volume (reinforcing).**
Low success rates → graduates apply more widely, including to roles that fit them less well → employers receive more applications → reviewers rely even more on cheap filters → success rates fall further. Both sides end up spending more effort for worse matches, and graduates carry real costs to keep going [3].

**Loop R3: network advantage (reinforcing).**
Graduates with networks get referred past the filter → they gain experience → their networks grow. Graduates without networks fall further behind. Over time this widens inequality even if every individual decision looks neutral.

**Loop B1: skills shortage pressure (balancing, but slow).**
When employers cannot fill roles, they eventually relax requirements or invest in training. This loop exists, but it is slow and reacts mainly to shortages, not to the cost of overlooked talent, which employers mostly cannot see.

**Loop R4 (a risk for any solution): gaming and trust collapse.**
If a new signal becomes important, people will optimise for it. If portfolios start to matter, some will be copied, padded or generated with AI. If reviewers notice, they stop trusting portfolios and fall back to experience filters. Any intervention has to be designed with this loop in mind from day one (see section 7).

### 4.3 Where to intervene (leverage)

I considered several places to intervene:

- **Create more experience** (more internships, learnerships, YES placements). Very valuable, but expensive, capacity-limited, and already being done by others [5].
- **Change graduate behaviour** (better CVs, more training). Helpful at the edges, but if the filter ignores the improvement, it does not change the outcome. The NYDA has made a similar point: skills must be matched by demand [10].
- **Change what the screener sees and how they judge it.** This is cheaper, works inside the existing hiring process, and directly targets root causes 1, 2 and 5.

I chose the third option. In systems terms, the leverage point is the **information flow at the screening step**: who sees what evidence, and against what criteria. If a reviewer can quickly see trustworthy, job-relevant evidence, the "cheap filter" stops being the only cheap option. That weakens loops R1 and R2 at the point where they are strongest.

I want to be honest about the boundary of this choice. Capability Brief does not create jobs. If the economy does not create enough positions, better screening mostly changes *who* gets hired, not *how many*. I think that still matters, because it can make hiring fairer and better matched, but it is not a fix for unemployment on its own.

### 4.4 Key assumptions

I want these to be visible so they can be tested, not hidden inside the design.

| # | Assumption | How confident I am | How I would test it |
|---|---|---|---|
| A1 | Many employers screen graduates mainly on experience and proxies | Medium (supported by [3][4], not measured at scale) | Sample local entry-level adverts; interview 5 to 10 hiring managers |
| A2 | Hiring managers will trust a structured evidence summary enough to shortlist from it | Low to medium | Pilot with blind comparison of briefs versus CVs |
| A3 | Many capable graduates have, or can quickly create, inspectable project evidence | Medium for tech roles, low for other fields | Track how many applicants can link at least one project |
| A4 | Rating evidence against a written rubric is more consistent than unstructured CV reading | Medium (structured methods generally outperform unstructured ones [6]) | Measure agreement between two reviewers on the same briefs |
| A5 | A 45-minute task is short enough that graduates with limited time, data or devices can complete it | Medium | Track completion rates and ask candidates about cost and difficulty |
| A6 | Employers will accept a tool that deliberately hides years of experience | Low to medium | Ask directly in pilot interviews; watch whether they try to work around it |

---

## 5. Proposed intervention: Capability Brief

### 5.1 The idea in one sentence

Replace "years of experience" at the screening step with a one-page, evidence-backed summary of what a graduate has actually done, judged against the competencies the role actually needs.

### 5.2 How it works

**Step 1: The employer defines the role.**
The hiring manager picks 4 to 6 competencies for the role, for example for a junior web developer:

- builds a working feature end to end,
- writes readable, maintainable code,
- tests and debugs their own work,
- uses version control sensibly,
- explains technical decisions clearly,
- learns a new tool or concept independently.

For each competency the manager writes, or picks from a template, a short rubric with four levels: *no evidence*, *some evidence*, *clear evidence*, *strong evidence*. Each level has a plain-language description of what it looks like. The tool nudges managers to stay at 4 to 6 competencies, because longer lists make reviewers fall back on gut feel.

**Step 2: The graduate submits evidence.**
The graduate links 1 to 3 projects. In the first version these are public GitHub repositories, but the design also allows a link to a document, a deployed site or a short write-up. For each project they answer three short reflection prompts:

- What problem were you solving, and what did *you* personally do?
- What was the hardest part, and how did you get past it?
- What would you change if you did it again?

The reflections matter. They show reasoning and ownership, which a repo on its own does not, and they make copied work easier to spot in a follow-up conversation.

**Step 3: The tool builds the brief.**
For each competency, the tool:

- looks for relevant evidence in the linked projects (for example: README content, project structure, presence of tests, commit history, and the graduate's reflections),
- proposes a rubric level,
- **quotes or links the exact evidence** behind that level (a file, a commit message, a sentence from the reflection), and
- marks a competency as a **gap** if it finds no evidence, rather than guessing.

The rating is a rating of *evidence strength*, not of the person. "No evidence found" means "this was not shown," not "this person cannot do it."

**Step 4: The tool suggests a work sample.**
Based on the gaps and the competencies the employer marked as most important, the brief suggests one 45-minute work-sample task, for example "add input validation and a test to this small form component." The task is meant to be realistic, short and doable on a modest laptop or in a browser.

**Step 5: A human decides.**
A reviewer reads the brief, can override any rating (with a short reason), and decides whether to invite the graduate to the work sample or interview. The brief can also feed directly into a structured interview, since it already lists what to probe.

### 5.3 What the brief deliberately leaves out

- **Years of experience.** Not collected and not shown.
- **Institution name and grades.** Not shown on the brief by default. These are strong proxies for background and can trigger the same bias the tool is trying to reduce.
- **Name, photo, age, gender, race, home address.** Not needed to judge evidence, so not shown to the reviewer at the screening step.
- **A single overall score.** There is no "73/100." A single number invites ranking by number and hides *why*. The brief shows a rating per competency, with evidence, so reviewers must engage with the content.

### 5.4 Example brief (illustrative)

> **Role:** Junior Web Developer
> **Candidate:** Applicant #A-014
>
> | Competency | Evidence level | Evidence |
> |---|---|---|
> | Builds a feature end to end | Clear | `budget-tracker`: React front end plus Node API; README explains setup; reflection: "I built the login flow and the monthly summary endpoint myself." |
> | Readable, maintainable code | Some | Components split by feature; some very long files (`App.tsx`, 600+ lines) |
> | Tests and debugs own work | **Gap** | No tests found in any linked project |
> | Version control | Clear | 140 commits over 3 months with descriptive messages; feature branches used |
> | Explains decisions | Strong | Reflection explains why they switched from local storage to a database, and the trade-off |
> | Learns independently | Clear | Reflection describes learning Docker to deploy; Dockerfile present |
>
> **Suggested 45-minute task:** Add validation and two unit tests to a provided sign-up form component.
> **Suggested interview probes:** How do you decide what to test? Walk me through splitting `App.tsx`.

### 5.5 How bias is reduced (and how it is not)

The design reduces bias in three main ways:

1. **Transparent rubric.** Everyone is judged against the same written criteria, set before anyone applies. The graduate can see the rubric when they submit.
2. **Evidence quotes.** Every rating must point to something concrete. A reviewer who disagrees can see exactly what they are disagreeing with, and the graduate could, in principle, be shown why a rating was given.
3. **Removing proxies.** Leaving out experience, institution and identity details at the screening step removes the most common triggers for "people like us" judgements.

It does **not** remove bias completely. The rubric itself can be biased (for example, if "communication" quietly means "sounds like a native English speaker"). Access to evidence is also unequal: building portfolio projects needs time, a device and data, which not every graduate has. Section 7 deals with this directly.

### 5.6 The prototype

I am building a working prototype for this challenge. The planned scope is:

- **Front end:** React with TypeScript (role setup, graduate submission, brief view).
- **Back end:** a small .NET or Node API that fetches public repository metadata and content through the GitHub API and stores role definitions and submissions.
- **Evidence matching:** a mix of simple, explainable checks (for example "are there test files?", "how many commits, over how long?") and an AI-assisted step that proposes ratings *only together with a quoted piece of evidence*. If no evidence can be quoted, the competency is marked as a gap.
- **Output:** a one-page brief viewable in the browser and exportable as PDF.

The prototype is a proof of concept, not a production hiring tool. It is not validated and should not be used to make real hiring decisions until it has been tested as described in section 8.

---

## 6. Feasibility, risks and trade-offs

### 6.1 Feasibility

**Technical:** High. The core pieces (a form, a GitHub API integration, rubric logic and a document view) are standard web development. I can build a usable prototype within the challenge timeframe using tools I already work with.

**Cost:** Low for a pilot. Hosting and API usage for a few dozen candidates is cheap. The bigger cost is reviewer time, which the tool is designed to *reduce* compared with reading CVs and then running unstructured interviews.

**Adoption:** This is the hardest part. Employers already have recruitment processes and applicant tracking systems. Capability Brief needs to fit beside them, not replace them. A realistic first step is to offer it as an optional "show your work" route for specific entry-level roles, alongside the normal application.

**Operational:** Someone at the employer has to define the competencies and rubric. If that takes too long, it will not happen. Templates for common roles keep this to roughly 15 to 20 minutes (an estimate to check during the pilot).

### 6.2 Risks

| Risk | Why it matters | Mitigation |
|---|---|---|
| **Gaming and copied work** | Copied repos or AI-generated projects would weaken trust in all briefs (loop R4) | Reflections must be specific; the work sample and interview check ownership; commit history over time is harder to fake than a single upload |
| **Over-trust in the tool** | Reviewers may treat a suggested rating as fact | No overall score; every rating has a quote; reviewers are prompted to confirm or override; the brief is clearly labelled "evidence summary, not a decision" |
| **AI mistakes** | The AI step can misread code or invent evidence | AI proposals must link to a real file or sentence, checked by the system; anything without a verifiable quote becomes a gap; simple rule-based checks are used where possible |
| **Narrow evidence type** | GitHub suits developers, not accountants or nurses | Start with tech roles; design evidence input to accept other formats later |
| **Employer non-adoption** | A good tool nobody uses has no impact | Pilot with a small number of willing employers; measure time saved, because that is what persuades busy managers |
| **Legal risk** | Assessments used in hiring are regulated in South Africa | See section 7.3 |

### 6.3 Trade-offs I am choosing to accept

- **Depth versus reach.** Focusing on tech roles first means the tool helps fewer people at the start, but the evidence is much easier to inspect and the results will be easier to trust.
- **Structure versus flexibility.** A fixed rubric of 4 to 6 competencies will miss some things a good interviewer might notice. I am accepting this because structure is what makes the process more consistent and harder to bias [6].
- **Time cost for candidates versus quality of signal.** Asking for reflections and a 45-minute task is more work than uploading a CV. I am trading a bit of candidate effort for a much stronger signal, and capping the task at 45 minutes so it stays reasonable. Unpaid take-home tasks that run for days are a known problem, and this design deliberately avoids them.
- **Hiding information versus employer comfort.** Some employers will want to see experience and institution. Hiding them by default is a deliberate choice, because it is the point of the intervention.

---

## 7. Fairness, privacy and unintended effects

### 7.1 Fairness

The biggest fairness risk is that Capability Brief could replace one unequal filter with another. "Years of experience" favours people who already got a first job. "Strong GitHub portfolio" favours people who had a laptop, reliable internet, free time and someone telling them portfolios matter. Graham et al. found that job seeking already costs unemployed graduates more than their household's per-capita income [3], so I cannot assume everyone has spare time and data to build side projects.

How I plan to handle this:

- **Accept small, coursework and group projects.** A final-year project, a bootcamp assignment or a group project counts, as long as the reflection explains what the graduate personally did.
- **Low-bandwidth design.** The submission form should work on a phone and on a slow connection. The work sample should be doable in a browser-based editor.
- **No evidence route.** A graduate with no projects can be offered the 45-minute work sample directly, so a missing portfolio does not mean automatic exclusion.
- **Check outcomes, not just intentions.** In the pilot I will compare how often different groups are rated at each level and invited forward. If one group is consistently rated lower, I treat that as a signal to examine the rubric and evidence rules, not as a fact about the group.
- **Rubric review.** Competency descriptions should be checked for hidden bias, for example "communication" should mean "explains clearly," not "polished English."

### 7.2 Privacy

Capability Brief handles personal information, so the Protection of Personal Information Act (POPIA) applies. My design principles are:

- **Collect the minimum.** Only what is needed to build the brief: project links, reflections and contact details held separately from the brief.
- **Clear consent and purpose.** Graduates are told what is collected, what is analysed, who sees the brief and for how long it is kept.
- **Public repos only, chosen by the graduate.** The tool does not crawl a graduate's whole profile or other accounts. It only reads what they link.
- **Retention limits.** Briefs are deleted after a set period (for example 6 to 12 months) unless the graduate asks to keep them.
- **Access and correction.** Graduates can see their own brief and ask for it to be corrected or deleted.

### 7.3 Automated decisions and assessment law

Two South African laws are directly relevant:

- **POPIA section 71** says a person may not be subject to a decision that affects them substantially and is based *solely* on automated profiling, including profiling of performance at work. Where an exception applies, the person must be able to make representations and must be given enough information about the logic to do so [8]. Capability Brief is designed so a human always makes the shortlisting decision, the logic is visible (rubric plus quotes), and the graduate can see and challenge the brief.
- **Employment Equity Act section 8** says psychological testing and "other similar assessments" of employees (including applicants) are prohibited unless they are shown to be scientifically valid and reliable, can be applied fairly, and are not biased [9]. I am not a legal expert, and I am not sure whether a tool like this would count as a "similar assessment." Because of that, I position Capability Brief as an **evidence summary that supports a human decision**, not as a test that scores people, and I treat validation (section 8) as required before real-world use. Getting proper legal advice is on the next-steps list.

### 7.4 Unintended effects

Thinking through what could go wrong if this actually worked:

- **Portfolio inflation.** If briefs become common, graduates may feel pressure to build ever-bigger portfolios, which shifts cost onto them. Capping evidence at 1 to 3 projects and rating *evidence quality* rather than quantity is meant to limit this.
- **Copying and AI-generated portfolios.** As above. The reflections, commit history and live work sample make this harder, and I expect to keep adjusting.
- **Narrowing what counts as "capable."** If only things that show up in a repo count, softer skills like teamwork or reliability may be undervalued. The brief should be one input into a structured interview, not the whole picture.
- **Employers using it to reject faster rather than include more.** The same tool could be used to filter out more people more quickly. I would track whether pilot employers invite *more* no-experience graduates to interview, not just whether they process applications faster.
- **Displacement.** If the number of jobs does not change, better screening helps some graduates at the expense of others. I think a fairer and more accurate competition is still an improvement, but I do not want to claim it creates jobs.

---

## 8. Expected impact and how I will measure success

### 8.1 Expected impact

If the assumptions in section 4.4 hold, I expect:

- **For graduates:** more graduates without formal experience reach the interview stage, and they get clearer feedback on what to work on (the gaps list).
- **For employers:** faster and more consistent shortlisting, a wider pool of candidates, and better-prepared interviews.
- **For the system:** a new, cheap and trusted signal at the screening step, which weakens the experience trap (R1) and the volume loop (R2), and creates the learning loop that is currently missing (root cause 5).

### 8.2 Pilot design

A realistic first pilot:

- **1 to 2 employers**, **1 to 2 entry-level tech roles**, roughly **20 to 40 graduate applicants**.
- Each applicant is reviewed in two ways: the usual CV review, and a Capability Brief review, ideally by different reviewers.
- Shortlisted candidates complete the 45-minute work sample.
- Where possible, follow up with hired candidates' managers after 3 months.

### 8.3 What I will measure

| What | Measure | Why it matters |
|---|---|---|
| **Access** | Share of shortlisted candidates who have no formal experience in the field, CV route versus brief route | Is the tool actually letting overlooked graduates through? |
| **Consistency** | Agreement between two reviewers rating the same brief | Structured evidence should be more consistent than CV reading (A4) |
| **Accuracy** | Correlation between brief ratings and work-sample performance; later, 3-month manager ratings | Does the brief predict anything useful? |
| **Efficiency** | Reviewer minutes per candidate | Busy managers will only adopt it if it saves time |
| **Fairness** | Ratings and invitation rates compared across groups (where graduates choose to share demographic data, stored separately) | Is the new filter just a new bias? |
| **Candidate experience** | Short survey: was it fair, clear, affordable to complete, and was the feedback useful? | If graduates find it costly or opaque, it fails its purpose |
| **Gaming signal** | Rate at which reviewers flag suspected copied or non-owned work | Early warning for loop R4 |

### 8.4 What "success" would look like for a first pilot

These are hypotheses, not promises:

- More no-experience graduates reach interview through the brief route than the CV route.
- Two reviewers agree on most competency ratings.
- Brief ratings show at least a positive relationship with work-sample scores.
- Review time per candidate is the same or lower than CV screening.
- No group is consistently rated lower without a clear evidence-based reason.
- Most graduates rate the process as fair and the feedback as useful.

If the pilot shows the brief does *not* predict work-sample performance, that is a useful result too. It would tell me the rubric or evidence rules need rethinking before anyone relies on them.

---

## 9. Limitations and next steps

### 9.1 Limitations

- **It does not create jobs.** It changes who gets seen and how fairly, inside the current number of openings.
- **Best suited to roles with inspectable output.** Software is the easy case. Fields like healthcare, law or finance would need different evidence types (case write-ups, simulations, supervised placements).
- **Not yet validated.** The rubric approach is supported by general selection research [6], but this specific tool has no evidence behind it yet. That is exactly what the pilot is for.
- **AI limits.** The AI step can be wrong. I have designed around this with quotes, gaps and human review, but it still needs testing.
- **Unequal access to evidence.** Even with the safeguards in section 7.1, graduates with more resources will usually have stronger portfolios.
- **Small, early evidence base for my assumptions.** Several assumptions (A1, A2, A6) rely on qualitative research and my own judgement rather than South African data at scale.
- **I am one developer.** Rubric design and fairness testing would be much stronger with input from HR professionals, industrial psychologists and graduates themselves.

### 9.2 Next steps

1. **Finish the prototype** for the challenge submission: role setup, project linking, reflections, brief generation with evidence quotes, and PDF export.
2. **Test assumption A1:** sample a set of South African entry-level tech adverts and record how many ask for years of experience.
3. **Talk to users:** 5 to 10 hiring managers and 10 or more recent graduates, to test whether the brief is trusted and whether the submission is affordable to complete.
4. **Build rubric templates** for 3 to 4 common entry-level tech roles, reviewed by at least one HR or recruitment professional.
5. **Run a small pilot** as described in section 8.2.
6. **Get legal input** on POPIA and Employment Equity Act section 8 before any real-world hiring use.
7. **Explore partners** such as bridging programmes or university career offices, which already work with graduates who lack experience and could help reach graduates without strong networks.
8. **Extend evidence types** beyond GitHub once the core approach is shown to work.

---

## 10. How this was made: prototype and AI assistance

I want to be open about how this submission was put together.

- **Prototype:** I am building a working prototype of Capability Brief for this challenge. At the time of writing it is in progress, and it is a proof of concept rather than a finished or validated product. The working prototype is this repository: https://github.com/aidan-exe/CapabilityBrief
- **AI assistance:** I used AI tools to help research sources, structure this document and draft parts of the text. I reviewed, edited and checked the content, and the ideas, design choices and judgements are mine. I am responsible for the solution, including its weaknesses.
- **Sources:** Statistics and research claims are cited below with links. Where I could not find a source, I have labelled the statement as an assumption or estimate.

---

## 11. Sources

1. Statistics South Africa. *Media release: Quarterly Labour Force Survey, Q2 2026.* https://www.statssa.gov.za/publications/P0211/Media%20Release%20QLFS%20Q2%202026.pdf
2. Statistics South Africa. *Quarterly Labour Force Survey, Quarter 2: 2026 (P0211).* https://www.statssa.gov.za/publications/P0211/P02112ndQuarter2026.pdf
3. Graham, L., Williams, L. and Chisoro, C. (2019). Barriers to the labour market for unemployed graduates in South Africa. *Journal of Education and Work*, 32(4), 360 to 376. https://doi.org/10.1080/13639080.2019.1620924
4. Harambee Youth Employment Accelerator. *7 ways to get young people working.* https://www.harambee.co.za/7-ways-to-get-young-people-working/
5. Youth Employment Service (YES). *YES Onboarding Toolkit* (January 2026). https://www.yes4youth.co.za/hubfs/YES_Onboarding%20Toolkit_Jan%202026.pdf
6. Sackett, P. R., Zhang, C., Berry, C. M. and Lievens, F. (2022). Revisiting meta-analytic estimates of validity in personnel selection: Addressing systematic overcorrection for restriction of range. *Journal of Applied Psychology*, 107(11), 2040 to 2068. https://doi.org/10.1037/apl0000994 (abstract: https://pubmed.ncbi.nlm.nih.gov/34968080/)
7. Fuller, J., Langer, C., Nitschke, J., O'Kane, L., Sigelman, M. and Taska, B. (2024). *Skills-Based Hiring: The Long Road from Pronouncements to Practice.* Harvard Business School and Burning Glass Institute. https://www.hbs.edu/ris/Publication%20Files/Skills-Based%20Hiring_80b90afa-f6b5-4de9-b7f8-5d8232ce20e2.pdf
8. Protection of Personal Information Act 4 of 2013, section 71 (Automated decision making). https://www.acts.co.za/protection-of-personal-information/71__automated_decision_making
9. Employment Equity Act 55 of 1998, section 8 (Psychological testing and other similar assessments). https://www.acts.co.za/employment-equity-act/8__psychological_testing_and_other_similar_assessments
10. National Youth Development Agency, via South African Government. *NYDA notes with serious concern latest Quarterly Labour Force Survey (QLFS) Q2.* https://www.gov.za/news/media-statements/nyda-notes-serious-concern-latest-quarterly-labour-force-survey-qlfs-q2-12
