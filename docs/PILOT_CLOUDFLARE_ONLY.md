# OpenForge Africa — pilot-first upgrade (draft, not released)

## What this branch actually adds
A wholly optional **seven-day, one-check-in-per-day** study-routine journal inside the existing Expo application. A learner selects one of their existing local circles, opts in, and records study mode (solo / with a peer in person / via message or call), one barrier (or none), and usefulness on a 1–5 scale. Entries are saved only in the existing device-local, **unencrypted** Zustand + AsyncStorage store. Deleting a circle deletes its pilot; full reset deletes all pilot data. This is **not** a verified attendance or multi-user collaboration solution.

**No service is deployed**, and there is no network request, API key, analytics SDK, sign-in system, Cloudflare database, Vercel or MongoDB dependency in this feature. The UI offers an aggregate-only opt-in preview, repeated warning and native Share choice. Sharing may transmit data through the user's chosen app and cannot be recalled. Small counts can reidentify a participant.

## Infrastructure choice for a future institution-backed phase

Select **mabrigkorie.org + Cloudflare**, and preserve Expo/React Native mobile app plus offline-first local persistence.

| Layer | Proposed later | Currently used |
|---|---|---|
| Domain | `openforge.mabrigkorie.org` behind Cloudflare | No production hostname verified |
| PWA/site | Cloudflare Workers Static Assets (or Pages) | Not implemented |
| API | Cloudflare Workers, separate staging and production | Not implemented |
| Database | Cloudflare D1 per-tenant scopes and consent ledger | Not implemented |
| Course files | R2 with private signed, permissioned access | Not implemented |
| Offline Android app | Existing Expo client, with device-local state and safe queue in a *later* upgrade | Expo SDK 52 + AsyncStorage; no queue |
| Security | Formal authentication and per-circle authorization, signed/idempotent mutations, encryption in transit and at rest, privacy and deletion procedures | Not implemented |
| Institutional LMS | Optional adapter after written partner approval | Not implemented |

Do not register a custom domain, allocate D1/R2, publish a Workers deployment, or copy learner data until the owner authorizes it. Do not claim that an on-device React Native app is hosted by Cloudflare: Cloudflare will host **future** web/API infrastructure, while the Android app must be built and installed separately. No Vercel, MongoDB Atlas or paid Cloudflare resource is required for this pilot.

## Minimal on-device testing matrix (must be executed before merge)

1. **Install/first-run:** Build a compatible Android development build; verify SDK 52 compatibility and an actual native install on Android 8+ low-RAM device. CI Metro export is not a native APK.
2. **Airplane mode:** Create circle, start pilot, record an entry, restart app, verify the entry and that there was no network request.
3. **Day boundaries:** Today's check-in duplicate is blocked; day 7 accepted; day 8 blocked. Device clock changes are a limitation; they do not prove attendance.
4. **Delete/reset:** Deleting the parent circle removes the journal and work; confirm reset removes all. Neither can erase copies the recipient previously shared.
5. **Preview/cancel:** Never invoke the Share sheet automatically. Preview includes no learner identity, circle title, device identifier, timestamp or raw response; recipients may nevertheless infer information from small counts.
6. **TalkBack/font scaling:** Screen-reader labels, touch targets, scrolling, reduced available storage, OS app kill/restart and shared-device use.
7. **Consent:** Keep work with fictional information pending local privacy and ethics approvals; avoid children, confidential learner records, restricted course materials, and formal research claims.

## Single study-centre validation protocol

- Invite an authorized tutor and **3–8 consenting adults** into a short usability study; do not represent this as an official NOUN partnership without written permission.
- Measure weekly use of study routine, self-reported peer contact, completion of **practice** tasks, usability, perceived usefulness, tutor time and support incidents.
- Record the **existing** learning method (e.g. WhatsApp, LMS, solo notes) as an explicit comparison; do not infer comparative learning benefit from the app's self-reports alone.
- Obtain independent collection consent if a researcher wants identifiable data. Do not forward or automatically upload local device data.
- A seven-day study can validate basic usability and operational friction; dropout/retention improvement requires longer-term data and an appropriate comparison.
- Produce an evidence table with dates, method, sample, results, limitations and permission status. Do not use made-up effect sizes or testimonial quotes.

## Follow-on acceptance gates

- Migrate from deprecated Expo SDK 52 **incrementally** to a supported version and perform native Android installation regression tests.
- Add secure, opt-in identities, membership permissions, encryption and conflict-safe events **before** claiming multi-device sync.
- Only after partner agreement, set up an isolated Cloudflare staging Worker and D1 schema with strictly fictional content and role-bound API tests.
- Benchmark Study Coach lexical retrieval versus human-assessed course answers; do not call it generative RAG.
- Conduct a privacy impact assessment and Nigerian Data Protection Act review as applicable.
