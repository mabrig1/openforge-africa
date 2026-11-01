# OpenForge Academy — Four interactive subjects (draft)

## Uploaded source material and accurate scope

The owner supplied two new Word manuscripts on 1 November 2026.

1. **Mabrig Korie, Human Intelligence, Logic and AI Decision Science (first teaching edition, November 2026)**: **100 pages**, 20 original instructional units, a **20-week** pathway (~6–8 hours per week), seven applied labs, capstone guidance and a final examination. The full text is included *only* in the private downloadable ZIP. The public app's original **20 brief reviews and 20 new low-stakes formative questions** are adapted from this source, with attribution. No institutional credits are granted.
2. **FS 101: Introduction to Forge Studies**, OpenForge Africa: supplied **8-page course syllabus**, a **10-week** approximately 6-hour/week hybrid study/build pathway, five Forge Cycle phases (Discover, Build, Launch, Prove, Share), ten weekly shipped artifacts, source assessment weights **50% portfolio, 20% peer/mentor review, 15% upstream, 15% demo**, and five externally proof-gated milestones: Spark, Builder, Contributor, Launcher and Forger.

The FS 101 source says passing requires **50% plus all five milestones** and distinction requires **80% plus either 25 authentic users or a merged upstream contribution**. This implementation deliberately issues **no Foundation Certificate, grades or badges**, because a phone/browser app cannot verify real users, genuine deployments, external PRs or mentor judgments automatically. It allows **optional HTTPS evidence URLs and private notes** for later human inspection, clearly marked as **UNVERIFIED DRAFTS**. Public records must be collected with consent and must not expose personal interview information.

## Native app

- New routes `/decision-science` and `/forge-studies` deliver concise mobile-first original source-aligned reviews, application prompts, a formative reasoning check, local per-course progress and read-aloud.
- Source-aligned **20** decision-science units and **10** Forge weekly lessons; full supplied original textbooks remain available separately in the private ZIP.
- New `/decision-lab` supports real bounded, deterministic Bayes-base-rate and two-outcome expected-value arithmetic. Not medical or financial advice.
- The existing `/logic-lab` is cross-linked from formal-logic units; Text Reader and infographic/video storyboard are cross-linked for both new courses. No cloud inference required.
- `/academy` now aggregates **four independent course stores** into **59 self-study review milestones** (23 logic + 6 psychology + 20 decision + 10 Forge). Crucially, these are **NOT an academic grade, validated evidence or formal FS certification**.
- Study planning and self-reported sessions are extended to the four courses. Separate local stores preserve older logic/psychology records.
- New course progress and optional Forge notebook are stored on-device via AsyncStorage, without accounts, uploads or encryption; no health or personal interviewee data should be entered.

## Owner's separate private offline package

`OpenForge_Academy_Four_Course_Offline_Bundle_v2.zip` contains an `index.html` launcher and four standalone HTML courses: existing Logic v2 and Psychology v4; plus the **full 100-page Decision Science book** extracted into 20 browsable unit sections with applied lab/capstone/exam, and the **complete eight-page FS 101 syllabus** transformed into ten weekly study pages and a private proof-preparation notebook. All four original Word files are in `books/`. Offline reading and core exercises work without a network connection.

Independent HTML courses have separate localStorage records and **do not sync** to the native React Native Academy dashboard, which unifies the **native** review milestones only. Do not claim that downloadable files share state. Full texts are kept out of public GitHub pending owner publication/licensing approval.

## Verification plan

- CI Node 22 test suite: source module count (20), FS weeks (10), source evidence weights (100%), source artifact targets, safe invalid ID handling, probability and EV edge cases.
- Real Expo Android/web export and Wrangler smoke.
- 375px Chromium browser smoke: 20-unit route, newly authored quiz and reading persistence; move lesson into explainer; calculate Bayes posterior at 1% and 10% priors; FS weekly route, locally save an **unverified** fictional QA evidence link, confirm draft persistence; confirm native Academy shows all four subjects and 59 milestones after reload.
- Pre-merge gate: human content review, physical Android device, TalkBack, offline behavior, data minimization, and resolution of parallel draft PR #11. No PR merge, production deploy, payment, credential issuance or unapproved textbook publication.

## Dependency stack

Draft PR #14 depends on draft #13 which depends on #12, #10, #9 and earlier foundations. Parallel **PR #11** overlaps #12; do not merge them independently without reconciling stores/routes. Changes here are reviewable and reversible.
