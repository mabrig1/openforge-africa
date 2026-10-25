# OpenForge Africa

**An offline-first study workspace for African open and distance learning.**

> Study together. Even when mobile data runs out.

## Draft pilot-first upgrade (not released)

A new opt-in **seven-day study journal** is under review on a stacked feature branch. From the Circles screen, a learner can start a local pilot and self-report daily study mode, biggest obstacle and usefulness (1–5); optional aggregate-only report sharing remains voluntary. This is local **self-report**, not attendance validation, real peer sync, demonstrated retention impact, or institution-grade analytics. It does not connect to a backend or upload data. See [Pilot upgrade and Cloudflare-only architecture](docs/PILOT_CLOUDFLARE_ONLY.md) for real boundaries and Android release gates.

## Web deployment preparation (draft)

The web-compatible Expo Router build and **Cloudflare Workers static-assets staging** configuration are in a separate unmerged branch. `npm run build` exports an SPA to `dist/`; `npm run check:web` checks the output and `npm run cf:dry-run` validates Wrangler without uploading anything. Read [Cloudflare web deployment instructions](docs/CLOUDFLARE_WEB_DEPLOYMENT.md) **before** any domain change or deployment. Browser data remains local, unencrypted and is not synced with Android. No Cloudflare API, D1/R2 integration, institutional login, or public deployment has been made.

## Version 0.3 — what's real today

A working React Native/Expo **on-device learning workspace** that supports:

- Create course-specific study circles. Each workspace is local to the device.
- Save source-labelled course notes (up to 12,000 characters each) without cloud upload.
- Create study tasks: discussion, peer explanation, peer review and three-choice micro-quizzes.
- Submit an attempt and see deterministic grading; progress and task completion are persisted.
- Start a device-local focus sprint with a persistent start timestamp, stop or discard it, and optionally record a short reflection. Focus durations are wall-time estimates, not independently verified study/attendance.
- Preview and voluntarily share a **counts-only** learning digest (task completion, practice quiz results and focus time). Sharing never happens automatically; the digest includes no circle names, student identities, source text or reflection notes.
- Ask the **Study Coach** questions. It finds passages from saved notes using keyword overlap and clearly credits the source.
- Manually share a source-labelled study pack using Android Share, or import a pasted pack after preview and confirmation (strict size/shape validation, duplicate import detection).
- Remove notes and delete a circle together with its local content.
- Low-data and privacy-friendly design; no authentication or remote service required.

**Important:** Study pack exchange is **user-initiated**, unencrypted, unauthenticated and not real-time synchronization. The chosen sharing app may send content over the internet. Shared answer keys are not safe for examinations. Study Coach is a keyword-matching tool, **not** a local generative AI model and not semantic RAG. There is **no** multi-user synchronization, live chat, automatic invitation, Moodle connection or tutor reporting yet. One learner can plan activities for peers, but peers are not connected by this version. Do not evaluate v0.2 as though it offers live collaborative group work.

## Why OpenForge

Distance learners, including students at Nigeria's NOUN, may face isolation, expensive connectivity and limited device capability. A lightweight offline task-and-notes workspace is a practical first step toward genuine peer learning and institution-backed pilot evaluation. The impact hypotheses (improved retention, better assessment completion, lower tutor workload) are **not measured outcomes** until a consented pilot produces evidence.

## Get started

Requires Node.js 22 for the automated test runner. The current mobile app is pinned to Expo SDK 52 until a tested, incremental SDK migration is completed.

```bash
git clone https://github.com/mabrig1/openforge-africa.git
cd openforge-africa
npm install
npm run typecheck
npm test
npx expo start
```

Use a **compatible Expo development build / Expo Go version for SDK 52**. Current Expo Go may not support older SDK versions. For Android device tests, validate installation, persistence across restarts, low-storage behaviour, keyboard use and accessibility using a physical low-memory phone.

## App workflow

1. **Circles** → create a circle for a course (e.g., PAD 101).
2. Enter the circle → **Course notes** → paste course handout sections you have permission to use.
3. **Create task** → write a peer discussion prompt or three-option quiz; select the correct answer for a quiz.
4. **Tasks** → open a task and submit or mark completed.
5. **Study Coach** → choose course and ask about a term from saved notes.
6. **Progress** → see local task completion and first recorded quiz attempts.

## Privacy and trust

This release stores content in AsyncStorage on the device. It does not automatically transmit data, log analytics, collect identities, or upload material to a model. **Export through the native Share sheet is an intentional transfer to an app of your choosing**, not an encrypted channel controlled by OpenForge. **AsyncStorage is not encrypted**, so do not store student records, passwords, confidential documents or other sensitive data. It also has device-dependent size limits: course notes are deliberately small. Deleting the app may destroy all data. There is no cloud backup. Study pack transfer is **not a full personal-data backup** and exported content is not verified/signed.

This is **not** an official NOUN or other institution service. Course materials must be shared within copyright and institutional rules. No certificate or credential is issued. Study Coach matching is intended for study prompts, not verified academic answers.

## Local focus + consented reporting

- Focus sessions record a start and end timestamp, elapsed wall seconds (capped at four hours), and an optional private reflection (240 characters maximum). One active session per device; active state resumes on relaunch if local storage persists.
- A session shorter than 10 seconds is not saved. Device clock manipulation or background time can make measurements inaccurate.
- The voluntary digest includes **only aggregate numbers**, not individual academic records; small cohorts can still be reidentified in context. Never treat it as official assessment or evidence of supervised study.
- Sharing invokes the operating-system Share sheet **only after preview and two explicit user actions**. You remain responsible for choosing a trustworthy recipient.
- AsyncStorage is not encrypted and is inappropriate for sensitive learner records or confidential reflections.

## Project structure

```text
app/               Expo Router screens (circles, notes, tasks, Study Coach, progress)
lib/study.ts       Offline learning rules, validation, retrieval and scoring
lib/db.ts          Future SQLite schema (not wired to v0.2 user flows)
stores/            Versioned Zustand + AsyncStorage local persistence
tests/             Deterministic domain tests and privacy regressions (Node built-in runner)
.github/workflows/ Automated tests and TypeScript checks on PRs
docs/              Architecture, accessibility, grant metrics and next phases
```

## Production readiness

**Not production-ready for institutional rollout.** Automated TypeScript / unit tests, mobile smoke tests, privacy and accessibility audits, and safe backup/sync design are required. See [ARCHITECTURE](docs/ARCHITECTURE.md) and [GRANT_NOTES](docs/GRANT_NOTES.md).

## Roadmap

- **v0.4:** Explicit, encrypted peer-to-peer exchange or institution-hosted sync with per-circle identity, permissions, duplicate-safe imports and conflict resolution.
- **v0.5:** Proper retrieval engine over imported content, optional on-device ML only where device capabilities permit, tested quality benchmarks and tutor consent workflows.
- **v0.6:** Moodle/LTI adapter, institutional enrolment controls, privacy-impact assessment, accessible multilingual learning prompts, longitudinal pilot.
- **Security:** Signed releases, restricted telemetry by opt-in, durable key management, deletion/export controls, dependency review and adversarial sync tests.
- **Platform:** Stepwise upgrade from Expo SDK 52 to a supported SDK with native-build checks before shipping.

This MIT-licensed codebase welcomes university and research partners for ethical pilots.
