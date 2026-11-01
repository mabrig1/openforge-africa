# Authenticated Classroom AI Trial — Candidate Deployment and Safety Gates (v0.4)

## Current state
This draft adds an **optional, disabled-by-default, authenticated public model preview**. It does not change the 15-role offline classroom (3 Basic / 8 Explorer on-device runs/day) or activate model spending. No public credential, Cloudflare Access policy, Durable Object namespace, provider secret or production Worker setting is installed by this PR.

## What the candidate provides

- **Verified identity:** Cloudflare Access must authenticate the actual incoming Worker request. The Worker invokes `ctx.access.getIdentity()` and rejects missing, malformed or spoofed identity. Never trust user-supplied email/JWT headers. The Access application MUST cover the `/api/classroom-public/*` paths and issue a stable `id`.
- **Pseudonymisation:** Derive a stable keyed HMAC-SHA-256 account identifier from Access's verified opaque identity id using server-only `OPENFORGE_IDENTITY_SALT` (at least 32 characters), not from client input.
- **Atomic admissions:** One new SQLite-backed Cloudflare Durable Object, shared across all users, stores only hashed identities and per-UTC-day usage/trial start plus aggregate UTC day/month provider-attempt counters. All admission reads and writes occur synchronously within the same DO; each model admission is reserved BEFORE the provider fetch. Failed upstream calls count toward budgets.
- **Trial:** Server Basic = 1 *model attempt* per UTC day. One-time 7-day Explorer = 2 *model attempts* per UTC day. Existing offline 3/day and 8/day learning runs are independent. Global max attempts/day and month must be explicitly configured. Example limits such as 10/day and 100/month are examples only, not deployed settings or monetary budgets.
- **Explicit source consent:** The new `/classroom-live` route displays public short-course excerpts and requires the learner's opt-in checkbox per one-agent request; up to 1 displayed public review excerpt per web request. It shows the signed-in account's server quota. No private uploaded full-text manuscripts.
- **Evidence:** A mock provider test proves the API requests exactly one selected role when authentication and admission succeed, with model output limited to 280 tokens. Automated tests do not consume provider credits.

## Owner setup checklist — review only; nothing here is executed

1. Confirm the base feature PRs and ten-course Academy are accepted by a human, including privacy, rights and mobile accessibility.
2. Create a Cloudflare Access **Self-hosted application** protecting ONLY the new `/api/classroom-public/*` endpoint group on the intended deployment hostname, with an explicit signed-in identity policy. Verify Access actually sets `ctx.access` on the Worker; a normal header claiming an email must never work.
3. Review `wrangler.classroom-preview.jsonc`, which is deliberately **separate from the currently deployed `wrangler.jsonc`**. It proposes the SQLite-backed `ClassroomTrialLedger` migration and `CLASSROOM_TRIAL_LEDGER` binding. Do not copy the candidate configuration into production until deployment review is complete.
4. Add server-only provider credentials, `OPENFORGE_IDENTITY_SALT`, `OPENFORGE_PUBLIC_AI_DAILY_CAP`, `OPENFORGE_PUBLIC_AI_MONTHLY_CAP`, and the Durable Object binding to the approved environment; configure a **provider-level monetary ceiling/alerts** as the real dollar safety backstop. Avoid `.env` commits, browser keys, model secrets in static assets or trusting device quotas.
5. Confirm no unauthenticated requests can reach the inference route; re-run the same-origin, stable-user, rate-limit, concurrency, expired-trial, global-cap and failed-provider tests in a nonproduction environment.
6. Only after those checks, deliberately set `OPENFORGE_PUBLIC_AI_ENABLED=true` in the approved deployment configuration. Default false/missing must always refuse without model calls.

## Verification and reproducibility

    npm install --no-audit --no-fund
    npm run typecheck
    npm test
    npm run check:classroom-verification
    npm run build
    npx wrangler deploy --config wrangler.classroom-preview.jsonc --dry-run
    npm run check:browser

Tests include real in-memory SQLite behavior via Node 22's experimental `node:sqlite` API, separate public API tests using a signed-in identity stub and mocked OpenRouter responses, and security-negative cases. Production Cloudflare Access behavior and account-level charging are **not** evidenced by mock CI.

## Critical limitations

- The model-budget constraints are **counts of provider attempts**, not hard USD spending guarantees; provider-side account/spending caps and billing alerting must be separately configured.
- One Durable Object global admission point trades scalability for auditability and serial quota enforcement; review traffic/latency before wider use.
- Cloudflare Access identity applies to the protected Worker invocation; if `ctx.access` is missing (for example, where a service binding invocation does not propagate it), the API fails closed.
- Trial identity is account-bound, not a proof of a unique human: creating multiple valid identities may bypass per-account limits while still hitting the global attempt cap.
- The ledger retains pseudonymous quota records without a defined automatic expiration or data deletion workflow; a public privacy/retention policy and appropriate purge procedure must be approved before production.
- The application is not accredited, the fifteen classroom roles are not an independently verified world record, and no live production OpenMAIC instance is provided by this work.

Cloudflare official documentation:
- Access `ctx.access`: https://developers.cloudflare.com/workers/configuration/cloudflare-access/
- New DO SQLite migrations: https://developers.cloudflare.com/changelog/post/2026-07-09-restrict-new-kv-backed-namespaces/
- Wrangler class config: https://developers.cloudflare.com/workers/wrangler/configuration/
