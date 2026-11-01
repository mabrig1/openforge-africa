# PSY 210 — Psychology in the Age of AI (OpenForge Academy)

## Source and license

This track adapts the user-supplied **PSY 210: Psychology in the Age of AI — The Human Mind & Behavior in a Tech-Mediated World, Course Reader & Workbook, Version 1.0, October 2026**. The source explicitly declares **Creative Commons Attribution 4.0 International (CC BY 4.0)**. Attribution is included in code and the student UI. The app's concise review paragraphs are adapted/paraphrased, not the complete manuscript.

This public PR adds a shorter mobile-native teaching track: six module reviews, 18 new three-choice formative questions, proposed 14-week study plan, syllabus assessment distribution, and three fictional five-turn branching interview cases. The separately packaged **offline HTML v4** contains the complete original reader text, 60 *additional* formative questions, seven existing labs, 24 concept cards, weekly exercises, an advanced branching interview script and missed-question review queue. That standalone HTML and ZIP are provided privately to the owner and are **not automatically published, deployed or committed to this PR**.

The source mentions a **separate instructor-only 60-item answer key that was not included in the supplied DOCX**. Neither native app nor standalone edition claims to reproduce that answer key.

## Functional native application

The new /psychology-course route provides six source-aligned reviews; 18 new practice questions (3 per module) with explanations and local best scores; a 14-week syllabus matching the source; read-aloud, Text Reader, local Explainer Studio and private study-circle notes accessible to the Tutor. A marked reading plus 2/3 quiz answers counts only as a **self-study milestone**.

The course's proposed assessment weights total 100%: mood report 15%, bias audit 15%, interview portfolio 25%, capstone 30% and discussion 15%. The app **does not grade these assessments**.

The /psychology-interview route provides **three** fixed fictional situations: academic stress, workplace conflict and relocation. Each contains five scripted dialogue turns with choice-dependent client responses and teaching feedback. Only choice indexes are persisted. There is no live chatbot model, patient text, diagnosis, therapy, professional supervision, or network data transfer.

## Demonstration steps

1. Open /psychology-course and answer the Module 1 quiz with options 2, 1, 3; mark the module read. Confirm 1 / 6 reviewed and practised, then reload.
2. Browse all six modules; verify the final capstone module is present.
3. Create a lesson infographic or video storyboard. The new route reuses the existing offline media studio.
4. Save the module to a private study circle and open Tutor, without paid inference.
5. Open /psychology-interview, Academic stress: choose options 2, 1, 3, 2, 1. Each response changes the fictional dialogue. Reload to test local persistence.
6. Transfer the completed synthetic transcript to the Text Reader.

## Verification and release gates

- Node 22 typecheck and unit tests for coverage, 14 weeks, original syllabus assessment proportions, formative keys and robust course completion.
- Fictional interviews tested for three complete five-turn cases, bounded choice indexes and no free-text patient records.
- Playwright browser smoke checks actual 375px mobile viewport course quiz persistence, media transfer, Tutor source retrieval, interview routing, five turns, reload and reader transfer.
- Existing CI also runs Expo Android export, web export and local Wrangler smoke.
- Physical Android, accessibility/TalkBack, narrow keyboards and real device performance remain unverified until owner testing.
- No new secrets, paid inference, Cloudflare production deployment, merge or claims of accreditation.
- Stacked PR dependencies (#6–#10) remain draft/review-gated.

The source's proposed four university credits do not imply institutional approval. The full standalone HTML OER may be hosted only after owner review and explicit publication authorization. Avoid entering patient or sensitive personal records into unencrypted local learning stores.
