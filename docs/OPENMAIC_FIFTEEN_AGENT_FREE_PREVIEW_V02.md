# OpenForge Africa — Free 15-Agent Classroom (OpenMAIC-inspired prototype)

**Version:** v0.2, additive to draft 12-Agent Desk and ten-course Academy release-candidate stack. **Not production**. No public OpenMAIC deployment or world-record claim.

## What works now

- Distinct fifteen-role classroom roster: one teacher, one assistant and thirteen classmates. Each has stable OpenMAIC-compatible id, name, role, persona, priority, allowedActions, avatar and color. The public authoritative manifest is in lib/openMaicClassroom.ts.
- Deterministic Director: Teacher first for human questions; Assistant for clarifications; selected student discussion initiator followed by Teacher framing and rotating classmates. At most three speaker turns on Basic and five on Explorer.
- Teacher and Assistant retrieve only from the user's explicitly selected, local course notes through existing keyword matching. Without evidence, Teacher refuses to invent an answer. Misconceptions are clearly labelled. Thirteen students have distinct topic-dependent study prompts.
- Dispatch trace identifies round, agent, priority and rationale. Recent metadata-only dispatch ids feed rotating classmate choices.
- The /classroom screen is linked from /academy and /agents. No cloud inference, media generation, academic grading, credentials, payments or publishing.

## Free access model (local proof-of-concept only)

| Access | Runs per device-local day | Max speakers per run | Duration | Card |
| --- | ---: | ---: | --- | --- |
| Basic | 3 | 3 | Permanent | None |
| Explorer | 8 | 5 | One-time seven-day preview | None |
| After Explorer | 3 | 3 | Basic continues | None |

All fifteen roster roles remain inspectable in both plans: limits govern runs and speaking turns, not number of available roles. Explorer starts only after an explicit tap. Each successful run increments a day counter. Re-reading a transcript does not.

IMPORTANT: The counters are in browser/device local storage. Clearing storage, changing devices or reinstalling may reset them. This is NOT a secure subscription, billing, quota or anti-abuse system. Do not expose public billable LLM inference under this limiter.

For true hosted model-backed free access, first implement authenticated identity, server-side atomic quota storage, abuse prevention, explicit cloud consent, provider spending caps, privacy retention rules and actual inference monitoring. None of those capabilities is activated here.

## Functional scope vs agentic claims

The fifteen participants execute deterministic, domain-specific roles and a real finite Director scheduler. They are NOT fifteen independent LLMs, long-running autonomous agents or a deployment of OpenMAIC's Pi Director. OpenMAIC's code is not copied; its classroom roster concepts provide design inspiration. The accurate current count is fifteen registered / at most five speaking per run / zero generative-model classroom agents.

OpenMAIC source project (MIT): https://github.com/THU-MAIC/OpenMAIC.

## Trust and pedagogy boundaries

1. Unanswered learner questions always dispatch Teacher first.
2. Source gaps stay explicitly unverified; sessions are not automatically closed or scored.
3. Source retrieval examines at most three selected notes, each capped at 1,500 characters.
4. Intentionally false inference is explicitly marked as a misconception.
5. Local logs retain date, mode, roster ids and evidence-match status, never the learner question or note content.
6. Director and quota functions never call network services or AI models.

## Reproduce / verify

From this branch with Node 22:

    npm install --no-audit --no-fund
    npm run typecheck
    npm test
    npm run build
    npm run check:web
    npm run check:browser

Open /classroom in a real development preview. Test a question with no selected notes (Teacher first, no fabricated answer); activate Explorer and observe 8/day, 5-speaker allowance; switch to roundtable with Visual Learner and a topic without a question mark (initiator first, Teacher second); reload to verify usage persists. With relevant local notes, confirm the Teacher cites only selected matching passages.

This independently implemented offline prototype does not run upstream OpenMAIC's Pi eval. Public deployment, physical Android/TalkBack acceptance, course-rights review and model-backed inference remain unverified.

## Next gated work

- Review release-candidate rights, privacy, accessibility and physical Android behavior.
- Build authenticated, metered cloud inference if separately authorized, with hard external spending limits.
- Produce independently reproducible dispatch and retrieval benchmarks with source-specific logs.
- Deploy an actual OpenMAIC fork separately and test its Pi Director if desired.
- Publish an evidence page with exact source SHA, deployment hash, roster, non-sensitive traces and limitations only after independent verification.

Do NOT merge main or promote production until the stacked Academy and release gates are satisfied.
