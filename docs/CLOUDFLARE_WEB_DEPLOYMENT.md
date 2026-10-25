# OpenForge Africa — Cloudflare-only web deployment preparation

**Status:** review-only draft. This branch does **not** deploy anything, bind a domain, create D1/R2 resources, enable public access, or change a Cloudflare account. The original Android application remains in the repository.

## Latest CI / Cloudflare Builds alignment (October 25, 2026)

The default `wrangler.jsonc` now uses **`name: "openforge-africa"`**, matching the Cloudflare-connected Worker. This was changed after repeated Cloudflare bot Build: Failed reports on the draft branch; the exact failure is **still unconfirmed** because Cloudflare's authenticated log was unavailable.

- `wrangler.jsonc` is the connected **production-name** configuration. Running `wrangler deploy` without `--dry-run` against it may change the current production Worker. **Do not do so until expressly approving promotion and recording rollback information.**
- `wrangler.staging.jsonc` retains the separate, isolated `openforge-africa-web-staging` identity; use `npm run cf:dry-run` for safe staged compilation.
- `wrangler.live.jsonc` is an explicit same-name alias of the default configuration; `npm run cf:dry-run:live` checks the default production-name configuration without deployment.
- The app is not served by `openforge.mabrigkorie.org` merely because a draft PR passes GitHub CI.
- GitHub's browser test uses local Wrangler + headless Chromium to detect blank runtime pages and confirm fake-circle browser storage. It creates no cloud data.

**Required Cloudflare Workers Builds settings:** connected Worker = `openforge-africa`; source repo = `mabrig1/openforge-africa`; branch must have this web implementation, Node 22; **Build command = `npm run build`**; Preview command = `npx wrangler preview` only if previews are enabled and the account has the appropriate safe preview setup; Deploy command = `npx wrangler deploy` only when approving production. Cloudflare Workers Builds **does not currently honor Wrangler custom build scripts**, so GitHub CI success does not establish what build command is configured in the Cloudflare dashboard. Check the build logs first.

## 25 October 2026 — Verified live Hello world and deployment mismatch

A read-only fetch of `https://openforge.mabrigkorie.org/` confirmed that the public hostname currently returns **plain text `Hello world`**. This is a placeholder response, not an Expo front end or an empty React component. Changing a GitHub branch, passing the web bundle, or running `wrangler deploy --dry-run` cannot change the live response.

GitHub PR #4's Cloudflare bot independently reports **Cloudflare Build: Failed** on commits including `eaa1255` and `dfbfe79` for the dashboard Worker service `openforge-africa`. The actual Cloudflare build logs are behind account authentication and have **not** been inspected, so their exact error is unconfirmed.

One concrete, high-risk mismatch exists: the **already-connected Cloudflare Worker** is named `openforge-africa`, while this branch's default `wrangler.jsonc` is intentionally named `openforge-africa-web-staging`. Cloudflare's own Workers Builds documentation states that a mismatched Worker name can cause a deployment build to fail. This is a credible explanation, **not** a confirmed log diagnosis.

### Two isolated configurations now provided

- `wrangler.jsonc`: **isolated staging** candidate named `openforge-africa-web-staging` with `workers_dev: false`. Never point the existing Worker `openforge-africa` at this config.
- `wrangler.live.jsonc`: **future production candidate** named `openforge-africa`, the exact connected service name, with SPA static assets from `dist`. This file does **not** deploy or bind any routes by itself.

Both configs have **no** D1, R2, runtime code, API secrets or external resource provisioning. Both retain `workers_dev: false`. GitHub Actions runs **both dry-runs** and a local Worker routing smoke test. It does not publish either configuration.

### Safest completion sequence

1. Preserve or export the current `openforge-africa` Worker version and bindings from Cloudflare before replacement; list all attached domains/routes. **Do not delete the existing Worker.**
2. In Cloudflare **Workers & Pages → openforge-africa → Deployments → View Build History**, read the latest failed build logs to confirm the error (configuration name, npm build script, permissions, wrong branch or deploy command).
3. In **Settings → Builds**, ensure the GitHub repository is `mabrig1/openforge-africa`, root is repository root, install uses Node 22, and build command is `npm run build`. The connected branch must contain the web code (PR #4 is **stacked and unmerged**, so `main` does not contain it).
4. **Do not apply step 5 automatically.** Review the current Worker and any Cloudflare Access requirements. Approve an isolated staging verification before exposing the app to real visitors.
5. For an **approved production promotion only**, the deploy command is `npx wrangler deploy --config wrangler.live.jsonc` (not the default `wrangler.jsonc`). This targets the existing service name `openforge-africa`; wrong target selection can replace the live Worker.
6. Confirm the intended `openforge.mabrigkorie.org` route is mapped to `openforge-africa` and that no competing Worker/DNS route intercepts requests. This must be confirmed in the Cloudflare dashboard, not guessed from repo code.
7. After the approved switch, use `npm run check:live`: it performs a **read-only** HTTP check and fails if the URL still returns `Hello world` or an invalid HTML shell. Then do real-browser smoke tests to rule out JavaScript runtime errors.
8. If health checks fail, roll back **only** the targeted Worker to its previously captured last-good version. Do not touch other services.

**Important:** A static Expo SPA responds with HTML + JavaScript. It is not deployed merely by creating a domain or checking GitHub CI; the Cloudflare Worker must actually receive the built assets, and the correct service must be bound to the domain.

## What this builds

An **Expo Router client-rendered SPA** based on the same local learning screens (circles, notes, tasks, Study Coach, Focus, Progress and seven-day pilot). Web data is stored in the browser via Zustand + AsyncStorage's web storage implementation; it is local to the browser and **not** synchronized with Android. No student sign-in, remote API, AI inference, tutor dashboard, institutional authorization, encrypted storage or automatic peer sync is implemented.

This is a Cloudflare static-assets Worker with **two explicit configurations**: `wrangler.jsonc` targets the already-connected `openforge-africa` service by name; `wrangler.staging.jsonc` defines an isolated staging candidate. Both turn **workers_dev off**, define no routes, domains or database bindings, and serve `dist/index.html` for SPA navigation. Configuring a custom route or Cloudflare Access, merging PRs or publishing requires explicit owner authorization. Do not connect it to any existing Worker used by another app.

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
| Config path | `./wrangler.jsonc` targets existing service; staging uses `./wrangler.staging.jsonc` explicitly |
| Asset directory | `./dist` |
| SPA fallback | `single-page-application` |
| Worker | `openforge-africa` for existing connected Worker; `openforge-africa-web-staging` only when expressly using staging config |
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
