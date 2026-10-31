# OpenForge Africa — AI Tutor, Text Reader & Visual Learning Studio

**Status: review-only development branch. No production deploy, paid inference or cloud configuration changes have been performed.**

## What is implemented

| Feature | Real capability | Hard boundary |
|---|---|---|
| Offline Study Coach | Source-labelled keyword retrieval from saved local notes | Not a generative language model; no web retrieval |
| Private AI Tutor | Opt-in Cloudflare Worker -> OpenRouter chat completions; question + at most 3 source excerpts; refusal/fallback when unconfigured | **Disabled until owner sets secrets, model, and enabled flag.** Requires owner access code in UI. Can incur provider charges. |
| Text Reader | Browser speechSynthesis or Android/iOS expo-speech with selectable speed and stop | Playback only, no saved MP3 or cloud voice cloning; device speech engines vary |
| Infographic | Deterministic, real rendered SVG diagram from title + supplied explanation, local SVG download on web | Not generated images; native shares textual outline, not an SVG attachment |
| Text-to-Video | Local Canvas+MediaRecorder export of animated slides to WebM on browsers supporting captureStream | Silent, no AI footage, no MP4/voiceover, no supported native file export |
| Interoperability | Tutor answer can move in memory to Reader or Explainer | No note contents automatically passed via URL, storage or cloud |

### Cloudflare configuration (owner only; DO NOT run until approval)

This branch changes the existing production-name `wrangler.jsonc` **code configuration** to add `main: "./worker/index.ts"` and `assets.binding: "ASSETS"`; `assets.run_worker_first: ["/api/*"]` routes only API requests to Worker code and preserves the SPA asset behavior. It also updates the matching staging and live Wrangler configs. **No Worker is deployed simply by committing.** The original Cloudflare production build failure must still be diagnosed separately.

In Cloudflare Workers Settings -> Variables and Secrets (not client-side Expo EXPO_PUBLIC variables), configure:

- `OPENROUTER_API_KEY` as an encrypted secret belonging to an OpenRouter key with a **very low vendor-enforced spending limit**. Never place it in a website JS file, GitHub secrets visible to collaborators or logs.
- `OPENROUTER_MODEL` as a model slug you have explicitly checked is supported and affordable for your account, e.g. an approved low-cost OpenRouter model.
- `OPENFORGE_TUTOR_ACCESS_TOKEN` as an encrypted **random 32+ character owner-only access token** unrelated to the OpenRouter key. Do not publish or save it in screenshots, notes or the app.
- `OPENFORGE_TUTOR_ENABLED` as `"true"` only after a staging review and spending limits are enforced. If absent or `"false"`, the cloud endpoint responds with a safe unavailable status and makes no upstream inference call.

**Caution:** A shared bearer code is an MVP owner-only gate, not full user authentication, tenant separation, a strong rate limit or protection against a leaked token. Public launch must add Cloudflare Access / authenticated identities and edge rate limits, per-user quotas, fraud controls, usage reporting, max-budget kill switch and independent security testing. A Cloudflare preview may be public. Do not advertise the tutor as public or secure for minors/confidential student notes before such controls and legal review are complete.

### Consent and data retention

The learner chooses 1–3 saved notes. The UI previews the **exact first 1,500 characters per selected note**, plus note title and question, and sends nothing until the separate consent checkbox and Ask cloud AI button are pressed. Neither the key nor the owner access code is stored by the app. The Worker does not deliberately persist questions or answers or log their text; third-party inference providers and platform network services have independent policies. This app cannot promise that provider-side retention is zero.

The question and excerpt content are transmitted to OpenRouter only after active consent and authentication. The Worker uses a bounded system prompt and labelled sources. AI output is **unverified**, is capped, and may hallucinate; citation labels alone are not evidence of correctness. Compare claims with original notes. The deterministic Offline Coach remains available without internet.

### Browser and native boundaries

- **Android/iOS app:** Android/iOS Text Reader uses Expo SDK 52 compatible `expo-speech~13.0.1`; installation requires a new native build. The private tutor can contact the configured `openforge.mabrigkorie.org` Worker over HTTPS after the deployment gate; until then it displays a failure and Offline Coach remains available. Infographic outlines can be shared as text. WebM export is *not* a native app capability.
- **Web Chrome/Edge:** `speechSynthesis` uses the browser/OS voices, local SVG export downloads an image, Canvas + MediaRecorder produces a video/webm file. Some mobile browsers don't implement captureStream, MediaRecorder or vp8: present an explicit error rather than producing a fake download.
- **Video:** Generated WebM is silent and has no automatic music, video clips or voiceover; browser user can use it in a video editor. It is a legitimate video rendering, not diffusion/video-model generation.
- **Infographics:** SVG text is escaped to prevent injection; source text is summarized deterministically and can truncate complex information. This is a graphic representation, not verified conceptual analysis.
- **Data:** Legacy local AsyncStorage is unencrypted; never use confidential information on shared devices. Text Reader's device/OS speech engine may have independent behavior outside OpenForge's control.

## Verification (read-only or local; no paid API calls)

Run on Node 22:
```bash
npm install --no-audit --no-fund
npm run typecheck
npm test
npm run benchmark:offline
npm run build
npm run check:web
npm run cf:dry-run
npm run cf:dry-run:live
npm run check:worker-local
npm run check:browser
```

The `tests/worker.test.ts` tests validation, disabled behavior, wrong credentials and a **mocked** OpenRouter response; no provider request is sent. The browser runtime test checks unconfigured GET/POST behavior and SVG/video downloads where the browser supports local WebM capture.

Before a public release, manually test an authorized Cloudflare staging deployment with the owner key and a tightly restricted provider billing account, confirm live provider returns a valid response with source labels, inspect expenditure and logs, test timeout and compromised token mitigation, then delete test traffic. Also test Android speech and mobile web video on physical devices. These scenarios are **not** independently verified by the unit tests.

## Further upgrade proposals

Next: optional human-reviewed AI-generated infographic storyboarding, diagram variants (flowchart/timeline/cause-effect), teacher feedback, safe TTS narration-in-video with synchronized subtitles, export MP4 via a server-side consented renderer or compatible native encoder, multilingual translations, and real collaborative learning. These are **not currently implemented**.
