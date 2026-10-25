# OpenForge Africa — Cloudflare-only web deployment preparation

**Status:** review-only draft. This branch does **not** deploy anything, bind a domain, create D1/R2 resources, enable public access, or change a Cloudflare account. The original Android application remains in the repository.

## What this builds

An **Expo Router client-rendered SPA** based on the same local learning screens (circles, notes, tasks, Study Coach, Focus, Progress and seven-day pilot). Web data is stored in the browser via Zustand + AsyncStorage's web storage implementation; it is local to the browser and **not** synchronized with Android. No student sign-in, remote API, AI inference, tutor dashboard, institutional authorization, encrypted storage or automatic peer sync is implemented.

This is a *separate* Cloudflare static-assets Worker. `wrangler.jsonc` names it `openforge-africa-web-staging`, turns **workers_dev off**, defines no routes, domains or database bindings and serves `dist/index.html` for SPA navigation. Configuring a custom route or Cloudflare Access, merging PRs or publishing requires explicit owner authorization. Do not connect it to any existing Worker used by another app.

## Verify before approving any deployment

Use Node.js 22, preferably matching GitHub CI:

```bash
npm install --no-audit --no-fund
npm run typecheck
npm test
npx expo export --platform android --output-dir dist-android
npm run build
npm run check:web
npm run cf:dry-run
```

The `build` script runs `expo export --platform web --output-dir dist`. The `check:web` script verifies the output includes `index.html` and a JavaScript bundle. `cf:dry-run` checks Wrangler's config without uploading assets or creating a Worker.

For a developer-only local preview (no account connection), after building run:

```bash
npx wrangler dev --local --port 8787
```

Visit `http://localhost:8787`. Verify **desktop and mobile** widths, keyboard, navigation/back/reload, local persistence, offline return visits while browser cache remains, and storage disabled/quota handling. An Expo web export is **not** a full offline PWA: offline-first *data actions* rely on local browser storage; installability/service-worker cache and guaranteed offline first navigation are not yet provided.

## Important web-specific privacy differences

- Browser `window.alert` and `window.confirm` are used when React Native's native dialog is unavailable. Destructive operations still require explicit confirmation.
- Where supported, the Web Share API opens the user's browser-native Share sheet. Otherwise, there is **another confirmation** and an opt-in clipboard copy. Clipboard content may be readable by other applications or later users on shared devices.
- Do **not** use this website on shared or untrusted browser profiles for confidential course records. AsyncStorage/browser data is **unencrypted** and clears if browser site storage is deleted.
- Manual study packs contain unverified, plain-text source material and practice-quiz answers. They are not safe for exams.
- No data is automatically transmitted by the application; users must deliberately export/share.
- This site is not an official NOUN service and should not use restricted material or identifiable student data without permission.
- A public Worker endpoint is not a private pilot. A later **private** staging preview requires Cloudflare Access or equivalent authorization validated before publishing.

## Cloudflare dashboard settings — only after approval

For a *new, isolated* Workers Builds application, not an existing live Worker:

| Setting | Exact value |
|---|---|
| Repository | `mabrig1/openforge-africa` |
| Build root | repository root |
| Git branch | approved branch only; do not use `main` until dependencies are merged |
| Install | `npm install --no-audit --no-fund` (Node 22) |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Config path | `./wrangler.jsonc` |
| Asset directory | `./dist` |
| SPA fallback | `single-page-application` |
| Worker | `openforge-africa-web-staging` |
| Workers.dev URL | deliberately disabled in draft |
| D1, R2, API | **not configured / not needed** |

Do not add `openforge.mabrigkorie.org` as a route before owner approval, Cloudflare Access decision and browser testing. The repo does **not** auto-deploy through GitHub Actions; the Actions workflow only compiles and dry-runs.

## Acceptance checks for the web experience

1. Export completes and `dist/index.html` references compiled JS.
2. Wrangler dry-run completes without Cloudflare credentials, deployment or new services.
3. Home, Circles, Coach, Tasks, Focus, Progress and Pilot pages load on mobile and desktop.
4. Create notes, a quiz and a pilot check-in; reload to verify browser-local persistence.
5. Confirm destructive delete and workspace reset do not occur on Cancel.
6. Share preview must be voluntary; test native Share and clipboard fallback and disclose clipboard risk.
7. In browser DevTools verify no unexpected remote API calls or personally identifying payloads.
8. Test slow 3G, offline after load, storage denied, incognito/private session and stale-cache recovery; distinguish reduced network dependence from guaranteed PWA caching.
9. Confirm Android typecheck/bundle and existing automated tests still pass.
10. Schedule SDK 52-to-supported SDK migration separately; a passing web export is not native Play Store or institutional readiness.

## Rollback

Discard the draft branch / close its PR to return to previous code. No live Cloudflare Worker or domain is changed. If an isolated staging Worker is eventually deployed, record its Worker name and last-good version; explicitly revert just that staging deployment as needed.
