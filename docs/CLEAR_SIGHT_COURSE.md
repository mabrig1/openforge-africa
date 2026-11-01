# Clear Sight — Mastering Discernment (source-aligned online companion)

**Owner-provided private source:** `Clear_Sight_Discernment_Expanded_100_Pages.docx`
(title: *Clear Sight: Mastering Discernment in an Age of Manipulation, State Failure & Toxic Environments*).

The user-supplied Word manuscript was checked in the working container: **100 pages** and **86 source lessons** across **six modules** (13 + 20 + 14 + 15 + 15 + 9). The source's **12-week suggested study route** is preserved as orientation, not recast as a new accredited program.

## Source-faithful course structure

| Source module | Source pages | Subject | Native short reviews |
| --- | --- | --- | ---: |
| 1 | 11–23 | The Case for Discernment | 4 |
| 2 | 24–43 | Seeing the Architecture of Manipulation | 4 |
| 3 | 44–57 | Cognitive and Emotional Hygiene | 4 |
| 4 | 58–72 | Calibration Systems | 4 |
| 5 | 73–87 | Application in Hostile Environments | 4 |
| 6 | 88–96 | Integration and Long-Term Practice | 4 |
| Capstone and reference | 97–100 | Personal Clarity Charter, 90-day review, glossary, references | integrated across reviews |

The **24 in-app lessons** are newly written, concise thematic reviews tied to source lesson-number/page ranges. They do **NOT** reproduce the complete 100-page book or replace its 86 full lessons, source exercises, knowledge checks or capstone. Every native review has three inquiry cues, a fictional activity, a three-answer low-stakes question with explanation and retry.

## App implementation

- `app/clear-sight.tsx`: full module index, 24 reading/quiz reviews, standalone **binary Brier score calculator** on synthetic data with 0–100% validation, local speech synthesis, short review transfer to offline Text Reader and Explainer Studio, Reset with confirmation.
- `lib/clearSightCourse.ts`: source mapping and deterministic pure helpers. Binary Brier formula: `(probability-outcome)**2` for probability in [0,1] and outcome in {0,1}. Lower mean scores signal better probability accuracy across a set of comparable resolved events. A single score never certifies general skill.
- `stores/clearSightStore.ts`: versioned on-device and **unencrypted** reading/quiz progress under a new key; only an authorized in-app pass check can count, no external grades or student identity.
- Academy/home/weekly plan integration adds the **ninth** course, increasing review-only milestones from **110 to 134**, preserving all older progress stores separately.
- Test coverage: original module mapping; numeric boundaries; duplicate/invalid progress; wrong/correct answers; Brier calculations; 375px browser navigation, local persistence and text transfer.

## Safety, evidence and source rights

- The manuscript frames discernment as revisable evidence-led judgment, **not perpetual suspicion**. Teaching about gaslighting, coercion, state performance and manipulation must not become diagnosis, public accusation, stalking, secret evidence gathering or political advocacy.
- The source explicitly requires prioritizing qualified local help for immediate danger, coercive control or legal/medical issues. In-app practice **only uses invented scenarios**, and no one must enter sensitive case records. Browser/device AsyncStorage is not encrypted and may not be safe on monitored devices.
- The user-owned full 100-page DOCX is **kept private** and **not committed** to this public GitHub repository; only the short source-aligned reviews are introduced in this draft.
- No new AI model invocation, paid tokens, autonomous publication, formal assessment, credential or diagnostic service.

## Verification (Node 22)

```sh
npm ci
npm run typecheck
npm test
npx expo export --platform android --output-dir dist
npm run build
npm run check:web
npm run cf:dry-run
npm run check:browser
```

## Before releasing

- [ ] GitHub verify CI green at latest head: TS, tests, Android and web export, Wrangler local route tests and Chromium mobile browser smoke.
- [ ] Human pedagogy and licensing review against all 86 original lesson titles/sections; source owner approves public summary text.
- [ ] Physical Android and TalkBack; low bandwidth, reading aloud, keyboard focus, live results, and local persistence.
- [ ] Review optional personal-safety wording for non-clinical, non-investigative scope.
- [ ] Confirm prior eight courses retain their progress; clear-sight reset affects only itself.
- [ ] Reconcile stacked PRs and any separate failing Cloudflare Workers Build before deployment.

**Draft PR only. No merge, production deployment, paid inference, full source publication or credential.**
