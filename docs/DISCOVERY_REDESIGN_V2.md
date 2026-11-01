# OpenForge Africa — Student Discovery Redesign v2

## Why this redesign
A user evaluating the production site found the homepage functional but visually unappealing and insufficiently useful for course discovery. The previous dark homepage surfaced repeated card CTAs and did not offer native search, live per-course progress, or personal recommendations.

## Open-source feature research (concepts, not code)

- [harshit1330/Learning-Management-Dashboard](https://github.com/harshit1330/Learning-Management-Dashboard) — inspiration for searchable course discovery, learner progress and task-first education dashboards. Reported MIT license. **No code, styles, art or branding copied.**
- [guillermoscript/lms-front](https://github.com/guillermoscript/lms-front) — inspiration for contextual progress, practice-first learning pathways and learner engagement. Reported MIT license. **No code, styles, art or branding copied.**
- [gongool/acadevo](https://github.com/gongool/acadevo) — inspiration for course cover hierarchies and visible progress indicators. Reported MIT license. **No code or assets copied.**

The implementation is original Expo/React Native code compatible with existing Cloudflare Workers and offline-first state stores. It introduces no new package, external image or API, no external assets, no payments and no credential flow. Actual course titles/routes/progress are reused from OpenForge's existing Academy dashboard and **never fabricated**.

## Implemented
- Responsive, light editorial landing page with strong dark hero, original role-network illustration built from RN primitives and vivid subject covers.
- Functional, case-insensitive course search and combined subject filtering over all ten actual Academy subjects.
- Progress-aware next-course launcher driven from existing local Academy stores, and real milestone counters (not pretend statistics).
- Clear Academy, 15-role classroom, Tutor, Explainer Studio, Reader, Practice Lab and saved Circles pathways.
- Navigable mobile and desktop layouts, horizontal category chips, keyboard-accessible labelled actions, real empty-state recovery and low-data offline-compatible art.
- Course source remains the ten **short source-aligned reviews**, not full private 100-page manuscripts. Free agents remain deterministic local personas; paid model access remains off.

## Verification
- `npm run typecheck`, `npm test`, `npm run build` and `npm run check:browser`.
- Browser smoke at a 375px mobile viewport checks category filter, text search, clear search, real course navigation, Academy and classroom CTAs.
- Public rollout verification: homepage hero plus `/academy`, `/classroom`, `/classroom-verify` routes must render; no Cloudflare "Unmatched Route" fallback.
- Real device and keyboard/TalkBack review remains a human acceptance item.

## Safety and rights
Original visual styling and graphics, no external copyright assets and no dependency/license migration. No user data is sent to model providers from the discovery page, no study progress stored remotely, no fabricated accreditations or outcomes. The app remains self-study rather than university-accredited.
