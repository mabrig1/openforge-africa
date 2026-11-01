# OpenForge Academy — Unified Student Dashboard v1.1 (draft)

## What this adds

This is a real mobile-first Academy dashboard for the two existing independent student-review tracks.

- **Logic and Critical Thinking:** 23 adapted chapter reviews with separate read markers and correct formative question markers.
- **PSY 210: Psychology in the Age of AI:** six adapted module reviews and three-question best-score checks; a module milestone needs both reading and at least 2/3 practice answers.
- **Unified overview:** 29 **self-study milestones**, not exam points, accredited credit or a degree. Both scores are calculated directly from their respective existing Zustand stores. Independent detailed learning history is preserved.
- **Transparent next step:** deterministic suggestion based on the learner's selected unfinished module or the first unfinished module. The dashboard explains whether to read, practise or revisit. No AI inference, adaptive black box or paid LLM calls.
- **Followed subjects:** private opt-in per subject only affects the weekly plan; course access is never locked. Both subjects remain visible.
- **Weekly study target:** choose 2, 3, 4, 5 or 7 sessions/week, with one explicit self-reported session per subject per local-calendar day. Log entries are bounded, deduplicated and cannot be backdated from the UI. Recorded sessions never inflate quiz/lesson progress.
- **Navigation:** from home to /academy, from dashboard to both subject screens; links back. Also provides existing Tutor, Reader, Explainer, and the PSY 210 fictional interview simulator.

## Data model and trust boundary

No new third-party accounts, cloud databases, secrets, chat transcripts, protected health data or remote network API calls. The dashboard reads the existing progress stores and keeps a separate `openforge-academy-study-plan-v1` AsyncStorage record with followed course IDs, a 1–7 weekly target and up to 90 deduplicated day-only course self-reports, retained for at most 90 days. Older, future, malformed or forged records are rejected by the helper. The records are **not encrypted**, do not verify participation, and may disappear if the browser's local storage is cleared.

`getAcademyDashboard` reads a clean snapshot, validates known chapter/module IDs, counts only actual qualifying review milestones, derives the course-specific next step, and returns no personal information. `academyWeeklySessions` uses Monday–Sunday grouping on local-calendar date strings via UTC parsing of *calendar-only* values, so it does not shift the date between timezones.

The dashboard is **not** enrollment in a formal institution, a grade, a clinical service, a credential, a certified study-time tracker or an AI-generated competence assessment. Course references remain those already in the respective PRs, with PSY210 CC BY 4.0 source attribution and the Logic author's separate all-rights-reserved manuscript.

## Validation

- Unit tests cover 29-course totals, deduplication, incomplete and malformed records, recommendation wording, complete course states, Monday boundaries, impossible and future dates, and per-subject weekly counts.
- CI browser smoke uses the actual Expo app at 375px; completes a logic reading+quiz and a PSY 210 reading+quiz, opens the new dashboard, verifies exactly 2 / 29 review milestones, sets a four-session weekly target, records two different subject days, verifies persistence across reload, and resumes Psychology from Academy and returns.
- Existing CI still verifies Node 22 typing/unit tests, Android export, web build, Wrangler local asset routing, local Tutor/Reader/Explainer, real preview/video export and student course simulations.

## Private standalone pack

The owner has also received a separately downloadable, **private** two-course offline bundle. It includes an index.html launcher, the complete interactive Logic HTML v2 and complete PSY 210 HTML v4, their original Word readers and a README. It does **not** share progress between the two independent HTML apps: only the OpenForge Academy application dashboard unifies native-review progress. Files are not committed to this public branch.

## Review/merge/deployment constraints

This PR stacks on **PR #12**, which stacks on #10, #9 and earlier draft dependencies. Separate **PR #11** is an overlapping, alternative PSY210 implementation — do not merge #11 and #12 separately without reconciling the shared route/data/store changes. None of these branches should be marked as merged or deployed merely because CI is green.

Need human accessibility/physical Android verification, approval for full-source publication, privacy review and permission to change production configuration before public release.
