# The Multi-Channel Speaker — source-aligned online course and release boundaries

**Private owner source:** `Multi_Channel_Speaker_RESTORED_2026.docx`, by Mabrig Korie, a 100-page expanded learner's course book and applied workbook.

The source is an **eight-week hybrid professional programme** with 24 guided contact hours: eight 2-hour live workshops (16 hours), plus eight one-hour asynchronous labs (8 hours). Four consecutive layers are retained, each spanning two weeks: Clarity & Connection, Strategic Narrative, Executive Presence, and Digital & Virtual Fluency.

## Faithful source alignment

| Week | Source pp. | Focus | Independent native reviews |
| --- | --- | --- | ---: |
| 1 | 10–19 | Mindful Listening & Audience Calibration | 3 |
| 2 | 20–29 | Structural Precision & Constructive Feedback | 3 |
| 3 | 30–39 | Core Story Architectures / SCR | 3 |
| 4 | 40–49 | Data Storytelling & Ethical Persuasion | 3 |
| 5 | 50–59 | Somatic Command & Impromptu Speaking | 3 |
| 6 | 60–69 | Slides, Presence & Hostile Q&A | 3 |
| 7 | 70–79 | Virtual Studio & Asynchronous Communication | 3 |
| 8 | 80–89 | Hybrid Facilitation & Capstone Showcase | 3 |

The source's 90–100 appendices and capstone instruments are shown as a brief native overview. Full printable templates, original rehearsal scripts and facilitator materials remain in the private book. Twenty-four concise original source-aligned app reviews do not reproduce the full original manuscript or complete its supervised workshops.

## Interactive learning capabilities

- Read-aloud, stop speech, browse eight weeks/24 reviews, and next/previous controls.
- Twenty-four three-choice low-stakes formative checks with explanation, retry and validated IDs.
- Individual on-device AsyncStorage progress with a separate reset and no student credential.
- Review text may be passed to the existing local Text Reader and offline Infographic/Storyboard studio; these transfers do not transmit the original complete manuscript.
- Fictional Project Beacon dataset (240 enrolled, 96 returned, 40% descriptive follow-up rate, N450,000 estimated pilot budget); causal improvements are **not** established.
- The source's capstone requires **one coherent initiative in three formats:** a one-page executive briefing, a three-minute asynchronous video and a five-minute live presentation followed by Q&A, plus consent and accessibility review. No automatic grading or video upload.
- The unified Academy now has ten courses and **158 local study-review milestones** (prior nine courses 134 + 24 Speaker checks). Other course progress stores are unchanged.

## Rights and privacy

- Do not publish the complete 100-page DOCX in a public GitHub repository without the owner's explicit distribution decision.
- Unencrypted local/browser progress is not a safe repository for real audience recordings, names, confidential drafts or private client data.
- Obtain consent to record, reuse or share images, testimony or feedback; disclose generated materials according to applicable policy.
- No paid AI inference, cloud storage of student recordings, external posting, credentials or accreditation is introduced.

## Verification

Run from Node 22:

    npm install --no-audit --no-fund
    npm run typecheck
    npm test
    WORKERS_CI=1 node scripts/prepare-cloudflare-build.mjs
    npm run check:web
    npm run cf:dry-run:live
    npm run check:browser

Check Android export, physical Android camera/audio, screen reader/keyboard, low-bandwidth performance, and review of actual portfolio media before merging or releasing. Studio text-to-speech and offline storyboard generation are not the same as authenticated recording, assessment or distribution of a professionally produced video.

## Cloudflare Workers Builds: missing `dist` guard

Prior observed build evidence indicates the `npx wrangler preview` step could run without a generated `dist/` asset directory. This draft includes a **reversible code-only protection**:

- Cloudflare Workers Builds sets `WORKERS_CI=1` (officially documented). In `package.json`, the `postinstall` lifecycle calls `scripts/prepare-cloudflare-build.mjs`.
- When `WORKERS_CI=1`, the script runs `npm run build` and `scripts/check-web-output.mjs` before Cloudflare's preview/deploy command. It verifies `dist/index.html` and exits nonzero if the web export is absent.
- For ordinary local and GitHub Actions installs, `WORKERS_CI` is absent; the postinstall **does not** build or deploy.
- CI also invokes the guarded preflight with `WORKERS_CI=1` to confirm it generates the Expo web assets. This step is a local simulation, not proof of a successful hosted Cloudflare preview.
- A `.nvmrc` specifies Node 22; if the Cloudflare build image does not respect it, configure `NODE_VERSION=22` as a Workers Builds variable.

### Recommended Cloudflare dashboard settings (owner account access required)

Cloudflare Workers & Pages → `openforge-africa` → Settings → Build:

- Git repo: `mabrig1/openforge-africa`; root directory `/`; Node version 22.
- **Build command:** `npm run cf:build` (recommended, builds and checks `dist` once in the official build phase).
- **Preview command:** `npx wrangler preview` for previews on non-production branches.
- **Production deploy command:** `npx wrangler deploy`, but do **not** promote until manually authorized after staging review and a rollback snapshot.

Cloudflare Workers Builds currently does not honor Wrangler's custom build hooks. The new `postinstall` is a fallback for an empty dashboard build command, **not** a replacement for correct build settings. A latest Cloudflare build failure could have another cause (authorization, branch setup, Wrangler preview permissions) that requires the real authenticated build log to diagnose.

**No production merge/deploy, domain rerouting, credential changes, paid API inference, or full manuscript publication from this draft.**
