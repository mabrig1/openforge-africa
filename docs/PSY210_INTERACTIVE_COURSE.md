# PSY 210: Psychology in the Age of AI — Interactive OpenForge Course

## Evidence and source

The course adapts the user-supplied DOCX **PSY210_Psychology_in_the_Age_of_AI_Complete_Course_Book.docx**. Its cover identifies **PSY 210 — Psychology in the Age of AI: The Human Mind & Behavior in a Tech-Mediated World**, **Version 1.0, October 2026**, **4 proposed credits**, and a **14-week, 6–8 hours/week** schedule. The text declares an **Open Educational Resource licensed CC BY 4.0**. No individual author name appears on the supplied title page.

The actual file provided has **23 pages**, though its cover lists a *target length ~100 pages*. It references a separate instructor-only 60-item bank and model responses that were **not attached**. We do not represent those unseen files as available.

## Deliverables

**1. Standalone private downloadable full-course edition:**
- Single self-contained HTML containing *all* supplied reader paragraphs, workbook prompts, assessment sections, appendices and instructor guide; works offline without web services.
- Six modules with source sections and full supporting prose.
- **60 new, independently authored four-option formative practice questions**, ten per module. They align with the reader but are not a copy of the absent instructor answer key.
- Four exercises: **14-day SYNTHETIC mood pattern analysis**, PERMA product-feature audit, fictional group A/B selection-rate bias audit, and a **scripted 3-scenario interviewing practice** (not clinical counseling or an LLM).
- Option A design / Option B product-critique capstone, five-minute defense guidance, source rubric with 25/25/20/15/15 weightings, AI-use disclosure and self-owned draft TXT export.
- Optional browser speech, search, local progress/notes and JSON export. No tracking, inference calls, backend, or hidden uploads.

**2. OpenForge Africa native/web companion (this PR):**
- `/psy210` accessible from Home.
- Six source-grounded **review summaries** with 12 clearly labeled *companion* formative questions (two per module), optional device/browser text-to-speech, device-only progress (complete only when reviewed + practice attempted), and in-memory handoff to existing infographic/video studio.
- This lightweight repository companion is **not** the entire manuscript and does not claim to replace the standalone full-course reader.
- The full standalone HTML/DOCX remain separate downloadable owner assets. Do not assert they are served from production until uploaded and approved.

## Modules and weekly rhythm

| Module | Weeks | Content |
|---|---|---|
| 1 | 1–2 | Foundations of Mind & AI |
| 2 | 3–4 | AI as a Mirror — Self-Awareness & Well-being |
| 3 | 5–6 | Empathy, Relationships & AI |
| 4 | 7–8 | Decision-Making, Bias & Ethics |
| 5 | 9–11 | Virtual Practice Lab — Interviewing Skills |
| 6 | 12–14 | Applied Capstone Project |

## Integrity, scope and limitations

- All simulated mood observations, algorithmic screening rates and virtual clients are fictional; never present them as real results. The audit is not an efficacy study.
- The tool does not diagnose illness, conduct a real intake, provide therapy, replace supervision, award 4 university credits, or verify external citations or AI consciousness claims.
- Do not ask students to enter identifiable personal health data. Web localStorage and React Native AsyncStorage are not encrypted by OpenForge; on a shared device other users may access notes. Export and delete by user choice.
- The short in-app quiz is **formative**, not an examination; the standalone quiz contains the extra source-aligned items.
- The source's official assessment weighting is 15% + 15% + 25% + 30% + 15% = 100%. Institution-administered assessment is not implemented in this prototype.
- AI tutoring remains separately gated/off by default. No fee-bearing inference is started.
- Review the attributed source's licensing assertion before distributing the full standalone reader to third parties.

## Verification

- Standalone HTML's rendered behavior tested in headless Chromium using an in-memory page:
  **60/60 correct-answer interactions**, six content modules, fictional interview choices, audit controls, capstone TXT export, no uncaught JS errors.
  Browser policy in the testing sandbox prevented independent real file:// or localhost navigation, so **real reload persistence on a normal user's browser still needs testing**.
- GitHub CI for this PR verifies Node22 typecheck, 6-module structure, 12 quiz answer keys, Android/web exports, Wrangler preview checks and Playwright end-to-end flow including real reload persistence of the **in-app companion**.
- Required before production: Android physical device/TalkBack, science/ethics review, copyright and institutional approval, teacher evaluation of simulations.
- Stack dependency: previous OpenForge PRs #6 → #7 → #8 → #9 → #10. **No merging or deployment is authorized by this PR.**
