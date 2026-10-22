# OpenForge Africa v0.2: Architecture and honest capability boundary

## Current implementation

```
Expo Router React Native UI
  ↳ Zustand state & AsyncStorage persistence (version 1 / legacy migration)
      ↳ local study circles
      ↳ source-labelled snippets of course material
      ↳ tasks / deterministic micro-quizzes
  ↳ pure offline lib/study.ts
      ↳ validation, scoring, local progress metrics
      ↳ lexical paragraph retrieval; source attribution
```

The older `lib/db.ts` schema provides a **future** SQLite design, not the source of truth in v0.2. No operation in the current UI calls it. Do not describe this release as using SQLite, vector search, embeddings, cryptography, LLMs, cross-device sync, tutoring integrations, or push notifications.

## Invariants

- Creating and completing tasks never requires internet.
- The Study Coach never makes network requests and cannot invent missing sources.
- Quiz answers are stored within the task on this device. This **is not suitable for high-stakes assessment** or anti-cheating use.
- Progress counts only local events, not retention or learning efficacy.
- Circle membership is a future concept: `memberCount` is legacy scaffolding, not verified identities.
- Deleting a local circle also removes its associated tasks and notes.
- A student entering confidential data into local notes may expose it if the device is compromised; AsyncStorage is not encrypted.
- App uninstall or storage reset may erase data permanently; there is currently no export/backup.

## Threat model & safeguarding

| Threat | Current mitigation | Required before institution pilot |
|---|---|---|
| Unsupported study claim | Explicit local-source citation and no-match response | Human-reviewed evaluation set, hallucination/sourcing tests |
| Imported malicious content | No remote import in v0.2; limited text fields | Input sanitisation, consent, strict schema size and permissions |
| Leaked personal data | No cloud transfer or analytics | Encrypted storage, privacy notices, consent, access controls |
| Quiz cheating | Answer reveal after completion | Server-issued or secured question sets for formal assessment |
| Offline desynchronisation | No cross-device sync claimed | Stable identities, idempotent signed mutations, audit log |
| Stolen/misplaced shared device | No account yet | Device PIN guidance, optional encrypted profiles and session control |
| Exclusion of low-literacy learners | Simple text UI, accessible labels | TalkBack audit, multilingual content, alternative input testing |

## Staged backend strategy (not implemented)

For real collaboration, define user authentication and pseudonymous identities, access-scoped circle memberships, a consent ledger and per-device append-only event queues. On reconnect, exchange only consented events; reject replayed/oversized payloads; make merges deterministic; retain local working copies. Select Cloudflare + D1/R2 or Supabase after evaluating hosting costs, data residency, operational support and institutional policy. No tenant credentials should be embedded in mobile code.

## Validation gates

1. `npm install && npm run typecheck && npm test`.
2. Manual Android smoke checks: launch, create circle, add notes, restart, create discussion and quiz, submit correct/incorrect answers, delete circle.
3. Test disconnected mode, airplane mode, low-storage write failure, TalkBack, font scaling, contrast, orientation, network denial.
4. Before any pilot: independent privacy/security review, supervised accessibility testing, GDPR/NDPA legal review as applicable, consented IRB/ethics procedure.
