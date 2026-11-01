# 15-Agent Classroom — Ten-Course Connectivity and Verification (v0.3)

## Delivered on the draft integration branch

The classroom now connects to the existing **ten separate OpenForge Academy course tracks** (158 original, short, public review units). Course progress is read-only and not modified by classroom use. Each Academy course offers a direct launch button; the classroom reads the matching course's next review and progress, allows explicit unit selection, displays the original public short review and source attribution, and accepts an opt-in checkbox before including its text in local tutoring. A learner can also select personal study-circle notes, up to three total sources. Complete private textbook manuscripts are not read or published.

The **15 registered educational classroom roles** retain the deterministic teacher-first Director and local trial quotas. They produce real offline, role-specific educational turns and local source retrieval; no model-based generation happens in Free Basic or Explorer.

The new /classroom-verify route displays all 15 registered roles, all ten connected courses and 158 source-aligned public review units, synthetic Director metrics (unanswered questions → Teacher, no premature closure, local turn execution), and non-sensitive local dispatch history. These metrics are explicitly identified as **author-created deterministic synthetic tests**. They are not live-world LLM benchmarks, user assessment, independent validation, a live OpenMAIC deployment, academic credit, or a world-record claim.

The Classroom screen also exposes a **collapsed owner-only model test section**. For each of the 15 roles, an authorized owner may choose one role, see the exact excerpts, enter a transient owner access token, and separately consent to a single model request using the existing /api/classroom-ai endpoint. All inputs and permissions are inspected on screen. The token is cleared after the request and never persisted. The Worker endpoint stays disabled without server flags, a valid owner token, and a provider model/key. The interface never executes billable calls automatically and does not expose raw provider keys.

**Cost safety:** The 7-day Explorer and ongoing Basic student limits are device-local only, and MUST NOT be used to gate paid public model calls. Cross-device secure AI access needs verified identity, server-side atomic quotas and global spending caps. No production model access has been enabled; no real provider calls have been initiated.

## Developer checks

    npm install --no-audit --no-fund
    npm run typecheck
    npm test
    npm run check:classroom-roster
    npm run check:classroom-verification
    npm run build
    npm run check:web
    npm run check:browser

### Browser acceptance

Open /academy and launch any course-specific classroom. Check the selected route/course and actual public review, opt in to a source and ask a matching question; the Teacher should quote that source. Deselect consent; unsupported questions must explicitly refuse to invent facts. Open /classroom-verify and inspect the synthetic report. Confirm owner AI is collapsed by default, no network call occurs in Free Basic/Explorer, and no provider key is requested in the browser.

### Stacking and release boundary

The PR builds on the prior fifteen-agent PR #23, the twelve-agent PR #22, and the draft ten-course Academy RC1. Production merge, public deployment, claim of live agentic AI, private-course content publication, paid inference, and external service configuration changes remain **out of scope** pending human accessibility, educational quality, source-rights, privacy and integration review.

Upstream OpenMAIC: https://github.com/THU-MAIC/OpenMAIC — this is an independent compatible concept, not the upstream OpenMAIC runtime.
