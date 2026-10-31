# OpenForge Logic & Critical Thinking — Advanced Practice Labs v0.9

**Status:** code pushed on draft PR #10, stacked on PR #9. No production deployment, merge, public institution accreditation, or paid AI calls. These tools supplement the author's 2026 textbook; the public repo does not contain the full book text.

## 1. Formal Logic Lab: Chapters 8–11

The new `/logic-lab` screen runs a **real deterministic propositional model checker**, entirely on-device. Enter 1–4 premises (one per line) and a conclusion, or leave premises empty to classify a formula. It reports:

- A full truth table for all valuations (1–4 distinct proposition letters, at most 16 rows).
- **Valid** iff no row makes all premises true and the conclusion false.
- **Invalid** with an exact counterexample assignment.
- Formula classification: tautology / contradiction / contingency.
- Guided starter cases: modus ponens, modus tollens, affirming consequent, De Morgan equivalence.
- Student prediction control for validity, followed by immediate feedback.

Grammar: `P Q R S`, `~` (negation), `&` (conjunction), `|` (inclusive disjunction), `->` (material implication), `<->` (biconditional), and parentheses. Corresponding Unicode `¬ ∧ ∨ → ⇔` is supported. Implication is right-associative; conjunction binds more tightly than disjunction, followed by implication and biconditional. Enter parentheses when in doubt. The bounded parser rejects extraneous input and **never uses eval**.

Examples:

| Input | Actual logical result |
|---|---|
| Premises `P -> Q`, `P`; conclusion `Q` | Valid |
| Premises `P -> Q`, `Q`; conclusion `P` | Invalid; P=F, Q=T |
| `~(P & Q) <-> (~P \| ~Q)` | Tautology |
| `P & ~P` | Contradiction |
| `P \| Q` | Contingency |

**Important:** This cannot verify whether empirical premises are true. It is not a full predicate-logic prover, no theorem proving beyond 4 classical propositional letters, no exam proctoring or formal university grading.

## 2. Applied Reasoning Capstone Studio: Chapter 23

The new `/capstone` screen implements the author's practical project specification:

- Question, scope, abstract (target 150–250 words), definitions, source-search method, argument reconstruction/map, alternative explanations, objections, recommendation, references, formalization/limits, oral-defense plan, explicit AI assistance disclosure and revised-belief reflection.
- Draft word count guidance: **3,000–5,000 body words**, excluding the separately counted abstract, title and defense/disclosure sections. Counting is not assessment of correctness.
- Source-aligned 100-point **rubric for human evaluation**: question/scope (10), reconstruction (15), evidence (20), logical rigor (20), alternatives/objections (15), clarity/referencing (10), oral defense (10).
- Browser TXT download and explicit native share, optional defense-summary storyboard in the existing Visual Studio.
- Draft stored locally in AsyncStorage, capped fields, migration filtering and confirmation before reset. **No automatic upload, third-party citation lookup, cloud sync or publicly readable link.** Storage is not encrypted; shared devices are a privacy risk.

The source textbook specifies the **3,000–5,000-word written argument and 6–10-minute oral video defense**, subject to accessibility alternatives; the studio cannot record or independently evaluate a defense by itself. Its checklist is **not a grade or qualification**.

## 3. How to demonstrate

1. Start the current PR branch in a local Expo/Cloudflare preview.
2. Visit `/logic-lab`. The initial example `P -> Q; Q; therefore P` correctly produces an invalidating valuation **P=F, Q=T**.
3. Load the **Modus ponens** case and inspect the actual full four-row table. It should show **Valid**.
4. Load De Morgan; it should show **Tautology** on all four rows.
5. Open `/capstone`, enter a fictional research question, AI-use statement, reload and verify local persistence, then download a TXT draft and inspect its contents.
6. Check the offline course navigation remains intact and that neither tool triggers an AI request or microphone permission.

CI includes unit tests for parsing, Unicode equivalence, validity, invalid inputs and rubric targets, plus browser smoke for real calculations and draft persistence/download.

## 4. Gates before public review

Check current GitHub Actions for the **head commit**, not earlier red commits. Physical Android/TalkBack, low-memory device, keyboard input and privacy checks still need owner testing. Do not enable an unbounded public OpenRouter gateway or claim independent learning effectiveness. Review PRs #6, #7, #8 and #9 as stacked dependencies. Cloudflare production still requires a separately authorized and tested deployment.

## 5. Standalone full-text private edition

The author has separately received a **downloadable private, standalone full-text HTML course** derived from the uploaded manuscript; the upgraded v2 package adds the same proof-calculator and chapter-23 writing draft functionality. It is not automatically committed to this public repository. The author must approve distribution and licensing before publishing the full text as a public static asset.
