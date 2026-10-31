# OpenForge Africa — Innovation Upgrade & Build Better Challenge (proposal)

**Status: DRAFT; no public competition launched.** This document is the upgrade specification and proposed public judging protocol. It does not announce any prize, official endorsement, independent ranking, partner institution or winner.

## Positioning

OpenForge Africa is a mobile-first, offline-first learning workspace for distance learners facing expensive or unreliable connectivity. Version 0.3 already stores course circles, notes, practice tasks, progress, focus sessions, manual study packs and a self-reported seven-day pilot locally. The Study Coach performs source-labelled **lexical retrieval**: it is not a generative model, and no learner outcome improvement has been scientifically demonstrated. AsyncStorage is unencrypted. The web export is not a guaranteed installable PWA. Do not market these as completed features.

The defensible claim to build toward is: **a reproducibly tested, accessible African low-connectivity learning assistant**. No fair evidence yet establishes its creator as the best AI developer or vibe coder in Nigeria.

## The highest-value upgrade sequence

### Gate A — Reliability, safety and unmistakable proof (this PR)

- Put a judge-friendly Challenge Lab in the running app, linked from the home screen.
- Offer a fictional, source-labelled study pack that runs through the normal validated import pathway; never seed real student records.
- Run six deterministic local integrity checks against actual grading, source matching, abstention, validation, pack parsing and progress code. Say clearly that these are self-checks, not independent AI benchmarks.
- Publish a 100-point competitive rubric and a public evidence ledger.
- Retain existing Expo/Cloudflare build and account settings. No live inference, deployment or database creation.

**Gate:** TypeScript, Node tests, Android export, web export, local Worker smoke, Chromium mobile navigation, browser persistence, offline/low-storage device testing and accessibility checks pass. Existing PRs and Cloudflare build errors require separate reconciliation; do not rely on GitHub CI alone to claim a live site is healthy.

### Gate B — Offline experience 2.0

- Add opt-in installable web PWA only after service-worker cache versioning, stale-cache recovery, CSP and offline route tests. Test airplane-mode launch *after initial install*.
- Add guided walk-through, downloadable small study packs, progress history, retryable content recovery, and safe backup/restore with clear disclosure.
- Provide read-aloud and language support only after accessibility, linguistic quality and consent checks with Yoruba, Hausa, Igbo and English-speaking learners.
- Publish a low-memory Android test matrix, performance budgets and actual measured cold-start/interaction results.

**Gate:** 2 GB RAM Android hardware, intermittent 2G/3G, disabled-storage browser, TalkBack, font enlargement and offline tests; verified recovery without silent data loss. Do not call a website offline-ready merely because its data storage is local.

### Gate C — Real AI Tutor (explicit optional cloud mode)

- Preserve a no-account/no-network offline Study Coach; accurately label it "offline note lookup".
- Add **opt-in** generative tutoring via a Cloudflare Worker API, behind verified authentication/anti-abuse controls, request limits, spending limits and server-side OpenRouter credentials. **Never put API keys in Expo web or Android client bundles.**
- Require explicit source selection and preview of exactly what note excerpts will be sent to a model; default to OFF. Do not upload entire course notebooks by default. Prompts must be bounded and scrubbed of obvious personally identifying fields with a warning that automated scrubbing is incomplete.
- Generate tutor guidance using allowed passages; return source identifiers and uncertainty. Run independent multilingual and adversarial tests for unsupported citations, prompt injection, copyright issues and biased or unsafe advice.
- Implement a deterministic non-AI fallback on timeout, budget exhaustion, zero connectivity or withdrawal of consent. Avoid assertions of a fully offline generative model until one is genuinely on-device and tested.

**Gate:** source-grounding precision/abstention benchmarks on held-out licensed cases, abuse tests, data-retention review, key-leak check, P95 latency/cost tracing and user approvals. Price changes and vendor terms must be checked before connecting providers.

### Gate D — Real collaboration and learner agency

- Add authenticated study-circle memberships, invitations, role-scoped task assignment, conflict-safe delayed sync and replay protection, all optional and tenant isolated.
- Support voluntary peer facilitation and mentor workflows without covert surveillance; never show self-reports as verified attendance.
- Adopt an explicit data retention/deletion policy, encrypted storage where practical, legal review of NDPA/GDPR duties as applicable, and documented incident response.
- Launch supervised pilots with ethics and institutional approval where needed. Measure outcome improvement with baseline and appropriate comparison groups, consent and transparent limitations.

**Gate:** third-party privacy/security review, opt-in participation and independent research analysis. Until then, impact and retention claims remain hypotheses.

### Gate E — Reproducible innovation and global reach

- Release a permissible public test corpus with synthetic examples and appropriate licensing; keep hidden, independently curated evaluation cases for challenge day.
- Publish reproducible scripts, device profiles, accessibility findings, failure cases and dated releases. Provide an SBOM, dependency audit and security contact.
- Publish properly licensed AI evaluation notebooks (e.g., Kaggle Community Benchmarks where suitable) and a source-controlled demonstration video.
- Add optional localized educational content only with permission; partner programs, certifications and institution integrations remain proposals until agreements exist.

## Proposed challenge: "Build Better Than OpenForge Africa"

**Track:** best practical low-data, privacy-respecting learning application. The task is **not** a popularity contest or an AI-generated marketing video contest. Participants may use any development approach, including vibe coding, but must make clear which capabilities are truly model-based.

**Required submission:** running Android APK or mobile-accessible web app; public demo walkthrough; reproducible test instructions; source/provenance and model/API disclosure; permissions and dependency list; a short threat model; evidence for offline behavior; license or permission to judge. Contestants retain their IP. A repository being public without a license does not automatically permit reuse.

**Core same-condition scenarios:**
1. Launch app on a declared low-memory Android phone; create a learning circle, save fictional notes and submit a practice quiz while disconnected.
2. Ask a question supported by supplied fictional notes, then ask an unrelated question. Capture source attribution and abstention rather than a fabricated answer.
3. Transfer fictional content to a second device using a documented user-approved workflow. Score actual methods, not pretend real-time synchronization.
4. Restart the app and verify stored local progress and failure handling. Test slow data, denial of storage permission and cancellation of destructive actions.
5. Test screen reader / font scaling and document what fails. For AI-enabled competitors, record exactly what content left the device and count cloud invocations.

**Rubric (100 points, published before opening):**

| Category | Points | Evidence |
| --- | ---: | --- |
| Working product | 25 | Human-verified end-to-end flows and restart |
| Accuracy and evidence | 20 | Grounded answers, appropriate abstention, no inflated claims |
| Offline and low-data | 20 | Measured offline and intermittent-network tests |
| Privacy and security | 15 | Consent, safe defaults, minimal transfer, attack tests |
| Accessibility | 10 | Budget phone, keyboard, screen reader and readability |
| Innovation and openness | 10 | Replicable novelty, source and troubleshooting notes |
| **Total** | **100** | |

**Judging safeguards:** recruit at least three judges independent of OpenForge. Declare conflicts; judges should not rate their own products. Publish raw scored evidence and a method for challenges/appeals. Use a hidden scenario set to reduce overfitting; avoid subjective AI-only judging. All entrants, including OpenForge, must be judged under the same published rules. If OpenForge loses, publish the result and celebrate the stronger solution.

**Not yet decided:** dates, venue/platform, fees (ideally free), prizes, winner title, judges, publication approval, licensing and sponsorship. Do not present these as announced. For an app-building contest a hackathon format is more appropriate than a predictive ML leaderboard; a Kaggle prediction contest instead needs a clearly specified dataset, target, evaluation metric and private solutions.

## Public, reproducible synthetic developer regression

Run `npm run benchmark:offline` with Node 22. The committed `benchmarks/offline-grounding-v1.json` contains eight fictional positive/no-evidence questions. The script produces JSON showing each expected source, predicted source and pass/fail; a mismatch exits nonzero, and CI executes the same script. This public development set helps detect regressions, but it is deliberately **small, visible and not held out**. A successful score is not independent accuracy validation, offline Android performance evidence, a competition result or proof of "AI" inference. Organizers must separately curate licensed held-out tasks before any competition begins.

## Evidence ledger template

Record for each claim: feature; source commit; scripted test; actual device/OS/browser; offline/network conditions; outcome; failure screenshots or logs; date; independent reviewer; limitations. Show **NOT VERIFIED** until independently checked. Never turn six local self-checks into a claim that the app has defeated competitors.

## Privacy and distribution boundaries

- The demo pack is fictional and opt-in; it never includes student names, academic transcripts, API tokens or university-issued course handouts.
- Local storage remains unencrypted; do not collect or store sensitive data in this version.
- Study-pack transfer through another app is neither authenticated nor encrypted by OpenForge.
- No competition submissions, analytics, leaderboards or user accounts are collected by this Challenge Lab.
- A public GitHub repository is not necessarily open-source licensed; select and commit a clear license before encouraging derivative work.
- No production deploy, Cloudflare binding, third-party account creation or model API payment is authorized by this draft.
