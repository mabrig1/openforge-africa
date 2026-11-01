# OpenForge Africa — 12-Agent Learning Studio v0.1

**Branch:** feat/agentic-university-twelve-agents-v01 (based on release/academy-ten-courses-rc1).
**Release status:** review-only feature. No merge to main, production deployment, credential claim or paid inference.

## Implemented

The Academy and Study Coach link to a new /agents route. The screen shows ten live Academy course progress summaries and their next review milestone, supports explicit selection of up to three existing saved study-circle notes, a short study question, and an on-demand specialist result.

**Twelve specialist roles:** AI Professor, AI Tutor, Curriculum Designer, Assessment Agent, Research Assistant, Academic Adviser, Multimedia Lecturer, Student Success Agent, AI Library Agent, Career Mentor, Accessibility Agent and University Coordinator.

**Orchestration:** University Coordinator delegates to Adviser, Professor and Assessment using three inspectable, read-only local function calls. Other agents are independently callable. Outputs describe their limitations and distinguish an evidence match from a source gap.

**Existing integrations:** Student Success reads this-device weekly study sessions; Tutor and Library use the existing source-grounded local note retrieval; Multimedia Lecturer prepares a draft that a learner may manually open in existing Explainer Studio; Accessibility prepares a manually opened Reader draft. None of these actions automatically marks readings, issues grades, plays audio, exports, publishes, enrolls or modifies records.

## Limitations and safety

These are deterministic, rule-based role workflows, not 12 independent LLMs or genuinely self-directed long-running agents. This is the first execution scaffold for future approved agentic extensions. It performs no web research or live literature search. Templates are not lectures derived from full private course books and should not be represented as complete teaching or validated assessments.

The workflow engine has no fetch, key, model endpoint, database writer, device permissions or background task. It reads only the selected course snapshot and up to three explicit selected note excerpts, each truncated to 1,500 characters; questions are capped at 500 characters. Source labels appear only when the existing keyword matcher finds a matching selected note. No fabricated references. No private manuscripts were added to the public repository.

Local notes may be held in ordinary browser/device storage, which is not a confidential student record system. Avoid sensitive personal data. Each draft is for personal learning, not proof of attendance, credit, accreditation, professional or clinical qualification.

## Local validation and review gates

Run from the repo root with Node 22:

    npm install --no-audit --no-fund
    npm run typecheck
    npm test
    npm run build
    npm run check:web
    npm run check:browser

Tests assert 12 distinct roles, matched-only source evidence, absence of fabricated notes, coordinator's bounded delegation, long-prompt rejection and text-only draft outputs. CI still needs to pass on the new PR HEAD; remote checks and physical Android/TalkBack testing are separate evidence.

## Follow-on phases (NOT implemented)

- Phase 2: Owner-authorized, per-agent model routing through an authenticated server gateway, provider spend caps, bounded actions and per-call consent.
- Phase 3: Rights-reviewed private full-text retrieval, retrieval evaluation, prompt-injection resistance and citation verification.
- Phase 4: Human-approved assignments/feedback, intervention policies, retention controls, opt-in auditing, accessibility and low-connectivity tests.
- Phase 5: Preview and human reviewed rollout, academic governance, and a separate accreditation pathway if a formally recognized institution is intended.

The existing RC1 branch remains draft with unresolved production/rights/device gates. This PR should be reviewed as an additive feature stacked on RC1; **do not merge or deploy until explicitly authorized**.
