# The Integrated Soul — Expanded Course and OpenForge companion

## Verified source and scope

Owner-uploaded Word source: **The Integrated Soul: Philosophy, Psychology, and Christian Transformation — Course Master Blueprint**, 32 pages, a six-week cohort-based masterclass with a philosophy / psychology / Christian spirituality lens. Original weeks, in order:

1. The Architecture of the Human Soul
2. Cognitive Renewal & the Battle for Truth
3. Emotional Mastery & Inner Tranquility
4. Virtue, Habits, and Moral Character
5. Suffering, Trauma, and Redemptive Meaning
6. Relational Wholeness & Divine Vocation

Its original assessment is formative and facilitator-guided **without numeric grades**. Its capstone is an 8–12-page **Personal Life Blueprint**. Original source includes six distinct practicum tools, participant safety norms, a 90-day continuation plan, seminar discussion and facilitator checklists.

### Expanded manuscript (PRIVATE, **not** published in GitHub)

An expanded **64-page Word and PDF teaching edition** preserves the original blueprint and appends:
- Twelve new detailed seminars (two per original week), retaining the six-week core programme.
- Six worked fictional cases with a five-stage three-lens analysis each.
- Six practical, printable workshop templates; ethics and nonclinical guardrails.
- Socratic prompts, implementation guidance, a non-graded feedback rubric, an expanded capstone defense, a 90-day follow-through and an optional twelve-session pathway.
- Clarifications distinguishing theological belief, philosophical argument and empirical evidence.

These source manuscripts remain in the owner's private file delivery; **DO NOT commit the full DOCX/PDF into this public repository**.

### New OpenForge native self-study review

- `lib/integratedSoulCourse.ts`: twelve short, original source-aligned seminars, one multiple-choice formative question per seminar (12 total), six practicum names and six week themes; not the full copyrighted source text.
- `app/integrated-soul.tsx`: index by week, A/B seminars, accessible choice controls, right/wrong feedback and retry, next/previous, stop/read aloud, short lesson handoff to local Text Reader/Explainer and outline of the capstone.
- `stores/integratedSoulStore.ts`: new independently versioned device-local reading/quiz progress; reset with confirmation. A milestone requires both reading and correct quiz response.
- Academy catalogue/home and personal study planner now support **eight courses / 110 native self-study milestones**. All previous progress stores remain separate. No grades, accredited credit, pastoral endorsement or validated personal transformation.
- Full original text, private journal entries, counselling information, clinical treatment, personal trauma and participant records are excluded. `AsyncStorage` is not encrypted.

## Important safety and scholarly distinctions

- This is voluntary **Christian educational formation**, not clinical psychological therapy, diagnosis, trauma processing or crisis care. Learners may use fictional cases and opt out of reflective/breath-prayer activities.
- The original masterclass discusses polyvagal theory; its broad physiological claims are scientifically disputed. This expansion teaches simple optional grounding as an attention practice without claiming a diagnostic/autonomic or treatment mechanism. See Grossman (2023), *Biological Psychology*, 180, 108589, DOI 10.1016/j.biopsycho.2023.108589.
- Facilitators should follow safety, transparency, participant choice and appropriate specialist referral; see SAMHSA, Trauma-Informed Approaches and Programs. Structured CBT is not interchangeable with this reflective workbook (NICE NG222).
- An automatic multiple-choice milestone is **not** proof of virtues, healing, improved mental health or spiritual attainment. The source's capstone still requires thoughtful human facilitator feedback.

## Reversible technical validation (Node 22)

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

The browser runner assumes the project's local Wrangler and Playwright harness setup. No real cloud deploy.

### Required before preview and merging

- [ ] GitHub Actions latest-head full success: typecheck, tests, Android/web export, Wrangler local simulation, browser smoke.
- [ ] Physical Android TalkBack and web keyboard accessibility; verify read aloud, scroll, low bandwidth and local-storage persistence.
- [ ] Rights confirmation for short, newly written public course reviews; private original and expansion must not be uploaded publicly.
- [ ] Content and pastoral academic review, especially trauma boundaries, scientific claim uncertainty and faith/nonfaith inclusivity.
- [ ] Confirm existing seven courses retain saved records and that Soul reset only affects Soul.
- [ ] Reconcile stacked Academy PRs before merge/deploy; consider Cloudflare automatic preview build failures separately.

**DRAFT ONLY. No merge, deploy, publisher disclosure, AI paid inference, academic credential or private course publication.**
