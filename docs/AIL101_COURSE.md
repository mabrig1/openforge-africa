# AIL 101 — AI Literacy and Human–AI Collaboration (DRAFT)

**Source:** Mabrig Korie, *AI Literacy and Human–AI Collaboration*, First Teaching Edition (2026), 100-page authored course book. The complete source manuscript remains privately held by the owner, not committed to the public repo.

## Course scope

- Adds AIL 101 as OpenForge's fifth independent self-study course: 20 concise original source-aligned unit reviews and seven applied-studio titles, not the full 100-page manuscript.
- Three learning cues, a real-world application prompt, and a three-choice formative question with explanation and retry accompany every unit.
- On-device reading and passed-check progress, forward/back navigation, Text Reader speech, infographic/storyboard transfer and a separate course-only reset.
- Academy now aggregates 79 distinct native reading-plus-practice milestones: 23 Logic + 6 Psychology + 20 Decision Science + 10 Forge Studies + 20 AIL 101.
- On-device weekly session tracking includes AIL 101. Existing four course records and their stored progress are left intact.

## Rights, safety and accuracy

- Private Word/PDF originals, answer keys and the complete source text are not published here. Review exercises are newly authored teaching aids.
- No AI provider calls, paid inference, autonomous external publication, university grades, certificates, clinical claims or institutional accreditation.
- Progress is device-local AsyncStorage, NOT encrypted; students should not input sensitive personal or medical information.
- Source text transferred to the reader/explainer is only the short adapted in-app lesson review. Full author/source redistribution is subject to explicit owner approval.
- Seven studios are listed for orientation; their complete procedures, capstone and exams are only in the private book. Do not mislabel the native reviews as the full book.

## Verification (Node 22)

Run in the stacked branch, before any merge or deployment:

    npm ci
    npm run typecheck
    npm test
    npm run build
    npm run check:web
    npm run cf:dry-run

Check dist/index.html after build. Existing script checks may expect an existing build.

## Minimal mobile and browser validation

1. Confirm five Academy courses / 79 independent review milestones with AIL 101 initially 0/20; retain earlier learners' stored records.
2. At 375px width test Units 1–20, reading status, wrong answer, corrected retry, quiz and passage persistence after reload; verify progress requires both reading and correct formative check.
3. Verify speech start/stop, local Reader and Explainer transfers, and that no private manuscript or external model requests appear.
4. Follow AIL 101 in weekly plan, record one device-local session and reload; attempt duplicate and invalid input.
5. Reset AIL 101 alone; verify Logic, Psychology, Decision and Forge progress survives unchanged.
6. Test physical Android and TalkBack screen reader/checked radio states; review offline restart, privacy and source attribution.

## Review and release gates

- [ ] Node 22 typecheck, tests, Expo web/Android export and Cloudflare dry-run pass at this PR head.
- [ ] Real browser/Android offline and accessibility smoke tests; checked-state and keyboard review.
- [ ] Owner subject-matter/rights review and documentation of source limitations.
- [ ] Reconcile with stacked and parallel open course PRs before any integration.
- [ ] Manual privacy and safety sign-off.

**Draft PR only. Do not merge, deploy, publish the complete private textbook, issue credentials or run paid inference without explicit approval.**
