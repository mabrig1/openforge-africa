# OpenForge Africa — Ten-Course Release Candidate RC1

**Status:** Review-only **draft**, not a public release. This branch is a consolidation of all source-aligned course and offline-learning changes on `feat/multi-channel-speaker-cloudflare-build-v18`, plus explicit release-safety checks. Base: `main`.

**Snapshot inspected:** 1 November 2026. GitHub comparison `main...feat/multi-channel-speaker-cloudflare-build-v18` showed **240 commits ahead and zero behind**. The stack includes infrastructure, offline study/circles, guarded AI, native course companions, and a Cloudflare build preflight. The PR is much larger than a routine patch: human integration review is essential.

## Why the release is not live yet

Read-only public-site checks on 1 November 2026 returned the existing **OpenForge Africa / Circles** experience at `https://openforge.mabrigkorie.org/`, but `/academy` and `/multi-channel-speaker` each rendered **Unmatched Route / Not Found**. This establishes that the ten-course branch is not accessible on the production hostname.

The GitHub `verify` check and Cloudflare **Workers Builds: openforge-africa** check passed on the latest preceding feature-branch SHA `967bd2d`, on 1 November. The Cloudflare bot's pull-request comment says **No Preview URL** for that successful preview build. Thus a passing hosted preview *build* is **not evidence of a navigable preview URL or of production rollout**. Cloudflare Preview URLs can be enabled separately by the account owner. Do not invent a URL or treat a Cloudflare dashboard build-history link as a public address.

Another PR20 bot reported Vercel free-tier daily deployment-limit failures. This does **not** mean Cloudflare failed, and Vercel is not the chosen hosting target. Don't upgrade/pay to solve an irrelevant deployment path.

## Consolidated course inventory (short in-app companions, not full manuscripts)

| # | Course | Native independent learning checks |
|---:|---|---:|
| 1 | Logic and Critical Thinking | 23 |
| 2 | Psychology in the Age of AI | 6 |
| 3 | Human Intelligence, Logic and AI Decision Science | 20 |
| 4 | Introduction to Forge Studies | 10 |
| 5 | AI Literacy and Human–AI Collaboration | 20 |
| 6 | Foundations of Relationalics | 12 |
| 7 | Advanced Computational Ethnobotany & AI Health | 7 |
| 8 | The Integrated Soul | 12 |
| 9 | Clear Sight: Mastering Discernment | 24 |
| 10 | The Multi-Channel Speaker | 24 |
| | **TOTAL** | **158** |

**Meaning of a milestone:** a source-aligned review marked read and a formative check passed **in local unencrypted device/browser storage**. It is not a university grade, a clinical claim, formal accreditation, professional certification, independently observed communication competence or audited learner growth. Full owner-supplied source books are **excluded** from this public code.

## Evidence-based release matrix

| Gate | Verified from repository / checks | Still required before production |
|---|---|---|
| Branch ancestry | 240 commits ahead / 0 behind main, single cumulative stack | Resolve overlapping draft PR history; one human-approved consolidation review |
| Source rights | Only adapted short review text in visible code; no complete textbooks in tracked diff | Owner approves public licensing of adapted excerpts and third-party references |
| Automated tests | Existing feature SHA `967bd2d` GitHub CI green | Current RC1 exact SHA CI green after its new release gates |
| Web + Android | Feature SHA Expo exports, Wrangler local simulation, mobile Chromium smoke passed | Physical Android/TalkBack, keyboard, captions/TTS, media playback & low-data review |
| Cloudflare | Prior missing `dist` safeguard has passed hosted Workers Builds preview compilation | Enable/read preview URL if intended, verify app pages externally; preserve rollback/version |
| Production | Root serves OpenForge Circles; **Academy and Speaker routes not found** | Owner-controlled promotion and independent production acceptance |
| Cloud AI / credentials | Owner-gated Worker source enforces opt-in flags and token; no paid model inference was started | Inspect actual Cloudflare bindings/secrets and access policies before release |
| Sensitive material | New tracked-file gate checks docx/pdf/key/.env private-file naming | Manual privacy/licensing inspection; never enter confidential journals or recordings |
| User impact | Course stores use new names for isolation, no forced migration | Android/browser upgrade and local record-retention test on existing user profiles |

## Newly added reversible safeguards

1. `scripts/check-release-boundaries.mjs` rejects tracked manuscript-like binary documents, private input directories and live `.env`/private keys in the public repo. It does **not** replace a real secret scanner or content and licensing review.
2. `scripts/verify-live-academy.mjs` is a **read-only mobile-width Playwright acceptance test**. It checks homepage, Academy and all ten course paths after a valid deployment; it detects the Expo `Unmatched Route` fallback. It does **not** post, log in, upload, call APIs or change cloud infrastructure.
3. Both scripts run syntax/privacy checks in GitHub CI; the live acceptance run is **manual and post-promotion only**, not executed against the current production site in pull-request CI because that production release is not yet present.

## Local verification / release sequence

```sh
npm install --no-audit --no-fund
npm run typecheck
npm test
node scripts/check-release-boundaries.mjs
WORKERS_CI=1 node scripts/prepare-cloudflare-build.mjs
npm run check:web
npm run cf:dry-run:live
npm run check:browser

# After authorized rollout, and after installing Playwright Chromium:
npx playwright install chromium
npm run check:release:live
```

**Pre-promotion steps:** Check full stacked release diff; obtain owner content-rights review; observe current RC1 GitHub/Cloudflare checks; enable a real preview URL if desired; perform mobile/keyboard privacy, accessibility and media tests; record current live Cloudflare Worker version, domains, routes and bindings for rollback. Do **not** casually merge `main`: Cloudflare may auto-deploy every main-branch push, and this release changes the app across 240 commits. Keep all paid AI flags disabled unless separately authorized.

**Promote only after the gates above are satisfied.** If an approved rollout fails the twelve-path acceptance test, immediately restore the recorded previous production Worker version; do not create or expose course manuscripts, student data or external paid inference.
