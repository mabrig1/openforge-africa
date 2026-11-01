# OpenForge v13: Research Laboratories and Forge Evidence Portfolio (draft)

This reversible follow-up stacks on **draft PR #14** (four-course Academy). It does not merge, deploy or publish copyrighted manuscripts, and it does not issue course credits.

## 1. FS 101 source-aligned evidence preparation

The user-supplied **FS 101: Introduction to Forge Studies** (8-page syllabus) specifies a five-part Forge Cycle, ten weekly public evidence artifacts and **five externally validated progression gates**: Spark, Builder, Contributor, Launcher and Forger. Its assessment weights are 50% portfolio, 20% peer/mentor review, 15% external contribution, 15% Demo Day. Merely entering a plausible URL is not a substitute for the syllabus's authentic user numbers, independently inspectable public repositories, mentor approvals or demo.

The new `/forge-portfolio` page **reads only existing on-device optional evidence drafts** from `stores/expandedCoursesStore.ts`; it does not create a separate fake reviewer status or public artifact. It lists all ten weekly required artifacts and evidence criteria, shows how many student-supplied HTTPS link fields are filled (**not verified**), provides an edit link to the corresponding weekly source lesson, and explains the five external mentor/reviewer gates.

The private `forge-studies-private-evidence-dossier.txt` is generated locally in the browser as a Blob download or by explicit native OS Share dialog. Each source-aligned entry includes the required proof, self-entered URL/note if valid, and the literal `Independent mentor/reviewer check: NOT PERFORMED`. The document begins with prominent **NOT AN OFFICIAL SUBMISSION** and **UNVERIFIED** statements. Empty and malformed link fields are safely omitted; no external fetch, upload, public posting, credentialing or AI model is invoked.

**Privacy:** do not store names, private interview transcripts, secret access tokens, student IDs, health data, or user analytics in these non-encrypted local drafts. Before anyone shares this report, they should review the contents and secure consent for any third-party information. The user controls the final sharing destination and may cancel.

## 2. Genuine offline decision-science arithmetic

Both labs build on the user-supplied **Human Intelligence, Logic and AI Decision Science** (Mabrig Korie, November 2026, 100-page First Teaching Edition), specifically Units 12–13 and its methods of critical quantitative/causal reasoning.

**`/statistics-lab`**: students enter between 2 and 25 numeric values and get actual sample size, arithmetic mean, median, min/max and sample standard deviation (n−1). The outlier control changes a fictional distribution from `4,5,5,6,7` to `4,5,5,6,7,100`, making the difference between mean and median observable. Invalid, non-numeric, overlong, infinite and out-of-bounds inputs return informative errors. This is descriptive arithmetic, not a population estimate, confidence interval, proof of causality or accredited examination.

**`/causal-lab`**: two fixed **synthetic** tutoring datasets explicitly distinguish aggregate associations from need-group comparisons. In an uneven sample, support participants succeed 54/100 = 54% and others 76/100 = 76%; each within-group comparison nonetheless favors support by +10 percentage points. In the balanced composition scenario the aggregate comparison is +10 pp. This demonstrates Simpson's paradox and risks of confounding. It does **not** imply a true causal effect, a real research finding or an actual randomized trial.

Both labs work fully offline without inference credits. The unit pages link relevant lessons to those labs. The Academy and homepage also link to the portfolio, and Expo Router registers all routes.

## 3. Validation gates

- Pure deterministic Node tests for descriptive statistics, even median, n−1 sample standard deviation, malformed input, reversed versus stratified teaching rates, proof form/source completeness and dossier privacy disclaimers.
- Real Chromium Playwright tests (375px) perform outlier calculations, invalid-input safety, demonstrate reversal, export an actual TXT dossier, inspect its contents and navigate back to weekly lessons.
- Existing workflow also runs all prior subjects, Expo Android and web exports, Wrangler staging dry-run, SPA routing and JS console/error capture.
- **Still required before release:** physical Android/TalkBack verification, copyright/publication review for full authored textbooks, reconciliation of overlapping parallel PR #11 with #12, human vetting of source educational questions and explicit approval for live Cloudflare deployment.

The Academy remains an **independent self-study prototype**. Forge credential status must remain outside client-side self-report until an authenticated, independently verifiable mentor program is genuinely available.
