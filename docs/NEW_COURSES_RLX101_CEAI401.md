# OpenForge Academy — RLX 101 and CEAI-401 (draft, private source)

## Source inspection

Two owner-uploaded courses were reviewed against current GitHub main and all active Academy PR stacks. Neither title nor subject was present before this feature. This branch is based on the latest working AIL 101 PR #16 (draft); it does NOT replace or merge any course work.

1. **RLX 101 — Foundations of Relationalics**. The supplied **40-page** course text proposes **12 weeks**, **3 credit hours**, a lecture and a seminar each week, twelve modules, reflection journals, case analysis, a Relationalics Design Audit and a capstone. Major ideas: relationship as unit of analysis, attachment, personhood, meaning, repair, calibrated trust, synthetic intimacy, displacement versus scaffolding, vulnerability, community/faith/culture and design accountability.
2. **CEAI-401 — Advanced Computational Ethnobotany & Precision AI Phytotherapy**. The supplied Markdown has **seven substantive teaching chapters** and an optional glossary/reference manual, and proposes **4 credits**. The progression is ethnobotany/plant chemistry; spectroscopic ML; molecular docking/network pharmacology; toxicity; process control; coding labs; and ethics/Indigenous knowledge rights. A course length in weeks is **not** specified in the supplied file, and this implementation does not invent one.

## What this draft branch implements

- Two dedicated Expo routes: `/relationalics` (12 reviews) and `/ethnobotany` (7 research-method reviews).
- Concise original, source-aligned content and **19 original formative practice questions**, including explanations and retry. Unit index, next/previous, read-aloud and transfer to the existing local Reader/Explainer.
- Independent persisted local progress with a valid-ID and correct-response requirement. Completing a milestone requires marking the review read **and** passing its formative check. The store uses a new key so existing courses remain unaffected.
- Integrates both courses into the common Academy dashboard, weekly study planner, and home screen. **Seven courses, 98 native review milestones** (23 + 6 + 20 + 10 + 20 + 12 + 7).
- Keeps original manuscripts and their teaching exercises/private student experiences out of public GitHub. Neither full DOCX nor original Markdown is committed.

## Required distinction: coursework vs. safety, accreditation and research

- **RLX 101 is not therapy or psychological diagnosis.** Use fictional exercises when possible. Never request learners' personal attachment stories or health histories; respect cultural and faith traditions; no assumption about AI consciousness.
- **CEAI-401 is not a medical or regulatory approval system.** In-silico scores, demonstration medicinal plant code and toy data do NOT establish human efficacy, safety, dosing, toxicity clearance or professional clinical competence. No extraction recipes, consumption instructions, testing on real people or biological experiments are part of these reviews.
- The CEAI supplied source uses a proof-of-concept `APPROVED` code label after drug-likeness screening; that label is scientifically too strong. The app **does not repeat it** and instead teaches 'requires qualified validation.' Source claims are teaching material, not independently verified clinical evidence.
- No certificates, formal grading, academic credit, real-user claims, secrets, external uploads or paid inference. On-device progress uses **unencrypted** AsyncStorage and should not store sensitive data.

## Verification (Node 22)

```bash
npm ci
npm run typecheck
npm test
npx expo export --platform android --output-dir dist
npm run build
npm run check:web
npm run cf:dry-run
npm run check:browser
```

Do not run any production deployment. The browser smoke script assumes the existing Wrangler local test harness and Playwright setup, as configured in GitHub Actions.

## Release gates

- [ ] Automated tests, typecheck, Android/web exports, Wrangler dry-run and browser smoke green **at the latest PR SHA**.
- [ ] Physical Android testing and accessibility review with TalkBack; keyboard/focus and TTS checks.
- [ ] Source owner reviews accuracy, attribution, licensing, and rights to make excerpts public.
- [ ] Academic/clinical domain reviewers confirm CEAI cautions and no implied medically validated outputs.
- [ ] Confirm old four+AIL local progress survives upgrade; confirm RLX and CEAI reset only their own records.
- [ ] Reconcile stacked and parallel Academy PRs before merge.

**Scope restriction:** Draft-only proposal. No merging, paid inference, publishing full texts, accredited claims or deployment without separate explicit authorization.
